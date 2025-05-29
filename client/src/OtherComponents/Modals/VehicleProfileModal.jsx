import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  useTheme,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import { formatNumber } from "../Functions";
import SuccessMessage from "../SuccessMessage";
import { format, set } from "date-fns";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import ConfirmationDialog from "../ConfirmationDialog";

const maintenanceRows = [
  {
    id: 9,
    date: "2025-04-05T08:00:00.000Z",
    dueDate: "2025-07-05T08:00:00.000Z",
    createdAt: "2025-04-05T09:00:00.000Z",
  },
  {
    id: 8,
    date: "2025-01-05T08:00:00.000Z",
    dueDate: "2025-04-05T08:00:00.000Z",
    createdAt: "2025-01-05T09:00:00.000Z",
  },
  {
    id: 7,
    date: "2024-10-05T08:00:00.000Z",
    dueDate: "2025-01-05T08:00:00.000Z",
    createdAt: "2024-10-05T09:00:00.000Z",
  },
  {
    id: 6,
    date: "2024-07-05T08:00:00.000Z",
    dueDate: "2024-10-05T08:00:00.000Z",
    createdAt: "2024-07-05T09:00:00.000Z",
  },
  {
    id: 5,
    date: "2024-04-05T08:00:00.000Z",
    dueDate: "2024-07-05T08:00:00.000Z",
    createdAt: "2024-04-05T09:00:00.000Z",
  },
  {
    id: 4,
    date: "2024-01-05T08:00:00.000Z",
    dueDate: "2024-04-05T08:00:00.000Z",
    createdAt: "2024-01-05T09:00:00.000Z",
  },
  {
    id: 3,
    date: "2023-10-05T08:00:00.000Z",
    dueDate: "2024-01-05T08:00:00.000Z",
    createdAt: "2023-10-05T09:00:00.000Z",
  },
  {
    id: 2,
    date: "2023-07-05T08:00:00.000Z",
    dueDate: "2023-10-05T08:00:00.000Z",
    createdAt: "2023-07-05T09:00:00.000Z",
  },
  {
    id: 1,
    date: "2023-04-05T08:00:00.000Z",
    dueDate: "2023-07-05T08:00:00.000Z",
    createdAt: "2023-04-05T09:00:00.000Z",
  },
];

