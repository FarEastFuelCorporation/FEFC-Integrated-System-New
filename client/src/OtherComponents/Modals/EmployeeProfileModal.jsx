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
import { format } from "date-fns";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import {
  calculateAge,
  calculateLengthOfService,
  concatenatePermanentAddress,
  concatenatePresentAddress,
} from "../Functions";
import SuccessMessage from "../SuccessMessage";
import ConfirmationDialog from "../ConfirmationDialog";

const EmployeeProfileModal = ({
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
  const [employeesData, setEmployeesData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileNameToSubmit, setFileNameToSubmit] = useState("");
  const [attachmentData, setAttachmentData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchData = useCallback(async () => {
    if (!selectedRow || !selectedRow.employeeId) {
      return;
    }
    try {
      const [employeeResponse, departmentResponse, employeeAttachmentResponse] =
        await Promise.all([
          axios.get(`${apiUrl}/api/employee`),
          axios.get(`${apiUrl}/api/department`),
          axios.get(
            `${apiUrl}/api/employeeAttachment/${selectedRow.employeeId}`
          ),
        ]);
      setEmployeesData(employeeResponse.data.employees);
      setDepartments(departmentResponse.data.departments);
      setAttachmentData(employeeAttachmentResponse.data.employeeAttachments);
    } catch (error) {
      console.error("Error fetching provinces:", error);
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

    try {
      setLoading(true);

      const formData = new FormData();
      const fileInput = document.querySelector("#attachment").files[0];
      formData.append("employeeId", selectedRow.employeeId);
      formData.append("attachment", fileInput);
      formData.append("fileName", fileNameToSubmit);
      formData.append("createdBy", user.id);

      // Submit the form data with file upload
      const uploadResponse = await axios.post(
        `${apiUrl}/api/employeeAttachment`,
        formData
      );

      setSuccessMessage("File uploaded successfully!");
      setShowSuccessMessage(true);

      // Assuming the response contains the uploaded attachment data:
      const newAttachmentData = uploadResponse.data.newAttachment;

      // Append the new attachment data to the existing data (if any)
      setAttachmentData((prevData) => [...prevData, newAttachmentData]);

      setFileName("");
      setFileNameToSubmit("");
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
      setLoading(true);
      await axios.delete(`${apiUrl}/api/employeeAttachment/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Attachment Deleted Successfully!");

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
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
          `${params.row.Employee.lastName}, ${params.row.Employee.firstName} ${params.row.Employee.affix}` ||
          "";

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
              const documentId = params.row.id; // Get the document ID

              // Fetch the binary data from the API
              const response = await axios.get(
                `${apiUrl}/api/employeeAttachment/full/${documentId}`,
                { responseType: "arraybuffer" } // Get binary data
              );

              // Create a Blob from the response data
              const blob = new Blob([response.data], {
                type: response.headers["content-type"], // Use the Content-Type from the response header
              });

              // Create an object URL for the Blob
              const url = URL.createObjectURL(blob);

              // Open the file in a new tab
              window.open(url, "_blank");
            } catch (error) {
              console.error("Error fetching document file:", error);
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
            try {
              const documentId = params.row.id; // Get the document ID
              const fileName =
                params.row.fileName || `attachment_${documentId}`; // Fallback to a default name if no file name is provided

              // Fetch the attachment from the API using the document ID
              const response = await axios.get(
                `${apiUrl}/api/employeeAttachment/full/${documentId}`,
                { responseType: "arraybuffer" } // Fetch binary data
              );

              // Create a Blob from the binary data
              const blob = new Blob([response.data], {
                type:
                  response.headers["content-type"] ||
                  "application/octet-stream",
              });

              // Generate a URL for the Blob
              const url = URL.createObjectURL(blob);

              // Create an anchor element for downloading
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName; // Set the file name
              document.body.appendChild(link);
              link.click(); // Trigger the download
              document.body.removeChild(link); // Remove the anchor after downloading
            } catch (error) {
              console.error("Error downloading document file:", error);
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
            width: 1200,
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
                Employee Profile
              </Typography>
              {user.userType === 21 && (
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
                  <Grid item xs={12} md={6} lg={6.5}>
                    {" "}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Employee ID:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.employeeId
                            ? selectedRow.employeeId
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">First Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.firstName
                            ? selectedRow.firstName
                            : "(No Data)"}{" "}
                          {selectedRow.affix ? selectedRow.affix : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Middle Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.middleName
                            ? selectedRow.middleName
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Last Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.lastName
                            ? selectedRow.lastName
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {selectedRow.gender === "FEMALE" &&
                      (selectedRow.civilStatus === "MARRIED" ||
                        selectedRow.civilStatus === "WIDOW") && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} lg={5}>
                            <Typography
                              variant="h3"
                              sx={{
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              Husband's Surname:
                            </Typography>
                          </Grid>{" "}
                          <Grid item xs={12} md={6} lg={7}>
                            <Typography
                              variant="h3"
                              sx={{ fontWeight: "bold" }}
                            >
                              {selectedRow.husbandSurname
                                ? selectedRow.husbandSurname
                                : "(No Data)"}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Birthday:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.birthday
                            ? format(
                                new Date(selectedRow.birthday),
                                "MMMM dd, yyyy"
                              )
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Civil Status:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.civilStatus
                            ? selectedRow.civilStatus
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Age:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.birthday
                            ? `${calculateAge(selectedRow.birthday)} y/o`
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={5}>
                        <Typography variant="h3">Gender:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={7}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.gender
                            ? selectedRow.gender
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
                  <Tab label="Personal Information" />
                  <Tab label="Employment Details" />
                  <Tab label="Family Background" />
                  <Tab label="Educational Background" />
                  <Tab label="References" />
                  <Tab label="Attachments" />
                  <Tab label="Memo" />
                </Tabs>
                {selectedTab === 0 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Mobile #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.mobileNumber
                            ? selectedRow.mobileNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Landline #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.landlineNumber
                            ? selectedRow.landlineNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Email Address:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.emailAddress
                            ? selectedRow.emailAddress
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Blood Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.bloodType
                            ? selectedRow.bloodType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Birth Place:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.birthPlace
                            ? selectedRow.birthPlace
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Ethnic Origin:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.ethnicOrigin
                            ? selectedRow.ethnicOrigin
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Citizenship:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.citizenship
                            ? selectedRow.citizenship
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Religion:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.religion
                            ? selectedRow.religion
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Present Address:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {concatenatePresentAddress(selectedRow)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Permanent Address:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {concatenatePermanentAddress(selectedRow)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 1 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Designation:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.designation
                            ? selectedRow.designation
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Department:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.departmentId
                            ? departments.find(
                                (department) =>
                                  department.id === selectedRow.departmentId
                              )?.department || "(No Data)"
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Immediate Head:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.immediateHeadId
                            ? employeesData.find(
                                (employee) =>
                                  employee.employeeId ===
                                  selectedRow.immediateHeadId
                              )
                              ? `${
                                  employeesData.find(
                                    (employee) =>
                                      employee.employeeId ===
                                      selectedRow.immediateHeadId
                                  )?.firstName || ""
                                } ${
                                  employeesData.find(
                                    (employee) =>
                                      employee.employeeId ===
                                      selectedRow.immediateHeadId
                                  )?.lastName || ""
                                }`
                              : "(No Data)"
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Date Hire:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.dateHire
                            ? format(
                                new Date(selectedRow.dateHire),
                                "MMMM dd, yyyy"
                              )
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Length of Service:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.dateHire
                            ? calculateLengthOfService(selectedRow.dateHire)
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Employee Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.employeeType
                            ? selectedRow.employeeType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Payroll Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.payrollType
                            ? selectedRow.payrollType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Salary Type:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.salaryType
                            ? selectedRow.salaryType
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">TIN ID #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.tinId ? selectedRow.tinId : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Philhealth ID #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.philhealthId
                            ? selectedRow.philhealthId
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">SSS ID #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.sssId ? selectedRow.sssId : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Pag-ibig ID #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.pagibigId
                            ? selectedRow.pagibigId
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 2 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Father's Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.fathersName
                            ? selectedRow.fathersName
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
                          {selectedRow.fathersAddress
                            ? selectedRow.fathersAddress
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Mobile #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.fathersMobileNumber
                            ? selectedRow.fathersMobileNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Religion:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.fathersReligion
                            ? selectedRow.fathersReligion
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Mother's Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.mothersName
                            ? selectedRow.mothersName
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
                          {selectedRow.mothersAddress
                            ? selectedRow.mothersAddress
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Mobile #:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.mothersMobileNumber
                            ? selectedRow.mothersMobileNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Religion:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.mothersReligion
                            ? selectedRow.mothersReligion
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {(selectedRow.civilStatus === "MARRIED" ||
                      selectedRow.civilStatus === "WIDOW" ||
                      selectedRow.civilStatus === "WIDOWER") && (
                      <Box>
                        {" "}
                        <Grid container spacing={2} mt={2}>
                          <Grid item xs={12} md={6} lg={3}>
                            <Typography variant="h3">
                              {selectedRow.gender === "MALE"
                                ? "Wife's Name:"
                                : "Husband's Name:"}
                            </Typography>
                          </Grid>{" "}
                          <Grid item xs={12} md={6} lg={9}>
                            <Typography
                              variant="h3"
                              sx={{ fontWeight: "bold" }}
                            >
                              {selectedRow.spouseName
                                ? selectedRow.spouseName
                                : "(No Data)"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} lg={3}>
                            <Typography variant="h3">Address:</Typography>
                          </Grid>{" "}
                          <Grid item xs={12} md={6} lg={9}>
                            <Typography
                              variant="h3"
                              sx={{ fontWeight: "bold" }}
                            >
                              {selectedRow.spouseAddress
                                ? selectedRow.spouseAddress
                                : "(No Data)"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} lg={3}>
                            <Typography variant="h3">Mobile #:</Typography>
                          </Grid>{" "}
                          <Grid item xs={12} md={6} lg={9}>
                            <Typography
                              variant="h3"
                              sx={{ fontWeight: "bold" }}
                            >
                              {selectedRow.spouseMobileNumber
                                ? selectedRow.spouseMobileNumber
                                : "(No Data)"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} lg={3}>
                            <Typography variant="h3">Religion:</Typography>
                          </Grid>{" "}
                          <Grid item xs={12} md={6} lg={9}>
                            <Typography
                              variant="h3"
                              sx={{ fontWeight: "bold" }}
                            >
                              {selectedRow.spouseReligion
                                ? selectedRow.spouseReligion
                                : "(No Data)"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                )}
                {selectedTab === 3 && (
                  <Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">
                          Educational Attainment:
                        </Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.educationalAttainment
                            ? selectedRow.educationalAttainment
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">School Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.schoolName
                            ? selectedRow.schoolName
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Course:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.course
                            ? selectedRow.course
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Level:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.level ? selectedRow.level : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Year:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.year ? selectedRow.year : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 4 && (
                  <Box>
                    <Typography variant="h3" gutterBottom mt={2}>
                      Character Reference
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.referenceName
                            ? selectedRow.referenceName
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
                          {selectedRow.referenceAddress
                            ? selectedRow.referenceAddress
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Mobile Number:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.referenceMobileNumber
                            ? selectedRow.referenceMobileNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="h3" gutterBottom mt={4}>
                      Person to Notify in case of Emergency
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Name:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.emergencyName
                            ? selectedRow.emergencyName
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
                          {selectedRow.emergencyAddress
                            ? selectedRow.emergencyAddress
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="h3">Mobile Number:</Typography>
                      </Grid>{" "}
                      <Grid item xs={12} md={6} lg={9}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                          {selectedRow.emergencyMobileNumber
                            ? selectedRow.emergencyMobileNumber
                            : "(No Data)"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {selectedTab === 5 && (
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
                          Upload Employee Attachment
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
                      components={{ Toolbar: GridToolbar }}
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

export default EmployeeProfileModal;
