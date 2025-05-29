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
import { formatDate3 } from "../Functions";
import SuccessMessage from "../SuccessMessage";
import ConfirmationDialog from "../ConfirmationDialog";
import CustomLoadingOverlay from "../CustomLoadingOverlay";

const ClientProfileModal = ({
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

  console.log(selectedRow);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    if (!selectedRow || !selectedRow.clientId) {
      return;
    }
    try {
      const clientAttachmentResponse = await axios.get(
        `${apiUrl}/api/clientAttachment/${selectedRow.clientId}`
      );

      setAttachmentData(clientAttachmentResponse.data.clientAttachments);
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
    selectedRow.clientPicture &&
    selectedRow.clientPicture.data &&
    selectedRow.clientPicture.type
  ) {
    try {
      // Convert Buffer to Uint8Array
      const uint8Array = new Uint8Array(selectedRow.clientPicture.data);
      // Create Blob from Uint8Array
      const blob = new Blob([uint8Array], {
        type: selectedRow.clientPicture.type,
      });
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
      formData.append("clientId", selectedRow.clientId);
      formData.append("attachment", fileInput);
      formData.append("fileName", fileNameToSubmit);
      formData.append("createdBy", user.id);

      setLoadingData(true);

      // Submit the form data with file upload
      const newAttachment = await axios.post(
        `${apiUrl}/api/clientAttachment`,
        formData
      );

      setSuccessMessage("File uploaded successfully!");
      setShowSuccessMessage(true);
      setAttachmentData((prevData) => [
        ...prevData,
        newAttachment.data.newAttachment,
      ]);

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

      const url = "clientAttachment";

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
              const clientAttachmentResponse = await axios.get(
                `${apiUrl}/api/clientAttachment/attachment/${params.row.id}`
              );

              console.log(
                "Client Attachment Response:",
                clientAttachmentResponse.data
              );

              const attachment =
                clientAttachmentResponse.data.clientAttachments?.attachment;

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
            const clientAttachmentResponse = await axios.get(
              `${apiUrl}/api/clientAttachment/attachment/${params.row.id}`
            );
            const attachment =
              clientAttachmentResponse.data.clientAttachments?.attachment;
            const fileName =
              clientAttachmentResponse.data.clientAttachments?.fileName;

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
                `${fileName} ${selectedRow.clientName}`
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
            height: "90%",
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
                Client Profile
              </Typography>
              {user.userType === 2 && (
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
                  <Grid item xs={12} md={6} lg={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Client ID:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.clientId
                            ? selectedRow.clientId
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Client Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.clientType
                            ? selectedRow.clientType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Client Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.clientName
                            ? selectedRow.clientName
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Address:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.address
                            ? selectedRow.address
                            : "(No Data)"}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Status:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.clientStatus
                            ? selectedRow.clientStatus
                            : "(No Data)"}{" "}
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
                  <Tab label="Client Details" />
                  <Tab label="Billing Details" />
                  <Tab label="Attachments" />
                </Tabs>
                {selectedTab === 0 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Nature Of Business:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.natureOfBusiness
                            ? selectedRow.natureOfBusiness
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">Contact Number:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.contactNumber
                            ? selectedRow.contactNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">Email:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.email ? selectedRow.email : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">MOA Date:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.moaDate
                            ? formatDate3(selectedRow.moaDate)
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">MOA End Date:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.moaEndDate
                            ? formatDate3(selectedRow.moaEndDate)
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h3">
                          Latest Transaction:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={8}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.BookedTransaction.length > 0
                            ? formatDate3(
                                selectedRow.BookedTransaction?.[0]
                                  ?.ScheduledTransaction?.[0]?.scheduledDate
                              )
                            : "(No Data)"}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 1 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.billerName
                            ? selectedRow.billerName
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Address:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.billerAddress
                            ? selectedRow.billerAddress
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Contact Person:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.billerContactPerson
                            ? selectedRow.billerContactPerson
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Contact Number:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.billerContactNumber
                            ? selectedRow.billerContactNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">TIN Number:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.billerTinNumber
                            ? selectedRow.billerTinNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 2 && (
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
                          Choose File
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
                      getRowId={(row) => row.id}
                      localeText={{ noRowsLabel: "No Files Uploaded" }}
                      loading={loadingData}
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

export default ClientProfileModal;
