// components/Quotations.js

import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { format } from "date-fns";
import QuotationFormModal from "../../../../../OtherComponents/Modals/QuotationFormModal";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";

const Quotations = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const initialFormData = {
    id: "",
    clientId: "",
    quotationCode: "",
    validity: "",
    termsCharge: "",
    termsBuying: "",
    scopeOfWork: "",
    remarks: "",
    submittedBy: user.id,
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
  const [quotationsData, setQuotationsData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/marketingDashboard/quotations`
        );
        const quotations = response.data;
        console.log(quotations);
        if (quotations && Array.isArray(quotations.quotations)) {
          const flattenedData = quotations.quotations.map((item) => ({
            ...item,
            clientPicture: item.Client ? item.Client.clientPicture : null,
            clientName: item.Client ? item.Client.clientName : null,
            quotationWastes: item.QuotationWaste ? item.QuotationWaste : [],
            validity: item.validity
              ? new Date(item.validity).toISOString().split("T")[0]
              : null, // Convert timestamp to yyyy-mm-dd format
          }));
          setQuotationsData(flattenedData);
        } else {
          console.error(
            "clientRecords or clientRecords.clients is undefined or not an array"
          );
        }
      } catch (error) {
        console.error("Error fetching quotationsData:", error);
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
    const updatedWastes = formData.quotationWastes.map((waste, i) =>
      i === index ? { ...waste, [field]: value } : waste
    );
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleEditClick = (id) => {
    const quotationToEdit = quotationsData.find(
      (quotation) => quotation.id === id
    );
    if (quotationToEdit) {
      setFormData({
        id: quotationToEdit.id,
        clientId: quotationToEdit.clientId,
        quotationCode: quotationToEdit.quotationCode,
        validity: quotationToEdit.validity,
        termsCharge: quotationToEdit.termsCharge,
        termsBuying: quotationToEdit.termsBuying,
        scopeOfWork: quotationToEdit.scopeOfWork,
        remarks: quotationToEdit.remarks,
        submittedBy: quotationToEdit.Client.submittedBy,
        quotationWastes: quotationToEdit.quotationWastes
          ? quotationToEdit.quotationWastes
          : [], // Ensure quotationWastes is an array
      });
      handleOpenModal();
    } else {
      console.error(`Quotation with ID ${id} not found for editing.`);
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
      await axios.delete(`${apiUrl}/marketingDashboard/quotations/${id}`);

      const updatedData = quotationsData.filter(
        (quotation) => quotation.id !== id
      );
      setQuotationsData(updatedData);
      setSuccessMessage("Quotation deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      let response;

      if (formData.id) {
        // Update existing quotation
        response = await axios.put(
          `${apiUrl}/marketingDashboard/quotations/${formData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const updatedQuotation = response.data;

        // Update quotationsData state with the updated quotation
        const updatedData = quotationsData.map((quotation) =>
          quotation.id === updatedQuotation.id
            ? {
                ...quotation,
                ...updatedQuotation,
                clientPicture: updatedQuotation.Client
                  ? updatedQuotation.Client.clientPicture
                  : null,
                clientName: updatedQuotation.Client
                  ? updatedQuotation.Client.clientName
                  : null,
                quotationWastes: updatedQuotation.QuotationWaste
                  ? updatedQuotation.QuotationWaste
                  : [],
                validity: updatedQuotation.validity
                  ? new Date(updatedQuotation.validity)
                      .toISOString()
                      .split("T")[0]
                  : null,
              }
            : quotation
        );

        setQuotationsData(updatedData);
        setSuccessMessage("Quotation updated successfully!");
      } else {
        // Add new quotation
        response = await axios.post(
          `${apiUrl}/marketingDashboard/quotations`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newQuotation = response.data;
        setQuotationsData([
          ...quotationsData,
          {
            ...newQuotation,
            clientPicture: newQuotation.Client
              ? newQuotation.Client.clientPicture
              : null,
            clientName: newQuotation.Client
              ? newQuotation.Client.clientName
              : null,
            quotationWastes: newQuotation.QuotationWaste
              ? newQuotation.QuotationWaste
              : [],
            validity: newQuotation.validity
              ? new Date(newQuotation.validity).toISOString().split("T")[0]
              : null,
          },
        ]);
        setSuccessMessage("Quotation added successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "quotationCode",
      headerName: "Quotation Code",
      headerAlign: "center",
      align: "center",
      width: 120, // Set a minimum width or initial width
    },
    {
      field: "revisionNumber",
      headerName: "Revision Number",
      headerAlign: "center",
      align: "center",
      minWidth: 120, // Minimum width
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
      renderCell: (params) => <div className={"wrap-text"}>{params.value}</div>,
    },
    {
      field: "termsCharge",
      headerName: "Terms (Charge)",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
    },
    {
      field: "termsBuying",
      headerName: "Terms (Buying)",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    {
      field: "scopeOfWork",
      headerName: "Scope Of Work",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => <div className={"wrap-text"}>{params.value}</div>,
    },
    {
      field: "validity",
      headerName: "Validity",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      valueFormatter: (params) => {
        if (!params.value) return ""; // Handle empty or null values
        return format(new Date(params.value), "MMMM dd yyyy");
      },
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
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomDataGridStyles>
        <DataGrid
          rows={quotationsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "quotationCode", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <QuotationFormModal
        user={user.id}
        open={openModal}
        handleCloseModal={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleInputChangeWaste={handleInputChangeWaste}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default Quotations;
