import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  Tabs,
  Card,
  Tab,
  Badge,
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
import ModalJD from "./Modal";
import { Validation } from "./Validation";
import { formatDate3, formatNumber } from "../../Functions";
import { columns } from "./Column";

const EquipmentJD = ({ user, socket }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    transactionDate: "",
    transactions: [
      {
        transactionDetails: "",
        transactionCategory: "",
        fundSource: "",
        fundAllocation: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        amount: 0,
        remarks: "",
      },
    ],
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [transactions, setTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/apiJD/equipment`);

      console.log(response.data.equipment);
      setTransactions(response.data.equipment);
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

        if (message.type === "NEW_EQUIPMENT_JD") {
          setTransactions((prevData) => [...prevData, message.data]);
        } else if (message.type === "UPDATED_EQUIPMENT_JD") {
          setTransactions((prevData) => {
            // Find the index of the data to be updated
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              // Replace the updated data data
              const updatedData = [...prevData];
              updatedData[index] = message.data; // Update the data at the found index
              return updatedData;
            } else {
              // If the data is not found, just return the previous state
              return prevData;
            }
          });
        } else if (message.type === "DELETED_EQUIPMENT_JD") {
          setTransactions((prevData) => {
            const updatedData = prevData.filter(
              (prev) => prev.id !== message.data // Remove the data with matching ID
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

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage("");
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (row) => {
    if (row) {
      setFormData({
        id: row.id,
        productCategory: row.productCategory,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Transaction with ID ${row.id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/apiJD/ledger/${id}`, {
        data: { deletedBy: user.id },
      });

      setSuccessMessage("Transaction Deleted Successfully!");
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

    const validationErrors = Validation(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing Transaction
        await axios.put(`${apiUrl}/apiJD/ledger/${formData.id}`, formData);

        setSuccessMessage("Transaction Updated Successfully!");
      } else {
        // Add new Transaction
        await axios.post(`${apiUrl}/apiJD/ledger`, formData);

        setSuccessMessage("Transaction Added Successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // if (user.userType === 1) {
  //   const existingFields = columns.map((col) => col.field);

  //   if (!existingFields.includes("edit")) {
  //     columns.push({
  //       field: "edit",
  //       headerName: "Edit",
  //       headerAlign: "center",
  //       align: "center",
  //       sortable: false,
  //       width: 60,
  //       renderCell: (params) => (
  //         <IconButton
  //           color="warning"
  //           onClick={() => handleEditClick(params.row)}
  //         >
  //           <EditIcon />
  //         </IconButton>
  //       ),
  //     });
  //   }

  //   if (!existingFields.includes("delete")) {
  //     columns.push({
  //       field: "delete",
  //       headerName: "Delete",
  //       headerAlign: "center",
  //       align: "center",
  //       sortable: false,
  //       width: 60,
  //       renderCell: (params) => (
  //         <IconButton
  //           color="error"
  //           onClick={() => handleDeleteClick(params.row.id)}
  //         >
  //           <DeleteIcon />
  //         </IconButton>
  //       ),
  //     });
  //   }
  // }

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Equipment"
          subtitle="List of Equipments and Transaction Log"
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
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      />
      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          sx={{
            "& .Mui-selected": {
              backgroundColor: colors.greenAccent[400],
              boxShadow: "none",
              borderBottom: `1px solid ${colors.grey[100]}`,
            },
            "& .MuiTab-root > span": {
              paddingRight: "10px",
            },
          }}
        >
          <Tab
            label={
              <Badge
                // badgeContent={pendingCount}
                color="error"
                max={9999}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Transaction
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                // badgeContent={pendingCount}
                color="error"
                max={9999}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Equipments
              </Badge>
            }
          />
        </Tabs>
      </Card>
      <CustomDataGridStyles margin={0}>
        <DataGrid
          rows={transactions}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "productCategory", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <ModalJD
        user={user}
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default EquipmentJD;
