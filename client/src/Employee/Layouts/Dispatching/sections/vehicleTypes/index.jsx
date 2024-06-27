import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../../../../theme";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";

const VehicleTypes = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    typeOfVehicle: "",
    createdBy: user.id,
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleTypeResponse = await axios.get(
          `${apiUrl}/dispatchingDashboard/vehicleTypes`
        );
        setVehicleTypes(vehicleTypeResponse.data.vehicleTypes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

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
  };

  const clearFormData = () => {
    setFormData({
      id: "",
      typeOfVehicle: "",
      createdBy: user.id,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const typeToEdit = vehicleTypes.find((type) => type.id === id);
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        typeOfVehicle: typeToEdit.typeOfVehicle,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Vehicle type with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this vehicle type?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      await axios.delete(`${apiUrl}/dispatchingDashboard/vehicleTypes/${id}`, {
        data: { deletedBy: user.id },
      });

      const updatedData = vehicleTypes.filter((type) => type.id !== id);
      setVehicleTypes(updatedData);
      setSuccessMessage("Vehicle type deleted successfully!");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (formData.id) {
        // Update existing vehicle type
        response = await axios.put(
          `${apiUrl}/dispatchingDashboard/vehicleTypes/${formData.id}`,
          formData
        );

        const updatedData = response.data.vehicleTypes;

        setVehicleTypes(updatedData); // Update the vehicleTypes state with updatedData
        setSuccessMessage("Vehicle type updated successfully!");
      } else {
        // Add new vehicle type
        response = await axios.post(
          `${apiUrl}/dispatchingDashboard/vehicleTypes`,
          formData
        );

        const updatedData = response.data.vehicleTypes;

        setVehicleTypes(updatedData);
        setSuccessMessage("Vehicle type added successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "typeOfVehicle",
      headerName: "Type of Vehicle",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
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
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="Vehicle Types" subtitle="List of Vehicle Types" />
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
      <CustomDataGridStyles>
        <DataGrid
          rows={vehicleTypes}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "typeOfVehicle", sort: "asc" }],
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
            {formData.id ? "Update Vehicle Type" : "Add New Vehicle Type"}
          </Typography>
          <TextField
            label="Type of Vehicle"
            name="typeOfVehicle"
            value={formData.typeOfVehicle}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
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
            {formData.id ? "Update Vehicle Type" : "Add Vehicle Type"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default VehicleTypes;
