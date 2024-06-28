import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import { tokens } from "../../../../../theme";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";

const TypeOfWastes = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    wasteCategory: "",
    wasteCode: "",
    wasteDescription: "",
    treatmentProcessId: "",
    createdBy: user.id,
  });

  const [typeOfWastes, setTypeOfWastes] = useState([]);
  const [treatmentProcess, setTreatmentProcess] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/certificationDashboard/typeOfWastes`
        );
        const typeOfWastesRecords = response.data;
        console.log(typeOfWastesRecords.typeOfWastes);
        if (
          typeOfWastesRecords &&
          Array.isArray(typeOfWastesRecords.typeOfWastes)
        ) {
          const flattenedData = typeOfWastesRecords.typeOfWastes.map(
            (item) => ({
              ...item,
              treatmentProcess: item.TreatmentProcess
                ? item.TreatmentProcess.treatmentProcess
                : null,
            })
          );

          console.log(flattenedData);
          setTypeOfWastes(flattenedData);

          const treatmentProcessResponse = await axios.get(
            `${apiUrl}/certificationDashboard/treatmentProcess`
          );
          const treatmentProcessRecords =
            treatmentProcessResponse.data.treatmentProcess;

          setTreatmentProcess(treatmentProcessRecords);
        } else {
          console.error(
            "typeOfWastesRecords or typeOfWastesRecords.typeOfWastes is undefined or not an array"
          );
        }
      } catch (error) {
        console.error("Error fetching typeOfWastes:", error);
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
    setFormData({
      id: "",
      wasteCategory: "",
      wasteCode: "",
      wasteDescription: "",
      treatmentProcessId: "",
      createdBy: user.id,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const wasteToEdit = typeOfWastes.find((waste) => waste.id === id);
    if (wasteToEdit) {
      setFormData({
        id: wasteToEdit.id,
        wasteCategory: wasteToEdit.wasteCategory,
        wasteCode: wasteToEdit.wasteCode,
        wasteDescription: wasteToEdit.wasteDescription,
        treatmentProcessId: wasteToEdit.treatmentProcessId || "",
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Type of Waste with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this type of waste?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      await axios.delete(
        `${apiUrl}/certificationDashboard/typeOfWastes/${id}`,
        {
          data: { deletedBy: user.id },
        }
      );

      const updatedData = typeOfWastes.filter((waste) => waste.id !== id);
      setTypeOfWastes(updatedData);
      setSuccessMessage("Type of waste deleted successfully!");
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
        // Update existing type of waste
        response = await axios.put(
          `${apiUrl}/certificationDashboard/typeOfWastes/${formData.id}`,
          formData
        );

        const typeOfWastesRecords = response.data;

        if (
          typeOfWastesRecords &&
          Array.isArray(typeOfWastesRecords.typeOfWastes)
        ) {
          const flattenedData = typeOfWastesRecords.typeOfWastes.map(
            (item) => ({
              ...item,
              treatmentProcess: item.TreatmentProcess
                ? item.TreatmentProcess.treatmentProcess
                : null,
            })
          );

          setTypeOfWastes(flattenedData);
          setSuccessMessage("Type of waste updated successfully!");
        } else {
          console.error(
            "typeOfWastesRecords or typeOfWastesRecords.typeOfWastes is undefined or not an array"
          );
        }
      } else {
        // Add new type of waste
        response = await axios.post(
          `${apiUrl}/certificationDashboard/typeOfWastes`,
          formData
        );

        const typeOfWastesRecords = response.data;

        if (
          typeOfWastesRecords &&
          Array.isArray(typeOfWastesRecords.typeOfWastes)
        ) {
          const flattenedData = typeOfWastesRecords.typeOfWastes.map(
            (item) => ({
              ...item,
              treatmentProcess: item.TreatmentProcess
                ? item.TreatmentProcess.treatmentProcess
                : null,
            })
          );

          setTypeOfWastes(flattenedData);
          setSuccessMessage("Type of waste added successfully!");
        } else {
          console.error(
            "typeOfWastesRecords or typeOfWastesRecords.typeOfWastes is undefined or not an array"
          );
        }
      }

      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "wasteCategory",
      headerName: "Waste Category",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "wasteCode",
      headerName: "Waste Code",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "wasteDescription",
      headerName: "Waste Description",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "treatmentProcess",
      headerName: "Treatment Process",
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
          rows={typeOfWastes}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "wasteCode", sort: "asc" }],
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
            {formData.id
              ? "Update Type of Waste Form"
              : "Add New Type of Waste Form"}
          </Typography>
          <TextField
            label="Waste Category"
            name="wasteCategory"
            value={formData.wasteCategory}
            onChange={handleInputChange}
            select
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          >
            <MenuItem key={"HW"} value={"HW"}>
              {"HAZARDOUS WASTE"}
            </MenuItem>
            <MenuItem key={"NHW"} value={"NHW"}>
              {"NON HAZARDOUS WASTE"}
            </MenuItem>
          </TextField>
          <TextField
            label="Waste Code"
            name="wasteCode"
            value={formData.wasteCode}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
          />
          <TextField
            label="Waste Description"
            name="wasteDescription"
            value={formData.wasteDescription}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
          />
          <TextField
            label="Treatment Process"
            name="treatmentProcessId"
            value={formData.treatmentProcessId}
            onChange={handleInputChange}
            select
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          >
            {treatmentProcess.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.treatmentProcess}
              </MenuItem>
            ))}
          </TextField>
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
            {formData.id ? "Update Type of Waste" : "Add Type of Waste"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TypeOfWastes;
