import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  MenuItem,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmationDialog from "../../ConfirmationDialog";

const Clients = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    clientId: "",
    clientName: "",
    address: "",
    natureOfBusiness: "",
    contactNumber: "",
    clientType: "",
    billerName: "",
    billerAddress: "",
    billerContactPerson: "",
    billerContactNumber: "",
    billerTinNumber: "",
    email: "",
    clientPicture: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [clientData, setClientData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/client`);

      setClientData(response.data.clients);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching clientData:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData(); // Call fetchData within useEffect
  }, [fetchData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const clientToEdit = clientData.find((client) => client.id === id);
    if (clientToEdit) {
      setFormData({
        id: clientToEdit.id,
        clientId: clientToEdit.clientId,
        clientName: clientToEdit.clientName || "",
        address: clientToEdit.address || "",
        natureOfBusiness: clientToEdit.natureOfBusiness || "",
        contactNumber: clientToEdit.contactNumber || "",
        clientType: clientToEdit.clientType || "",
        billerName: clientToEdit.billerName || "",
        billerAddress: clientToEdit.billerAddress || "",
        billerContactPerson: clientToEdit.billerContactPerson || "",
        billerContactNumber: clientToEdit.billerContactNumber || "",
        billerTinNumber: clientToEdit.billerTinNumber || "",
        email: clientToEdit.email || "",
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Client with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Client?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/client/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Client Deleted Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { clientName, address, billerName, billerAddress, clientType } =
      formData;

    // Check if all required fields are filled
    if (
      !clientName ||
      !address ||
      !billerName ||
      !billerAddress ||
      !clientType
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("clientName", formData.clientName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("natureOfBusiness", formData.natureOfBusiness);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("clientType", formData.clientType);
      formDataToSend.append("billerName", formData.billerName);
      formDataToSend.append("billerAddress", formData.billerAddress);
      formDataToSend.append(
        "billerContactPerson",
        formData.billerContactPerson
      );
      formDataToSend.append(
        "billerContactNumber",
        formData.billerContactNumber
      );
      formDataToSend.append("billerTinNumber", formData.billerTinNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("createdBy", formData.createdBy);

      // Add clientPicture if it's selected
      if (selectedFile) {
        formDataToSend.append("clientPicture", selectedFile);
      }

      if (formData.id) {
        // Update existing client
        await axios.put(`${apiUrl}/api/client/${formData.id}`, formDataToSend);

        setSuccessMessage("Client Updated Successfully!");
      } else {
        // Add new client
        await axios.post(`${apiUrl}/api/client`, formDataToSend);

        setSuccessMessage("Client Added Successfully!");
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
      field: "clientId",
      headerName: "Client ID",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientPicture",
      headerName: "Logo",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 50,
      renderCell: (params) => {
        // Check if params.value is valid
        if (params.value && params.value.data && params.value.type) {
          try {
            // Convert Buffer to Uint8Array
            const uint8Array = new Uint8Array(params.value.data);
            // Create Blob from Uint8Array
            const blob = new Blob([uint8Array], { type: params.value.type });
            // Create object URL from Blob
            const imageUrl = URL.createObjectURL(blob);

            return (
              <img
                src={imageUrl}
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          } catch (error) {
            console.error("Error creating image URL:", error);
            return (
              <img
                src="/assets/unknown.png"
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          }
        } else {
          return (
            <img
              src="/assets/unknown.png"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          );
        }
      },
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 250,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "natureOfBusiness",
      headerName: "Nature of Business",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientType",
      headerName: "Client Type",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "accountHandler",
      headerName: "Account Handler",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        const employee = params.row.Employee;
        let fullName = {};
        fullName.value = `${employee.firstName} ${employee.lastName}`;

        return renderCellWithWrapText(fullName);
      },
    },
  ];

  if (user.userType === 2) {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) =>
          params.row.createdBy === user.id || user.id === "23108" ? (
            <IconButton
              color="warning"
              onClick={() => handleEditClick(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          ) : null, // Return null if condition is not met
      },
      {
        field: "delete",
        headerName: "Delete",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) =>
          params.row.createdBy === user.id || user.id === "23108" ? (
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ) : null, // Return null if condition is not met
      }
    );
  }

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Clients" subtitle="List of Clients" />
        {user.userType === 2 && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
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
          rows={clientData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "clientId", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translate(-50%)",
            width: "80%",
            maxHeight: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            gap: 2,
            overflowY: "scroll",
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Client" : "Add New Client"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Grid container spacing={2} my={2}>
            <Grid item xs={12} lg={6}>
              <Typography variant="subtitle2" gutterBottom>
                For Certification Details
              </Typography>
              <TextField
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />

              <TextField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="Client Type"
                name="clientType"
                value={formData.clientType}
                onChange={handleInputChange}
                select
                required
                disabled={!!formData.id}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              >
                <MenuItem value="GENERATOR">GENERATOR</MenuItem>
                <MenuItem value="TRANSPORTER">TRANSPORTER</MenuItem>
                <MenuItem value="INTEGRATED FACILITIES MANAGEMENT">
                  INTEGRATED FACILITIES MANAGEMENT
                </MenuItem>
                <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
              </TextField>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <input
                type="file"
                className="form-control visually-hidden"
                accept="image/*"
                onChange={handleFileChange}
                id="clientPicture"
                name="clientPicture"
                style={{ display: "none" }}
              />
              <label htmlFor="clientPicture">
                <Typography>File: {fileName}</Typography>
                <Button
                  variant="contained"
                  component="span"
                  sx={{ mt: 2, backgroundColor: colors.primary[500] }}
                >
                  Upload Client Picture
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography variant="subtitle2" gutterBottom>
                For Billing Details
              </Typography>
              <TextField
                label="Biller Name"
                name="billerName"
                value={formData.billerName}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="BIller Address"
                name="billerAddress"
                value={formData.billerAddress}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="Biller Contact Person"
                name="billerContactPerson"
                value={formData.billerContactPerson}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="Biller Contact Number"
                name="billerContactNumber"
                value={formData.billerContactNumber}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="Nature of Business"
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
              <TextField
                label="Biller TIN Number"
                name="billerTinNumber"
                value={formData.billerTinNumber}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
            </Grid>
          </Grid>

          <TextField
            label="Created By"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleInputChange}
            fullWidth
            autoComplete="off"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update Client" : "Add Client"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Clients;
