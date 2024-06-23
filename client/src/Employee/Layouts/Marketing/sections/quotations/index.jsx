// components/Quotations.js

import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../../../../theme";
import QuotationFormModal from "../../../../../OtherComponents/Modals/QuotationFormModal";

const Quotations = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    clientId: "",
    quotationCode: "",
    validity: "",
    termsCharge: "",
    termsBuying: "",
    scopeOfWork: "",
    remarks: "",
    quotationWastes: [
      {
        id: null,
        quotationId: null,
        wasteId: "",
        wasteName: "",
        mode: "",
        unit: "",
        unitPrice: 0,
        vatCalculation: "",
        maxCapacity: 0,
      },
    ],
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [employeeData, setEmployeeData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/marketingDashboard/clients`
        );
        const clientRecords = response.data;

        if (clientRecords && Array.isArray(clientRecords.clients)) {
          setEmployeeData(clientRecords.clients);
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
  }, [apiUrl]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormData);
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChangeWaste = (index, field, value) => {
    const updatedWastes = [...formData.quotationWastes];
    updatedWastes[index][field] = value;

    setFormData((prevData) => ({
      ...prevData,
      quotationWastes: updatedWastes,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const response = await axios.put(
          `${apiUrl}/marketingDashboard/clients/${formData.id}`,
          formData
        );
        const updatedClient = response.data;

        const updatedData = employeeData.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        );

        setEmployeeData(updatedData);
        setSuccessMessage("Client updated successfully!");
      } else {
        const response = await axios.post(
          `${apiUrl}/marketingDashboard/clients`,
          formData
        );
        const newClient = response.data;

        setEmployeeData([...employeeData, newClient]);
        setSuccessMessage("Client added successfully!");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (id) => {
    const clientToEdit = employeeData.find((client) => client.id === id);
    if (clientToEdit) {
      setFormData({
        id: clientToEdit.id,
        clientId: clientToEdit.clientId,
        quotationCode: clientToEdit.quotationCode,
        validity: clientToEdit.validity,
        termsCharge: clientToEdit.termsCharge,
        termsBuying: clientToEdit.termsBuying,
        scopeOfWork: clientToEdit.scopeOfWork,
        remarks: clientToEdit.remarks,
        quotationWastes: [...clientToEdit.quotationWastes],
      });
      handleOpenModal();
    } else {
      console.error(`Client with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      await axios.delete(`${apiUrl}/marketingDashboard/clients/${id}`);

      const updatedData = employeeData.filter((client) => client.id !== id);
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
      width: 150, // Set a minimum width or initial width
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1, // Use flex to allow content to dictate width
      minWidth: 150, // Minimum width
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "natureOfBusiness",
      headerName: "Nature of Business",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      headerAlign: "center",
      align: "center",
      width: 180, // Set a width based on content requirements
    },
    {
      field: "clientType",
      headerName: "Client Type",
      headerAlign: "center",
      align: "center",
      width: 180, // Set a width based on content requirements
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
    <Box p="20px" width="100% !important">
      <Box display="flex" justifyContent="space-between">
        <Header title="Quotations" subtitle="List of Quotations" />
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
          rows={employeeData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "clientId", sort: "asc" }],
            },
          }}
        />
      </Box>
      <QuotationFormModal
        open={openModal}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        formData={formData}
        successMessage={successMessage}
        handleInputChangeWaste={handleInputChangeWaste}
      />
    </Box>
  );
};

export default Quotations;
