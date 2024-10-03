import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Header from "../../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../../theme";
import SuccessMessage from "../../SuccessMessage";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import LoadingSpinner from "../../LoadingSpinner";

const ThirdPartyLogistics = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Create refs for the input fields
  const tplNameRef = useRef();
  const addressRef = useRef();
  const contactNumberRef = useRef();

  const initialFormData = {
    id: "",
    typeOfScrap: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [thirdPartyLogistics, setThirdPartyLogistics] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/thirdPartyLogistics`);

      setThirdPartyLogistics(response.data.thirdPartyLogistics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const typeToEdit = thirdPartyLogistics.find((type) => type.id === id);
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        tplId: typeToEdit.tplId,
        tplName: typeToEdit.tplName,
        address: typeToEdit.address,
        contactNumber: typeToEdit.contactNumber,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(
        `Third Party Logistics with ID ${id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Third Party Logistics?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/thirdPartyLogistics/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Third Party Logistics Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = (data) => {
    let validationErrors = [];

    // Validate tplName
    if (!data.tplName || data.tplName.trim() === "") {
      validationErrors.push("TPL Name is required.");
    }

    // Validate address
    if (!data.address || data.address.trim() === "") {
      validationErrors.push("Address is required.");
    }

    // Validate contactNumber (assuming a minimum length of 10 for a valid contact number)
    if (!data.contactNumber || data.contactNumber.trim() === "") {
      validationErrors.push("Contact Number is required.");
    } else if (!/^\d{10,}$/.test(data.contactNumber)) {
      // Optional: Adjust for your required contact number format
      validationErrors.push("Contact Number must be at least 10 digits.");
    }

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(" "));
      setShowErrorMessage(true);
      return false;
    }

    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Set formData from refs before validation
    const updatedFormData = {
      ...formData,
      tplName: tplNameRef.current.value,
      address: addressRef.current.value,
      contactNumber: contactNumberRef.current.value,
    };

    // Perform client-side validation
    if (!validateForm(updatedFormData)) {
      return;
    }

    try {
      setLoading(true);
      if (updatedFormData.id) {
        // Update existing third party logistics
        await axios.put(
          `${apiUrl}/api/thirdPartyLogistics/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Third Party Logistics Updated Successfully!");
      } else {
        // Add new third party logistics
        await axios.post(`${apiUrl}/api/thirdPartyLogistics`, updatedFormData);

        setSuccessMessage("Third Party Logistics Added Successfully!");
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
      field: "tplName",
      headerName: "Third Party Logistics",
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
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
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
    },
  ];

  const refs = {
    tplNameRef,
    addressRef,
    contactNumberRef,
  };

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Third Party Logistics"
          subtitle="List of Third Party Logistics"
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

      <CustomDataGridStyles>
        <DataGrid
          rows={thirdPartyLogistics ? thirdPartyLogistics : []}
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
              ? "Update Third Party Logistics"
              : "Add New Third Party Logistics"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <TextField
            label="Third Party Logistics"
            inputRef={refs.tplNameRef}
            defaultValue={formData.tplName}
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
            label="Address"
            inputRef={refs.addressRef}
            defaultValue={formData.address}
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
            label="Contact Number"
            inputRef={refs.contactNumberRef}
            defaultValue={formData.contactNumber}
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
            {formData.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ThirdPartyLogistics;
