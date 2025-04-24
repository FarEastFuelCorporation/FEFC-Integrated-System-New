import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import QRCode from "qrcode";
import { tokens } from "../../../../../theme";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import Header from "../../../HR/sections/Header";
import SectionModal from "./Modal";
import { validateTruckScaleForm } from "./Validation";
import { formatDate3 } from "../../../../../JD/OtherComponents/Functions";
import {
  formatNumber,
  formatTime2,
  formatTime4,
} from "../../../../../OtherComponents/Functions";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const TruckScale = ({ user, socket }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    transactionType: "INBOUND",
    clientId: "",
    clientName: "",
    commodity: "",
    plateNumber: "",
    driver: "",
    remarks: "",
    firstScaleDate: "",
    firstScaleTime: "",
    secondScaleDate: "",
    secondScaleTime: "",
    grossWeight: 0,
    tareWeight: 0,
    netWeight: 0,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [truckScales, setTruckScales] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientNames, setClientNames] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [clientWasteNames, setClientWasteNames] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const [loadingRowId, setLoadingRowId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch truck scale, client, and quotation data
      const response = await axios.get(`${apiUrl}/api/truckScale`);
      const responseClient = await axios.get(`${apiUrl}/api/client`);
      const quotationResponse = await axios.get(
        `${apiUrl}/api/quotation/waste`
      );

      // Set state for truckScales, clients, and quotations
      setTruckScales(response.data.truckScales);
      setClients(responseClient.data.clients);
      setQuotations(quotationResponse.data.quotations);

      // Get unique client data from the client response (clientId and clientName)
      const clientData = responseClient.data.clients
        .map((client) => ({
          clientId: client.id,
          clientName: client.name,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.clientId === value.clientId &&
                t.clientName === value.clientName
            )
        );

      // Get client names from truck scales
      const clientNamesFromTruckScales = response.data.truckScales
        .map((truckScale) => truckScale.clientName)
        .filter(
          (value, index, self) => index === self.findIndex((t) => t === value)
        );

      // Merge client names from both sources (clientData and truckScales)
      const mergedClientData = [
        ...clientData,
        ...clientNamesFromTruckScales
          .filter(
            (clientName) =>
              !clientData.some((client) => client.clientName === clientName) // Ensure no duplicates
          )
          .map((clientName) => ({
            clientId: null, // Set clientId as null for truck scale client names
            clientName,
          })),
      ];

      // Set the merged client names
      setClientNames(mergedClientData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "NEW_TRUCK_SCALE") {
          setTruckScales((prevData) => {
            // Check if the clientName exists in the current truckScales state
            const clientExists = prevData.some(
              (truckScale) => truckScale.clientName === message.data.clientName
            );

            // If the clientName doesn't exist, add it to the state
            if (!clientExists) {
              return [...prevData, message.data];
            }

            // If the clientName exists, just return the previous data
            return prevData;
          });
        } else if (message.type === "UPDATE_TRUCK_SCALE") {
          setTruckScales((prevData) => {
            // Find the index of the data to be updated
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              // Replace the updated data
              const updatedData = [...prevData];
              updatedData[index] = message.data;

              // Check if the updated truck scale has a new clientName, and add it if it doesn't exist
              const clientExists = updatedData.some(
                (truckScale) =>
                  truckScale.clientName === message.data.clientName
              );

              if (!clientExists) {
                updatedData[index] = {
                  ...updatedData[index],
                  clientName: message.data.clientName,
                };
              }

              return updatedData.sort((a, b) => {
                const aNum = parseInt(a.truckScaleNo.slice(2), 10);
                const bNum = parseInt(b.truckScaleNo.slice(2), 10);
                return bNum - aNum; // Descending order
              });
            }

            // If the data is not found, just return the previous state
            return prevData;
          });
        } else if (message.type === "DELETED_TRUCK_SCALE") {
          setTruckScales((prevData) => {
            // Remove the data with matching ID
            const updatedData = prevData.filter(
              (prev) => prev.id !== message.data
            );
            return updatedData;
          });
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    if (formData.transactionType === "INBOUND") {
      const grossWeight = Number(formData.grossWeight) || 0;
      const tareWeight = Number(formData.tareWeight) || 0;

      const netWeight = grossWeight - tareWeight;

      setFormData((prevData) => ({
        ...prevData,
        netWeight, // Update netWeight
      }));
    } else if (formData.transactionType === "OUTBOUND") {
      const grossWeight = Number(formData.grossWeight) || 0;
      const tareWeight = Number(formData.tareWeight) || 0;

      const netWeight = tareWeight - grossWeight;

      setFormData((prevData) => ({
        ...prevData,
        netWeight, // Update netWeight
      }));
    }
  }, [formData.grossWeight, formData.transactionType, formData.tareWeight]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if (!formData.clientId) {
      setClientWasteNames([]);
      // Reset commodity when clientId is cleared
      if (!formData.id) {
        setFormData((prev) => ({ ...prev, commodity: "" }));
      }
      return;
    }

    const filteredQuotations = quotations.filter(
      (q) => q.clientId === formData.clientId
    );

    const allWasteNames = filteredQuotations
      .flatMap((q) => q.QuotationWaste || [])
      .map((waste) => waste.wasteName);

    setClientWasteNames(allWasteNames);

    // Reset commodity when clientId changes
    if (!formData.id) {
      setFormData((prev) => ({ ...prev, commodity: "" }));
    }
  }, [formData.clientId, formData.id, quotations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessMessage]);

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
    setErrorMessage("");
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (row) => {
    if (row) {
      const isValidDate = (date) => date && !isNaN(new Date(date).getTime());
      const isValidTime = (time) => {
        const timeRegex =
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/.test(time); // Validates HH:mm or HH:mm:ss format

        console.log(timeRegex);
        return timeRegex ? timeRegex : "";
      };

      setFormData({
        id: row.id,
        truckScaleNo: row.truckScaleNo,
        transactionType: row.transactionType,
        clientName: row.clientName,
        commodity: row.commodity,
        plateNumber: row.plateNumber,
        driver: row.driver,
        remarks: row.remarks,
        firstScaleDate: row.firstScaleDate,
        firstScaleTime: row.firstScaleTime,
        secondScaleDate: isValidDate(row.secondScaleDate)
          ? row.secondScaleDate
          : "",
        secondScaleTime: isValidTime(row.secondScaleTime)
          ? row.secondScaleTime
          : "",
        grossWeight: row.grossWeight,
        tareWeight: row.tareWeight,
        netWeight: row.netWeight,
        createdBy: user.id,
      });

      handleOpenModal();
    } else {
      console.error(`Truck Scale with ID ${row.id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Truck Scale?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/truckScale/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Truck Scale Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateTruckScaleForm(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing truck scale
        await axios.put(`${apiUrl}/api/truckScale/${formData.id}`, formData);

        setSuccessMessage("Truck Scale Updated Successfully!");
      } else {
        // Add new truck scale
        await axios.post(`${apiUrl}/api/truckScale`, formData);

        setSuccessMessage("Truck Scale Added Successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "truckScaleNo",
      headerName: "Truck Scale No.",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      sortComparator: (v1, v2) => {
        const n1 = parseInt(v1.slice(2)); // remove "TS" and parse number
        const n2 = parseInt(v2.slice(2));
        return n1 - n2;
      },
      sortable: true,
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 90,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "commodity",
      headerName: "Commodity",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "driver",
      headerName: "Driver",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "plateNumber",
      headerName: "Plate Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "grossWeight",
      headerName: "Gross Weight (KG)",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const transactionType = params.row.transactionType;
        const secondScaleDate = params.row.secondScaleDate;
        const grossWeight = params.value;

        const isValidDate =
          secondScaleDate && !isNaN(new Date(secondScaleDate).getTime());

        if (transactionType === "INBOUND") {
          return formatNumber(grossWeight);
        } else if (transactionType === "OUTBOUND") {
          return isValidDate ? formatNumber(grossWeight) : "PENDING";
        } else {
          return "N/A";
        }
      },
    },
    {
      field: "tareWeight",
      headerName: "Tare Weight",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const transactionType = params.row.transactionType;
        const secondScaleDate = params.row.secondScaleDate;
        const tareWeight = params.value;

        const isValidDate =
          secondScaleDate && !isNaN(new Date(secondScaleDate).getTime());

        if (transactionType === "OUTBOUND") {
          return formatNumber(tareWeight);
        } else if (transactionType === "INBOUND") {
          return isValidDate ? formatNumber(tareWeight) : "PENDING";
        } else {
          return "N/A";
        }
      },
    },
    {
      field: "netWeight",
      headerName: "Net Weight",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const secondScaleDate = params.row.secondScaleDate;
        const netWeight = params.value;

        const isValidDate =
          secondScaleDate && !isNaN(new Date(secondScaleDate).getTime());

        return isValidDate ? formatNumber(netWeight) : "PENDING";
      },
    },
    {
      field: "firstScaleDate",
      headerName: "1st Scale Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => {
        return formatDate3(params.value);
      },
    },
    {
      field: "firstScaleTime",
      headerName: "1st Scale Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
    },
    {
      field: "secondScaleDate",
      headerName: "2nd Scale Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => {
        const value = params.value;
        const isValidDate = value && !isNaN(new Date(value).getTime());

        return isValidDate ? formatDate3(value) : "PENDING";
      },
    },
    {
      field: "secondScaleTime",
      headerName: "2nd Scale Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => {
        const value = params.value;
        const isValidTime =
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/.test(value); // Validates HH:mm or HH:mm:ss format

        return isValidTime ? value : "PENDING";
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      minWidth: 130,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return `${params.row.Employee.firstName} ${params.row.Employee.lastName}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "view",
      headerName: "Print",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const secondScaleDate = params.row.secondScaleDate;
        const isValidDate =
          secondScaleDate && !isNaN(new Date(secondScaleDate).getTime());

        if (!isValidDate) return "N/A";

        const handlePrintClick = async () => {
          try {
            setLoading(true);
            const id = params.row.id;
            setLoadingRowId(id);

            const windowWidth = 800;
            const windowHeight = 600;
            const windowLeft = (window.innerWidth - windowWidth) / 2;
            const windowTop = (window.innerHeight - windowHeight) / 2;

            const printWindow = window.open(
              "",
              "_blank",
              `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`
            );

            if (printWindow) {
              // Ensure the content is fully generated and resolved before writing to printWindow
              const htmlContent = await generatePrintHTML(params); // Ensure it's awaited properly
              if (typeof htmlContent === "string") {
                printWindow.document.write(htmlContent);

                // Ensure the print window fully loads before attempting to print
                const logoImage = printWindow.document.getElementById("logo");
                if (logoImage) {
                  logoImage.onload = function () {
                    printWindow.document.close();
                    printWindow.print();
                    printWindow.onafterprint = () => {
                      printWindow.close();
                    };
                  };

                  logoImage.onerror = function () {
                    printWindow.document.close();
                    printWindow.print();
                  };
                }
              } else {
                console.error("Error: HTML content is not a string.");
              }
            } else {
              console.error("Failed to open print window.");
            }
          } catch (error) {
            console.error("Error fetching document file:", error);
            alert(
              error.response?.data?.message ||
                "An error occurred while fetching the transaction. Please try again."
            );
          } finally {
            setLoading(false);
            setLoadingRowId(null);
          }
        };

        return (
          <Button
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={handlePrintClick}
          >
            {loadingRowId === params.row.id ? "Loading..." : "PRINT"}
          </Button>
        );
      },
    },
  ];

  if (user.userType === 4) {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    );
  }

  const generatePrintHTML = async (params) => {
    const qrCodeURL = `${modifyApiUrlPort(apiUrl)}/truckScaleView/${
      params.row?.id
    }`;

    // Generate the QR code as a data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL);

    return `
      <html>
        <head>
          <title>Print Transaction</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin-top: 20px;   /* Top margin */
              margin-left: 10px;  /* Left margin */
              margin-right: 10px; /* Right margin */
              padding: 0;
              width: 4.25in; /* Size of 1/4 Legal */
              height: 6.5in;
            }
            .container {
              padding: 10px;
              box-sizing: border-box;
            }
            .header {
              font-size: 20px;
              font-weight: bold;
            }
            .logo {
              text-align: center;
            }
            .logo img {
              max-width: 150px;
              height: auto;
            }
            .details {
              margin-top: 20px;
              font-size: 12px;
            }
            .details p {
              margin: 5px 0;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header with Logo -->
            <div style="display: flex;">
              <div class="logo">
                <img id="logo" src="/assets/logo.png" alt="FAR EAST FUEL CORPORATION Logo" style="width: 0.6in; height: 0.6in;" />
              </div>
              <div style="margin-left: 10px;">
                <div class="header" style="font-size: 20px">
                  FAR EAST FUEL CORPORATION
                </div>
                <div>888 Irabagon St, Purok 5, Brgy. Anyatam, San Ildefonso, Bulacan</div>
              </div>
            </div>
            <div class="details">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px; width: 50%;"><strong>Truck Scale #:</strong></td>
                  <td style="padding: 5px; width: 50%;">${
                    params.row.truckScaleNo
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Transaction Type:</strong></td>
                  <td style="padding: 5px;">${params.row.transactionType}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Client:</strong></td>
                  <td style="padding: 5px;">${params.row.clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Commodity:</strong></td>
                  <td style="padding: 5px;">${params.row.commodity}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Plate Number:</strong></td>
                  <td style="padding: 5px;">${params.row.plateNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Driver:</strong></td>
                  <td style="padding: 5px;">${params.row.driver}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Weigh IN:</strong></td>
                  <td style="padding: 5px;">${formatDate3(
                    params.row.firstScaleDate
                  )}<br />${formatTime2(params.row.firstScaleTime)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Weigh OUT:</strong></td>
                  <td style="padding: 5px;">${formatDate3(
                    params.row.secondScaleDate
                  )}<br />${formatTime2(params.row.secondScaleTime)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Gross Weight:</strong></td>
                  <td style="padding: 5px;">${formatNumber(
                    params.row.grossWeight
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Tare Weight:</strong></td>
                  <td style="padding: 5px;">${formatNumber(
                    params.row.tareWeight
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Net Weight:</strong></td>
                  <td style="padding: 5px;">${formatNumber(
                    params.row.netWeight
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Weigher:</strong></td>
                  <td style="padding: 5px;">${params.row.Employee.firstName} ${
      params.row.Employee.lastName
    }</td>
                </tr>
                <tr>
                  <td style="padding: 5px;"><strong>Remarks:</strong></td>
                  <td style="padding: 5px;">${params.row.remarks}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;">Scan this QR code to verify the authenticity of the transaction.</td>
                  <td style="padding: 5px;">            
                    <img src="${qrCodeDataUrl}" alt="QR Code" width="80" height="80" />
                </td>
                </tr>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Truck Scale" subtitle="List of Transactions" />
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      />
      <CustomDataGridStyles>
        <DataGrid
          rows={truckScales ?? []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          sortModel={[
            {
              field: "truckScaleNo",
              sort: "desc",
            },
          ]}
        />
      </CustomDataGridStyles>
      <SectionModal
        open={openModal}
        onClose={handleCloseModal}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
        formData={formData}
        clients={clients}
        clientWasteNames={clientWasteNames}
      />
    </Box>
  );
};

export default TruckScale;
