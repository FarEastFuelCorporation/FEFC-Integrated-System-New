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
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../../../theme";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    address: "",
    natureOfBusiness: "",
    contactNumber: "",
    clientType: "",
  });

  const [employeeData, setEmployeeData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/marketingDashboard/clients"
        );
        const clientRecords = response.data;

        if (clientRecords && Array.isArray(clientRecords.clients)) {
          const data = clientRecords.clients.map((client) => ({
            ...client,
            id: client.clientId,
          }));

          setEmployeeData(data);
        } else {
          console.error(
            "clientRecords or clientRecords.clients is undefined or not an array"
          );
        }
      } catch (error) {
        console.error("Error fetching employeeData:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => {
    setFormData({
      clientId: "",
      clientName: "",
      address: "",
      natureOfBusiness: "",
      contactNumber: "",
      clientType: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.clientId) {
        const response = await axios.put(
          `http://localhost:3001/marketingDashboard/clients/${formData.clientId}`,
          formData
        );
        const updatedClient = response.data;

        const updatedData = employeeData.map((client) =>
          client.clientId === updatedClient.clientId ? updatedClient : client
        );

        setEmployeeData(updatedData);
        setSuccessMessage("Client updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:3001/marketingDashboard/clients",
          formData
        );
        const newClient = response.data;

        setEmployeeData([
          ...employeeData,
          { ...newClient, id: newClient.clientId },
        ]);
        setSuccessMessage("Client added successfully!");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (id) => {
    const clientToEdit = employeeData.find((client) => client.clientId === id);
    if (clientToEdit) {
      setFormData({
        clientId: clientToEdit.clientId,
        clientName: clientToEdit.clientName,
        address: clientToEdit.address,
        natureOfBusiness: clientToEdit.natureOfBusiness,
        contactNumber: clientToEdit.contactNumber,
        clientType: clientToEdit.clientType,
      });
      handleOpenModal();
    } else {
      console.error(`Client with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3001/marketingDashboard/clients/${id}`
      );

      const updatedData = employeeData.filter(
        (client) => client.clientId !== id
      );
      setEmployeeData(updatedData);
      setSuccessMessage("Client deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "clientId",
      headerName: "Client ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      width: 300,
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      width: 300,
    },
    {
      field: "natureOfBusiness",
      headerName: "Nature of Business",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "clientType",
      headerName: "Client Type",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="warning"
          onClick={() => handleEditClick(params.row.clientId)}
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
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row.clientId)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p="20px" width="100% !important">
      <Box display="flex" justifyContent="space-between">
        <Header title="Clients" subtitle="List of Clients" />
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>
      {successMessage && (
        <Box bgcolor="success.main" p={1}>
          <Typography
            variant="body1"
            color="success"
            sx={{ marginTop: "10px", textAlign: "center" }}
          >
            {successMessage}
          </Typography>
        </Box>
      )}
      <Box
        m="40px 0 0 0"
        height="75vh"
        width="100% !important"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            width: "100%",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={employeeData.map((row) => ({ ...row, id: row.clientId }))}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
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
            {formData.clientId ? "Edit Client" : "Add New Client"}
          </Typography>
          <TextField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Nature of Business"
            name="natureOfBusiness"
            value={formData.natureOfBusiness}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Client Type"
            name="clientType"
            value={formData.clientType}
            onChange={handleInputChange}
            select
            fullWidth
          >
            <MenuItem value="GENERATOR">GENERATOR</MenuItem>
            <MenuItem value="TRANSPORTER">TRANSPORTER</MenuItem>
            <MenuItem value="INTEGRATED FACILITIES MANAGEMENT">
              INTEGRATED FACILITIES MANAGEMENT
            </MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.clientId ? "Update Client" : "Add Client"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Clients;
