import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  MenuItem,
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

const Clients = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/client`);
        const clientRecords = response.data;

        console.log(apiUrl);
        console.log(clientRecords.clients);

        if (clientRecords && Array.isArray(clientRecords.clients)) {
          setClientData(clientRecords.clients);
        } else {
          console.error(
            "clientRecords or clientRecords.clients is undefined or not an array"
          );
        }
      } catch (error) {
        console.error("Error fetching clientData:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

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
        clientName: clientToEdit.clientName,
        address: clientToEdit.address,
        natureOfBusiness: clientToEdit.natureOfBusiness,
        contactNumber: clientToEdit.contactNumber,
        clientType: clientToEdit.clientType,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Client with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Client?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      await axios.delete(`${apiUrl}/client/${id}`, {
        data: { deletedBy: user.id },
      });

      const updatedData = clientData.filter((client) => client.id !== id);
      setClientData(updatedData);
      setSuccessMessage("Client Deleted Successfully!");
    } catch (error) {
      console.error("Error:", error);
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
    const { clientName, address, natureOfBusiness, contactNumber, clientType } =
      formData;

    // Check if all required fields are filled
    if (
      !clientName ||
      !address ||
      !natureOfBusiness ||
      !contactNumber ||
      !clientType
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("clientName", formData.clientName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("natureOfBusiness", formData.natureOfBusiness);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("clientType", formData.clientType);
      formDataToSend.append("createdBy", formData.createdBy);

      // Add clientPicture if it's selected
      if (selectedFile) {
        formDataToSend.append("clientPicture", selectedFile);
      }

      let response;

      if (formData.id) {
        // Update existing client
        response = await axios.put(
          `${apiUrl}/client/${formData.id}`,
          formDataToSend
        );

        const clientRecords = response.data;

        if (clientRecords && Array.isArray(clientRecords.clients)) {
          setClientData(clientRecords.clients);
          setSuccessMessage("Client Updated Successfully!");
        } else {
          console.error(
            "clientRecords or clientRecords.clients is undefined or not an array"
          );
        }
      } else {
        // Add new client
        response = await axios.post(`${apiUrl}/client`, formDataToSend);

        const clientRecords = response.data;

        if (clientRecords && Array.isArray(clientRecords.clients)) {
          setClientData(clientRecords.clients);
          setSuccessMessage("Client Added Successfully!");
        } else {
          console.error(
            "clientRecords or clientRecords.clients is undefined or not an array"
          );
        }
      }

      setShowSuccessMessage(true);
      handleCloseModal();
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
        renderCell: (params) => (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row.id)}
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

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Client" : "Add New Client"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <TextField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            fullWidth
            required
            autoComplete="off"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            required
            autoComplete="off"
          />
          <TextField
            label="Nature of Business"
            name="natureOfBusiness"
            value={formData.natureOfBusiness}
            onChange={handleInputChange}
            fullWidth
            required
            autoComplete="off"
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            fullWidth
            required
            autoComplete="off"
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
          >
            <MenuItem value="GENERATOR">GENERATOR</MenuItem>
            <MenuItem value="TRANSPORTER">TRANSPORTER</MenuItem>
            <MenuItem value="INTEGRATED FACILITIES MANAGEMENT">
              INTEGRATED FACILITIES MANAGEMENT
            </MenuItem>
          </TextField>
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
            color="primary"
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
