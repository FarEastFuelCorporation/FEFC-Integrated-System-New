import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  LinearProgress,
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
import ConfirmationDialog from "../../ConfirmationDialog";
import { calculateRemainingDays, formatDate3 } from "../../Functions";
import SectionModal from "./Modal";
import { validateWasteForm } from "./Validation";

const PTT = ({ user, socket }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    clientId: "",
    ptt: "",
    approvedDate: "",
    remarks: "",
    wastes: [
      {
        wasteId: "",
        wasteName: "",
        quantity: 0,
      },
    ],
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [ptts, setPTTs] = useState([]);
  const [clients, setClients] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
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
      const response = await axios.get(`${apiUrl}/api/ptt`);
      const responseClient = await axios.get(`${apiUrl}/api/client`);
      const responseTypeOfWaste = await axios.get(`${apiUrl}/api/typeOfWaste`);

      setPTTs(response.data.ptts);
      setClients(responseClient.data.clients);
      setWasteTypes(responseTypeOfWaste.data.typeOfWastes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "NEW_PTT") {
          setPTTs((prevData) => {
            const updatedData = [...prevData, message.data];

            updatedData.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            return updatedData;
          });
        } else if (message.type === "UPDATE_PTT") {
          setPTTs((prevData) => {
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              const updatedData = [...prevData];
              updatedData[index] = message.data;

              updatedData.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );

              return updatedData;
            }

            // If not found, return the previous state unchanged
            return prevData;
          });
        } else if (message.type === "DELETED_PTT") {
          setPTTs((prevData) => {
            // Remove the data with matching ID
            const updatedData = prevData.filter(
              (prev) => prev.id !== message.data
            );
            return updatedData;
          });
        }
      };
    }
  }, [socket]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
    setErrorMessage("");
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (ptt) => {
    if (ptt) {
      // Populate the form data with the existing record values
      setFormData({
        id: ptt.id,
        clientId: ptt.clientId || "",
        ptt: ptt.ptt || "",
        approvedDate: ptt.approvedDate || "",
        remarks: ptt.remarks || "",
        wastes: ptt.PTTWaste.map((waste) => ({
          wasteId: waste.wasteId || "",
          wasteName: waste.TypeOfWaste?.wasteDescription || "",
          quantity: waste.quantity || 0,
        })) || [{ wasteId: "", wasteName: "", quantity: 0 }],
        createdBy: user.id,
      });

      handleOpenModal();
    } else {
      console.error(
        `Permit To Transport with ID ${ptt.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Permit To Transport?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/ptt/${id}`, {
        data: { deletedBy: user.id },
      });

      setSuccessMessage("Permit To Transport Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateWasteForm(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing ptt
        await axios.put(`${apiUrl}/api/ptt/${formData.id}`, formData);

        setSuccessMessage("Permit To Transport Updated Successfully!");
      } else {
        // Add new ptt
        await axios.post(`${apiUrl}/api/ptt`, formData);

        setSuccessMessage("Permit To Transport Added Successfully!");
      }

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
      field: "ptt",
      headerName: "PTT #",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.Client?.clientName;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "approvedDate",
      headerName: "Date Approved",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return formatDate3(params.value);
      },
    },
    {
      field: "expiredDate",
      headerName: "Date Expired",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params.row.approvedDate) return "";
        const approvedDate = new Date(params.row.approvedDate);
        const expiredDate = new Date(
          approvedDate.setMonth(approvedDate.getMonth() + 6)
        );
        return formatDate3(expiredDate);
      },
    },
    {
      field: "daysBeforeExpired",
      headerName: "Days Before Expired",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,

      valueGetter: (params) => {
        const quantity = params.row.quantity || 0;
        const quantityTreated = params.row.quantityTreated || 0;
        const progress = quantity > 0 ? (quantityTreated / quantity) * 100 : 0;

        if (progress === 100) return "COMPLETED";
        if (!params.row.approvedDate) return "";

        const today = new Date();
        const approvedDate = new Date(params.row.approvedDate);
        approvedDate.setMonth(approvedDate.getMonth() + 6);

        const timeDiff = approvedDate - today;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) return "Expired";

        return daysRemaining;
      },

      sortComparator: (v1, v2) => {
        const normalize = (v) => {
          if (v === "COMPLETED" || v === "Expired" || v === "") return Infinity;
          return v;
        };
        return normalize(v1) - normalize(v2);
      },

      renderCell: (params) => {
        const value = params.value;
        if (value === "COMPLETED") return "COMPLETED";
        if (value === "Expired") return "Expired";
        if (value === "") return "";

        return `${value} days`;
      },
    },
    {
      field: "progress",
      headerName: "Progress",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const quantity = params.row.quantity || 0;
        const quantityTreated = params.row.quantityTreated || 0;
        const progress = quantity > 0 ? (quantityTreated / quantity) * 100 : 0;

        let progressColor = "";
        let textColor = "white"; // Default text color

        if (progress <= 25) {
          progressColor = "red";
          textColor = "black"; // Better contrast on yellow
        } else if (progress <= 50) {
          progressColor = "orange";
          textColor = "black"; // Better contrast on yellow
        } else if (progress <= 75) {
          progressColor = "yellow";
          textColor = "black"; // Better contrast on yellow
        } else if (progress <= 99) {
          progressColor = "yellowgreen";
          textColor = "black"; // Better contrast on yellow
        } else if (progress === 100) {
          progressColor = "green";
        }

        return (
          <Box width="100%" position="relative">
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 20,
                borderRadius: 5,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progressColor,
                },
              }}
            />
            <Typography
              variant="caption"
              position="absolute"
              sx={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                color: textColor,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        );
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
        renderCell: (params) => (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row)}
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
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Permit To Transport"
          subtitle="List of Permit To Transport"
        />
        {(user.userType === 2 || user.userType === 7) && (
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
          rows={ptts ? ptts : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          getRowClassName={(params) => {
            const quantity = params.row.quantity || 0;
            const quantityTreated = params.row.quantityTreated || 0;
            const progress =
              quantity > 0 ? (quantityTreated / quantity) * 100 : 0;

            if (progress === 100) {
              return ""; // ✅ No highlight if completed
            }

            if (params.row.approvedDate) {
              const approvedDate = new Date(params.row.approvedDate);
              approvedDate.setMonth(approvedDate.getMonth() + 6);

              const today = new Date();
              const timeDiff = approvedDate - today;
              const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

              if (daysRemaining <= 30) {
                return "blink-red"; // 🔴 30 days or less
              } else if (daysRemaining <= 60) {
                return "blink-yellow"; // 🟡 60 days or less
              }
            }

            return ""; // Default
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: "daysBeforeExpired", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>

      <SectionModal
        open={openModal}
        onClose={handleCloseModal}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
        formData={formData}
        clients={clients}
        wasteTypes={wasteTypes}
      />
    </Box>
  );
};

export default PTT;
