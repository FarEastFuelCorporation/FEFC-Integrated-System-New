import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
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

const TruckScale = ({ user }) => {
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
      const response = await axios.get(`${apiUrl}/api/truckScale`);
      const responseClient = await axios.get(`${apiUrl}/api/client`);
      const quotationResponse = await axios.get(
        `${apiUrl}/api/quotation/waste`
      );

      setTruckScales(response.data.truckScales);
      setClients(responseClient.data.clients);
      setQuotations(quotationResponse.data.quotations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const grossWeight = Number(formData.grossWeight) || 0;
    const tareWeight = Number(formData.tareWeight) || 0;

    const netWeight = grossWeight - tareWeight;

    setFormData((prevData) => ({
      ...prevData,
      netWeight, // Update netWeight
    }));
  }, [formData.grossWeight, formData.tareWeight]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if (!formData.clientId) {
      setClientWasteNames([]);
      // Reset commodity when clientId is cleared
      setFormData((prev) => ({ ...prev, commodity: "" }));
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
    setFormData((prev) => ({ ...prev, commodity: "" }));
  }, [formData.clientId, quotations]);

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
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/; // Validates HH:mm or HH:mm:ss format

        return time && timeRegex.test(time);
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
      await axios.delete(`${apiUrl}/api/scrapType/${id}`, {
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

      fetchData();
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
      minWidth: 60,
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
      minWidth: 150,
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

            // Print window dimensions and position
            const windowWidth = 800;
            const windowHeight = 600;
            const windowLeft = (window.innerWidth - windowWidth) / 2;
            const windowTop = (window.innerHeight - windowHeight) / 2;

            // Open the print window
            const printWindow = window.open(
              "",
              "_blank",
              `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`
            );

            // Check if the window was successfully opened
            if (printWindow) {
              // Insert HTML content into the print window
              const htmlContent = generatePrintHTML(params);
              printWindow.document.write(htmlContent);

              // Ensure the logo is loaded before triggering print
              const logoImage = printWindow.document.getElementById("logo");
              logoImage.onload = function () {
                printWindow.document.close(); // Close the document after the image is loaded
                printWindow.print(); // Trigger the print dialog

                // Automatically close the print window after printing
                printWindow.onafterprint = () => {
                  printWindow.close();
                };
              };

              // In case the image fails to load, trigger print anyway (as a fallback)
              logoImage.onerror = function () {
                printWindow.document.close();
                printWindow.print();
              };
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

  const generatePrintHTML = (params) => {
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
          rows={truckScales ? truckScales : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "typeOfScrap", sort: "asc" }],
            },
          }}
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
