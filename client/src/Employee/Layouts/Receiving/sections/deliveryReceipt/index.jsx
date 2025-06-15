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
import { validateGatePassForm } from "./Validation";
import { formatDate3 } from "../../../../../JD/OtherComponents/Functions";
import { formatTime2 } from "../../../../../OtherComponents/Functions";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const DeliveryReceipt = ({ user, socket }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    deliveryReceiptNo: "",
    dateOfDelivery: "",
    company: "",
    address: "",
    driver: "",
    plateNumber: "",
    remarks: "",
    items: [
      {
        description: "",
        quantity: "",
        unit: "",
      },
    ],
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [deliveryReceipts, setDeliveryReceipts] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientNames, setClientNames] = useState([]);
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
      const response = await axios.get(`${apiUrl}/api/deliveryReceipt`);
      const responseTruckScale = await axios.get(`${apiUrl}/api/truckScale`);
      const responseClient = await axios.get(`${apiUrl}/api/client`);

      // Set state for deliveryReceipts, clients, and
      setDeliveryReceipts(response.data.deliveryReceipts);
      setClients(responseClient.data.clients);

      // Get unique client data from the client response (clientId and clientName)
      const clientData = responseClient.data.clients
        .map((client) => ({
          clientId: client.id,
          clientName: client.clientName,
          address: client.address,
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
      const clientNamesFromTruckScales = responseTruckScale.data.truckScales
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

        if (message.type === "NEW_DELIVERY_RECEIPT") {
          setDeliveryReceipts((prevDeliveryReceipts) => {
            const updatedDeliveryReceipts = [
              ...prevDeliveryReceipts,
              message.data,
            ];

            // Sort by deliveryReceiptNo in descending order (assuming format like 'DR20250001')
            updatedDeliveryReceipts.sort((a, b) => {
              const aNum = parseInt(a.deliveryReceiptNo.slice(2), 10);
              const bNum = parseInt(b.deliveryReceiptNo.slice(2), 10);
              return bNum - aNum;
            });

            return updatedDeliveryReceipts;
          });
        } else if (message.type === "UPDATE_DELIVERY_RECEIPT") {
          setDeliveryReceipts((prevData) => {
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              const updatedData = [...prevData];
              updatedData[index] = message.data;

              // Sort by deliveryReceiptNo descending (e.g., DR20250001)
              updatedData.sort((a, b) => {
                const aNum = parseInt(a.deliveryReceiptNo?.slice(2) || "0", 10);
                const bNum = parseInt(b.deliveryReceiptNo?.slice(2) || "0", 10);
                return bNum - aNum;
              });

              return updatedData;
            }

            // If not found, return the previous state unchanged
            return prevData;
          });
        } else if (message.type === "DELETED_DELIVERY_RECEIPT") {
          setDeliveryReceipts((prevData) => {
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

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
    if (!row) {
      console.error("No row data provided for editing.");
      return;
    }

    // Fill in all required form fields, fallback to empty strings if necessary
    setFormData({
      id: row.id || "",
      gatePassNo: row.gatePassNo || "",
      dateIn: row.dateIn || "",
      timeIn: row.timeIn || "",
      dateOut: row.dateOut || "",
      timeOut: row.timeOut || "",
      issuedTo: row.issuedTo || "",
      address: row.address || "",
      plateNumber: row.plateNumber || "",
      vehicle: row.vehicle || "",
      category: row.category || "",
      category2: row.category2 || "",
      remarks: row.remarks || "",
      truckScaleNo: row.truckScaleNo || "",
      items: row.items?.length
        ? row.items.map((item) => ({
            description: item.description || "",
            quantity: item.quantity || "",
            unit: item.unit || "",
          }))
        : [
            {
              description: "",
              quantity: "",
              unit: "",
            },
          ],
      createdBy: user.id,
    });

    handleOpenModal(); // Trigger modal to open for editing
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Delivery Receipt?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/deliveryReceipt/${id}`, {
        data: { deletedBy: user.id },
      });

      setSuccessMessage("Delivery Receipt Deleted Successfully!");
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

    const validationErrors = validateGatePassForm(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing truck scale
        await axios.put(
          `${apiUrl}/api/deliveryReceipt/${formData.id}`,
          formData
        );

        setSuccessMessage("Delivery Receipt Updated Successfully!");
      } else {
        // Add new truck scale
        await axios.post(`${apiUrl}/api/deliveryReceipt`, formData);

        setSuccessMessage("Delivery Receipt Added Successfully!");
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
      field: "deliveryReceiptNo",
      headerName: "DR No.",
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
      field: "dateOfDelivery",
      headerName: "Delivery Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => {
        return formatDate3(params.value);
      },
    },
    {
      field: "company",
      headerName: "Company",
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
      field: "driver",
      headerName: "Driver",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 70,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
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
      minWidth: 80,
      renderCell: (params) => {
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
    const qrCodeURL = `${modifyApiUrlPort(apiUrl)}/deliveryReceiptView/${
      params.row?.id
    }`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL);

    return `
      <html>
        <head>
          <title>Print Transaction</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0.25in;
              padding: 0;
              width: 8.5in;  /* Letter width */
              height: 11in;  /* Letter height */
              box-sizing: border-box;
              font-size: 12px;
            }
            .container {
              width: calc(100% - 0.25in);
              height: calc(50%);
              overflow: hidden;
              margin-bottom: -0.25in;
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
              font-size: 12px;
              display: flex;
            }
            .details p {
              margin: 5px 0;
              font-size: 12px;
            }
              table, th, td {
              border: 1px solid black;
              font-size: 12px;
              text-align: center;
              height: 17px;
            }
            td {
              padding: 2.5px 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
  <div style="display: flex; border: 1px solid black; width: 100%">
    <div style="display: flex; flex-direction: column; width: 70%">
      <div style="display: flex">
        <div class="logo">
          <img
            id="logo"
            src="/assets/logo.png"
            alt="FAR EAST FUEL CORPORATION Logo"
            style="width: 0.6in; height: 0.6in"
          />
        </div>
        <div style="margin-left: 10px">
          <div class="header" style="font-size: 20px">
            FAR EAST FUEL CORPORATION
          </div>
          <div>
            888 Irabagon St, Purok 5, Brgy. Anyatam, San Ildefonso, Bulacan
          </div>
          <div>Email: info@fareastfuelcorp.com Tel #; (044 813 9037)</div>
        </div>
      </div>
    </div>
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 30%;
        border-left: 1px solid black;
      "
    >
      <div style="text-align: center">
        <div
          class="header"
          style="font-size: 20px; background-color: #008000; color: white"
        >
          Delivery Receipt #
        </div>
        <div style="font-size: 29.5px; font-weight: bold">
          ${params.row.deliveryReceiptNo}
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; border: 1px solid black; width: 100%">
    <div style="display: flex; flex-direction: column; width: 70%">
      <div style="display: flex; border-top: 1px solid black">
        <div style="padding: 2.5px 5px; width: 10.5%">Company:</div>
        <div style="padding: 2.5px 5px; border-left: 1px solid black">
          <strong>${params.row.company}</strong>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; width: 30%">
      <div style="display: flex; border-top: 1px solid black">
        <div
          style="padding: 2.5px 5px; border-left: 1px solid black; width: 50%"
        >
          Delivery Date:
        </div>
        <div style="padding: 2.5px 5px; border-left: 1px solid black">
          <strong>${params.row.dateOfDelivery}</strong>
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; border: 1px solid black; width: 100%">
    <div>
      <div style="display: flex; border-top: 1px solid black">
        <div style="padding: 2.5px 5px; width: 15%">Address:</div>
        <div style="padding: 2.5px 5px; border-left: 1px solid black">
          <strong>${params.row.address}</strong>
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; border: 1px solid black; width: 100%">
    <div style="display: flex; flex-direction: column; width: 70%">
      <div style="display: flex; border-top: 1px solid black">
        <div style="padding: 2.5px 5px; width: 15%">Driver:</div>
        <div style="padding: 2.5px 5px; border-left: 1px solid black">
          <strong>${params.row.driver}</strong>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; width: 30%">
      <div style="display: flex; border-top: 1px solid black">
        <div
          style="padding: 2.5px 5px; border-left: 1px solid black; width: 50%"
        >
          Plate Number:
        </div>
        <div style="padding: 2.5px 5px; border-left: 1px solid black">
          <strong>${params.row.plateNumber}</strong>
        </div>
      </div>
    </div>
  </div>
            <div class="details">
              <table style="width: 100%; border-collapse: collapse">
                <!-- Table content remains the same -->
                <tr>
                  <td style="padding: 2.5px 5px; width: 10%"><strong>Item #:</strong></td>
                  <td style="padding: 2.5px 5px; width: 50%">
                    <strong>Truck Scale #:</strong>
                  </td>
                  <td style="padding: 2.5px 5px; width: 20%">
                    <strong>Quantity:</strong>
                  </td>
                  <td style="padding: 2.5px 5px; width: 20%"><strong>Unit:</strong></td>
                </tr>
                ${params.row.DeliveryReceiptItem.map(
                  (item, index) => `
                  <tr>
                    <td style="padding: 2.5px 5px;">${index + 1}</td>
                    <td style="padding: 2.5px 5px;">${item.description}</td>
                    <td style="padding: 2.5px 5px;">${item.quantity}</td>
                    <td style="padding: 2.5px 5px;">${item.unit}</td>
                  </tr>
                `
                ).join("")}
                
                ${Array(12 - params.row.DeliveryReceiptItem.length)
                  .fill()
                  .map(
                    (_, index) => `
                  <tr>
                    <td style="padding: 2.5px 5px;"></td>
                    <td style="padding: 2.5px 5px;">${
                      index === 0
                        ? "<i>-------------------- Nothing Follows --------------------</i>"
                        : ""
                    }</td>
                    <td style="padding: 2.5px 5px;">${
                      index === 0 ? "<i>--------------------</i>" : ""
                    }</td>
                    <td style="padding: 2.5px 5px;">${
                      index === 0 ? "<i>--------------------</i>" : ""
                    }</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
            <div style="display: flex; width: 100%; border: 1px solid black">
              <div
                style="box-sizing: border-box; width: 60%; padding: 5px; display: flex"
              >
                <div>Remarks:</div>
                <div style="text-align: center">
                  ${params.row.remarks ? params.row.remarks : "NO REMARKS"}
                </div>
              </div>
              <div
                style="
                  box-sizing: border-box;
                  width: 40%;
                  padding: 5px;
                  border-left: 1px solid black;
                  display: flex;
                "
              >
                <div>Truck Scale #:</div>
                <div style="text-align: center">${params.row.truckScaleNo}</div>
              </div>
            </div>
            <div style="display: flex; width: 100%; border: 1px solid black">
              <div
                style="
                  box-sizing: border-box;
                  width: calc((100% - 80px) / 5);
                  height: 80px;
                  padding: 5px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <div>Prepared By:</div>
                <div style="text-align: center">
                  <u
                    >${params.row.Employee.firstName} ${
      params.row.Employee.lastName
    }</u
                  >
                </div>
              </div>
              <div
                style="
                  box-sizing: border-box;
                  width: calc((100% - 80px) / 5);
                  height: 80px;
                  padding: 5px;
                  border-left: 1px solid black;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <div>Checked By:</div>
                <div style="text-align: center"><u>_________________</u></div>
              </div>
              <div
                style="
                  box-sizing: border-box;
                  width: calc((100% - 80px) / 5);
                  height: 80px;
                  padding: 5px;
                  border-left: 1px solid black;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <div>Approved By:</div>
                <div style="text-align: center"><u>_________________</u></div>
              </div>
              <div
                style="
                  box-sizing: border-box;
                  width: calc((100% - 80px) / 5);
                  height: 80px;
                  padding: 5px;
                  border-left: 1px solid black;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <div>Accounting:</div>
                <div style="text-align: center"><u>_________________</u></div>
              </div>
              <div
                style="
                  box-sizing: border-box;
                  width: calc((100% - 80px) / 5);
                  height: 80px;
                  padding: 5px;
                  border-left: 1px solid black;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <div>Released By:</div>
                <div style="text-align: center">
                  _________________ <br />GUARD ON DUTY
                </div>
              </div>
              <div
                style="
                  box-sizing: border-box;
                  padding: 2.5px 5px;
                  border-left: 1px solid black;
                "
              >
                <img src="${qrCodeDataUrl}" alt="QR Code" width="80px" height="80px" />
              </div>
            </div>
            <div style="padding: 2.5px 5px">
              Scan this QR code to verify the authenticity of the transaction.
            </div>
          </div>
          <hr />

        </body>
      </html>
    `;
  };

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Delivery Receipt"
          subtitle="List of Delivery Receipts Transactions"
        />
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
          rows={deliveryReceipts ?? []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          sortModel={[
            {
              field: "gatePassNo",
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
        clients={clientNames}
        clientWasteNames={clientWasteNames}
      />
    </Box>
  );
};

export default DeliveryReceipt;