const VehicleProfileModal = ({
  user,
  selectedRow,
  open,
  handleClose,
  handleEditClick,
  selectedTab,
  setSelectedTab,
}) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fileName, setFileName] = useState("");
  const [fileNameToSubmit, setFileNameToSubmit] = useState("");
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [attachmentData, setAttachmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const rowHeight = 52; // Default row height in Material-UI DataGrid
  const headerHeight = 56; // Default header height

  const attachmentTableHeight =
    attachmentData.length === 0
      ? rowHeight + headerHeight
      : attachmentData.length * rowHeight + headerHeight;

  const maintenanceTableHeight =
    maintenanceData.length === 0
      ? rowHeight + headerHeight
      : maintenanceData.length * rowHeight + headerHeight;

  const fetchData = useCallback(async () => {
    if (!selectedRow || !selectedRow.plateNumber) {
      return;
    }
    setLoadingData(true);
    try {
      const vehicleAttachmentResponse = await axios.get(
        `${apiUrl}/api/vehicleAttachment/${selectedRow.plateNumber}`
      );

      setAttachmentData(vehicleAttachmentResponse.data.vehicleAttachments);

      setMaintenanceData(selectedRow.maintenanceHistory || maintenanceRows);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoadingData(false);
    }
  }, [apiUrl, selectedRow]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  let employeePicture;

  if (
    selectedRow &&
    selectedRow.picture &&
    selectedRow.picture.data &&
    selectedRow.picture.type
  ) {
    try {
      // Convert Buffer to Uint8Array
      const uint8Array = new Uint8Array(selectedRow.picture.data);
      // Create Blob from Uint8Array
      const blob = new Blob([uint8Array], { type: selectedRow.picture.type });
      // Create object URL from Blob
      const imageUrl = URL.createObjectURL(blob);

      employeePicture = (
        <img
          src={imageUrl}
          alt="Employee"
          style={{ width: 192, height: 192 }}
        />
      );
    } catch (error) {
      console.error("Error creating image URL:", error);
      employeePicture = (
        <img
          src="/assets/unknown.png"
          alt="Employee"
          style={{ width: 192, height: 192 }}
        />
      );
    }
  } else {
    employeePicture = (
      <img
        src="/assets/unknown.png"
        alt="Employee"
        style={{ width: 192, height: 192 }}
      />
    );
  }

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleFileNameChange = (event) => {
    setFileNameToSubmit(event.target.value); // Allow editing file name in the TextField
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if file is selected before proceeding
    if (!fileName) {
      alert("Please select a file to upload.");
      return;
    }

    if (!fileNameToSubmit) {
      alert("Filename is Required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      const fileInput = document.querySelector("#attachment").files[0];
      formData.append("plateNumber", selectedRow.plateNumber);
      formData.append("attachment", fileInput);
      formData.append("fileName", fileNameToSubmit);
      formData.append("createdBy", user.id);

      setLoadingData(true);

      // Submit the form data with file upload
      await axios.post(`${apiUrl}/api/vehicleAttachment`, formData);

      setSuccessMessage("File uploaded successfully!");
      setShowSuccessMessage(true);
      const vehicleAttachmentResponse = await axios.get(
        `${apiUrl}/api/vehicleAttachment/${selectedRow.plateNumber}`
      );

      setAttachmentData(vehicleAttachmentResponse.data.vehicleAttachments);
      setFileName("");
      setFileNameToSubmit("");
      setLoadingData(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Attachment?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setOpenDialog(false); // Close the dialog
      setLoadingData(true);

      const url = "vehicleAttachment";

      await axios.delete(`${apiUrl}/api/${url}/${id}`, {
        data: { deletedBy: user.id },
      });

      setAttachmentData((prevData) =>
        prevData.filter((attachment) => attachment.id !== id)
      );

      setShowSuccessMessage(true);
      setSuccessMessage("Attachment Deleted Successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "fileName",
      headerName: "File Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "attachmentCreatedBy",
      headerName: "Uploaded By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let value = {};
        value.value =
          `${params.row.Employee.lastName}, ${params.row.Employee.firstName} ${
            params.row.Employee.affix ? params.row.Employee.affix : ""
          }` || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const timestamp = new Date(params.value);
        const formattedTimestamp = timestamp.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return <div>{formattedTimestamp}</div>;
      },
    },
    {
      field: "view",
      headerName: "View File",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.greenAccent[400], fontSize: "large" }}
          onClick={async () => {
            try {
              const vehicleAttachmentResponse = await axios.get(
                `${apiUrl}/api/vehicleAttachment/attachment/${params.row.id}`
              );
              const attachment =
                vehicleAttachmentResponse.data.vehicleAttachments?.attachment;

              if (attachment) {
                const byteArray = new Uint8Array(attachment.data);

                // Detect MIME type
                let mimeType = "application/octet-stream";
                const magicNumbers = byteArray.slice(0, 4).join(",");

                if (magicNumbers.startsWith("255,216,255")) {
                  mimeType = "image/jpeg";
                } else if (magicNumbers.startsWith("137,80,78,71")) {
                  mimeType = "image/png";
                } else if (magicNumbers.startsWith("37,80,68,70")) {
                  mimeType = "application/pdf";
                }

                const blob = new Blob([byteArray], { type: mimeType });
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
              } else {
                alert("No attachment found.");
              }
            } catch (error) {
              console.error("Error fetching attachment:", error);
              alert("Failed to retrieve the attachment.");
            }
          }}
        >
          <PageviewIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "download",
      headerName: "Download",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.blueAccent[400], fontSize: "large" }}
          onClick={async () => {
            const vehicleAttachmentResponse = await axios.get(
              `${apiUrl}/api/vehicleAttachment/attachment/${params.row.id}`
            );
            const attachment =
              vehicleAttachmentResponse.data.vehicleAttachments?.attachment;
            const fileName =
              vehicleAttachmentResponse.data.vehicleAttachments?.fileName;

            if (attachment) {
              const byteArray = new Uint8Array(attachment.data); // Convert binary data to a byte array

              // Determine the MIME type based on the file's magic number (first few bytes)
              let mimeType = "application/octet-stream"; // Default MIME type
              const magicNumbers = byteArray.slice(0, 4).join(",");

              // Common magic numbers
              if (magicNumbers.startsWith("255,216,255")) {
                mimeType = "image/jpeg";
              } else if (magicNumbers.startsWith("137,80,78,71")) {
                mimeType = "image/png";
              } else if (magicNumbers.startsWith("37,80,68,70")) {
                mimeType = "application/pdf";
              }
              // Add more magic numbers as necessary

              const blob = new Blob([byteArray], { type: mimeType });
              const url = URL.createObjectURL(blob); // Create an object URL from the Blob

              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `${fileName} ${selectedRow.plateNumber}`
              ); // Use the file name for the download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
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
      renderCell: (params) =>
        params.row.createdBy === user.id ? ( // Check if createdBy matches user.id
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)} // Assuming you have a handleDeleteClick function
          >
            <DeleteIcon />
          </IconButton>
        ) : null, // Return null if the condition is not met
    },
  ];

  const maintenanceColumns = [
    {
      field: "date",
      headerName: "Service Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        const value = params.row.date;
        if (!value) return ""; // Handle null or undefined values
        return format(new Date(value), "MMMM dd yyyy");
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "dueDate",
      headerName: "Next Service Due",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        const value = params.row.dueDate;
        if (!value) return ""; // Handle null or undefined values
        return format(new Date(value), "MMMM dd yyyy");
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box>
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1050,
            minHeight: "90%",
            overflowY: "scroll",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedRow && (
            <>
              <Typography
                id="modal-title"
                variant="h2"
                component="h2"
                mb={2}
                sx={{ textAlign: "center", fontStyle: "italic" }}
              >
                Vehicle Profile
              </Typography>
              {user.userType === 3 && (
                <IconButton
                  color="warning"
                  onClick={() => handleEditClick(selectedRow.id)}
                  sx={{ position: "absolute", right: 20, top: 20 }}
                >
                  <EditIcon />
                  Edit
                </IconButton>
              )}
              <Box padding={1} sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    height: "192px",
                    width: "192px",
                  }}
                >
                  {employeePicture}
                </Box>
                <Grid container spacing={2} sx={{ minHeight: 220 }}>
                  <Grid item xs={12} md={6} lg={7}>
                    {" "}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Plate Number:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.plateNumber
                            ? selectedRow.plateNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Vehicle Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.vehicleName
                            ? selectedRow.vehicleName
                            : "(No Data)"}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Vehicle Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.typeOfVehicle
                            ? selectedRow.typeOfVehicle
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Net Capacity:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.netCapacity
                            ? `${formatNumber(
                                selectedRow.netCapacity * 1000
                              )} KG`
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Ownership:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.ownership
                            ? selectedRow.ownership
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Make and Model:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.makeModel
                            ? selectedRow.makeModel
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">
                          Year of Manufacture:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.yearManufacture
                            ? selectedRow.yearManufacture
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <hr />
                <Tabs
                  value={selectedTab}
                  onChange={handleChangeTab}
                  sx={{
                    "& .Mui-selected": {
                      backgroundColor: colors.greenAccent[400],
                      boxShadow: "none",
                      borderBottom: `1px solid ${colors.grey[100]}`,
                    },
                  }}
                >
                  <Tab label="Registration and Ownership" />
                  <Tab label="Vehicle Specifications" />
                  <Tab label="Maintenance and Service History" />
                  <Tab label="Attachments" />
                </Tabs>
                {selectedTab === 0 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Registration Number:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.registrationNumber
                            ? selectedRow.registrationNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Owner/Company Name:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.owner ? selectedRow.owner : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Registration Expiry Date:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.registrationExpirationDate
                            ? selectedRow.registrationExpirationDate
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Insurance Provider:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.insuranceProvider
                            ? selectedRow.insuranceProvider
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Insurance Expiry Date::
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.insuranceExpirationDate
                            ? selectedRow.insuranceExpirationDate
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 1 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Engine Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.engineType
                            ? selectedRow.engineType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Fuel Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.fuelType
                            ? selectedRow.fuelType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Transmission:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.transmission
                            ? selectedRow.transmission
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">
                          Gross Vehicle Weight:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.grossVehicleWeight
                            ? `${formatNumber(
                                selectedRow.grossVehicleWeight * 1000
                              )} KG`
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Curb Weight:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.curbWeight
                            ? `${formatNumber(
                                selectedRow.curbWeight * 1000
                              )} KG`
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Net Capacity:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.netCapacity
                            ? `${formatNumber(
                                selectedRow.netCapacity * 1000
                              )} KG`
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 2 && (
                  <Box position="relative">
                    <Typography variant="h3" gutterBottom mt={5}>
                      History
                    </Typography>
                    <DataGrid
                      sx={{
                        "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard":
                          {
                            height: maintenanceTableHeight,
                          },
                        "& .MuiDataGrid-root": {
                          border: "none",
                          width: "100%",
                          color: colors.grey[100],
                        },
                        "& .MuiDataGrid-overlayWrapper": {
                          minHeight: "52px",
                        },
                        "& .name-column--cell": {
                          color: colors.greenAccent[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: colors.blueAccent[700],
                          borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          whiteSpace: "normal !important",
                          wordWrap: "break-word !important",
                          lineHeight: "1.2 !important",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                          backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-toolbarContainer": {
                          display: "none",
                        },
                        "& .MuiDataGrid-footerContainer": {
                          display: "none",
                        },
                      }}
                      rows={maintenanceData || []}
                      columns={maintenanceColumns}
                      components={{
                        Toolbar: GridToolbar,
                        LoadingOverlay: CustomLoadingOverlay,
                      }}
                      getRowId={(row) => row.id}
                      localeText={{ noRowsLabel: "No Data" }}
                      initialState={{
                        sortModel: [{ field: "createdAt", sort: "asc" }],
                      }}
                    />
                  </Box>
                )}
                {selectedTab === 3 && (
                  <Box position="relative">
                    <Typography variant="h3" gutterBottom mt={2}>
                      Upload Attachment
                    </Typography>
                    <Grid item xs={12} md={6} lg={4} mb={2}>
                      <input
                        type="file"
                        className="form-control visually-hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="attachment"
                        name="attachment"
                        style={{ display: "none" }}
                      />
                      <label htmlFor="attachment">
                        <Typography>File: {fileName}</Typography>
                        <Button
                          variant="contained"
                          component="span"
                          sx={{ mt: 2, backgroundColor: colors.primary[500] }}
                        >
                          Upload Vehicle Attachment
                        </Button>
                      </label>
                      <TextField
                        label="File Name"
                        variant="outlined"
                        value={fileNameToSubmit}
                        onChange={handleFileNameChange}
                        fullWidth
                        required
                        autoComplete="off"
                        sx={{ mt: 2 }}
                        InputLabelProps={{
                          style: {
                            color: colors.grey[100],
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleFormSubmit}
                        sx={{
                          mt: 2,
                          backgroundColor: colors.greenAccent[500],
                        }}
                        disabled={loading}
                      >
                        {loading ? "Uploading..." : "Submit Attachment"}
                      </Button>
                    </Grid>
                    <hr />
                    {showSuccessMessage && (
                      <SuccessMessage
                        message={successMessage}
                        onClose={() => setShowSuccessMessage(false)}
                        marginLess="0px"
                      />
                    )}
                    <Typography variant="h3" gutterBottom mt={5}>
                      Attachments
                    </Typography>
                    <DataGrid
                      sx={{
                        "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard":
                          {
                            height: attachmentTableHeight,
                          },
                        "& .MuiDataGrid-root": {
                          border: "none",
                          width: "100%",
                          color: colors.grey[100],
                        },
                        "& .MuiDataGrid-overlayWrapper": {
                          minHeight: "52px",
                        },
                        "& .name-column--cell": {
                          color: colors.greenAccent[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: colors.blueAccent[700],
                          borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          whiteSpace: "normal !important",
                          wordWrap: "break-word !important",
                          lineHeight: "1.2 !important",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                          backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-toolbarContainer": {
                          display: "none",
                        },
                        "& .MuiDataGrid-footerContainer": {
                          display: "none",
                        },
                      }}
                      rows={attachmentData || []}
                      columns={columns}
                      components={{
                        Toolbar: GridToolbar,
                        LoadingOverlay: CustomLoadingOverlay,
                      }}
                      loading={loadingData}
                      getRowId={(row) => row.id}
                      localeText={{ noRowsLabel: "No Files Uploaded" }}
                      initialState={{
                        sortModel: [{ field: "createdAt", sort: "asc" }],
                      }}
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default VehicleProfileModal;
