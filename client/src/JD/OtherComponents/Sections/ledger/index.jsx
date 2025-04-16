import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import {
  formatDate3,
  formatNumber,
  renderCellWithWrapText,
} from "../../Functions";
import { columns } from "./Column";

const LedgerJD = ({ user, socket }) => {
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
  const [products, setProducts] = useState([]);
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
      const response = await axios.get(`${apiUrl}/apiJD/ledger`);

      const responseProduct = await axios.get(`${apiUrl}/apiJD/product`);

      setTransactions(response.data.ledger);

      setProducts(responseProduct.data.product);
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

        if (message.type === "NEW_LEDGER_JD") {
          setTransactions((prevData) =>
            [...prevData, message.data].sort(
              (a, b) =>
                new Date(b.transactionDate) - new Date(a.transactionDate)
            )
          );
        } else if (message.type === "UPDATED_LEDGER_JD") {
          setTransactions((prevData) => {
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              const updatedData = [...prevData];
              updatedData[index] = message.data;

              // Sort by date in descending order after update
              return updatedData.sort(
                (a, b) =>
                  new Date(b.transactionDate) - new Date(a.transactionDate)
              );
            } else {
              return prevData;
            }
          });
        } else if (message.type === "DELETED_LEDGER_JD") {
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
        transactionDate: row.transactionDate,
        transactions: [
          {
            transactionDetails: row.transactionDetails,
            transactionCategory: row.transactionCategory,
            fundSource: row.fundSource,
            fundAllocation: row.fundAllocation,
            quantity:
              row.transactionCategory === "SALES"
                ? row.ProductLedgerJD?.[0]?.quantity
                : row.InventoryJD?.[0]?.quantity,
            unit:
              row.transactionCategory === "SALES"
                ? row.ProductLedgerJD?.[0]?.unit
                : row.InventoryJD?.[0]?.unit,
            unitPrice:
              row.transactionCategory === "SALES"
                ? row.ProductLedgerJD?.[0]?.unitPrice
                : row.InventoryJD?.[0]?.unitPrice,
            amount: row.amount,
            remarks: row.remarks,
          },
        ],
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

  const columns = [
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return params.row.transactionDate; // Keep the raw date value for sorting
      },
      renderCell: (params) => {
        return formatDate3(params.row.transactionDate); // Format the date for display
      },
    },
    {
      field: "transactionDetails",
      headerName: "Transaction Details",
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 250,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transactionCategory",
      headerName: "Transaction Category",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fundSource",
      headerName: "Fund Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fundAllocation",
      headerName: "Fund Allocation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.amount);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return `${params.row.EmployeeJD?.firstName} ${params.row.EmployeeJD?.lastName}`;
      },
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
        <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
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

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Ledger" subtitle="List of Daily Transactions" />
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
      <CustomDataGridStyles>
        <DataGrid
          rows={transactions}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          sortModel={[{ field: "transactionDate", sort: "desc" }]}
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
        products={products}
      />
    </Box>
  );
};

export default LedgerJD;
