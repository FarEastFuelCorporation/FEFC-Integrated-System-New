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

const ProductionJD = ({ user, socket }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    transactionDate: "",
    ingredientCost: 0,
    packagingCost: 0,
    equipmentCost: 0,
    utilitiesCost: 0,
    laborCost: 0,
    totalCost: 0,
    grossIncome: 0,
    netIncome: 0,
    profitMargin: 0,
    ingredients: [
      {
        id: "",
        unit: "",
        remaining: "",
        unitPrice: "",
        quantity: "",
        amount: 0,
        remarks: "",
      },
    ],
    packagings: [
      {
        id: "",
        unit: "",
        remaining: "",
        unitPrice: "",
        quantity: "",
        amount: 0,
        remarks: "",
      },
    ],
    equipments: [
      {
        id: "",
        unit: "",
        remaining: "",
        unitPrice: "",
        quantity: "",
        amount: 0,
        remarks: "",
      },
    ],
    outputs: [
      {
        outputType: "",
        id: "",
        unit: "",
        quantity: 0,
        unitPrice: 0,
        amount: 0,
        remarks: "",
      },
    ],
    createdBy: user.id,
  };

  function calculateCosts(formData) {
    const calculateItemAmounts = (items) =>
      items.map((item) => {
        const quantity = Number(item.quantity || 0);
        const unitPrice = Number(item.unitPrice || 0);
        return {
          ...item,
          amount: quantity * unitPrice,
        };
      });

    // Only calculate amount for these:
    const updatedIngredients = calculateItemAmounts(formData.ingredients);

    const updatedPackagings = calculateItemAmounts(formData.packagings);

    // Don't touch amount for equipments, just use as is
    const updatedEquipments = formData.equipments.map((item) => ({
      ...item,
      amount: Number(item.amount || 0),
    }));

    // Outputs still need amount calculated
    const updatedOutputs = calculateItemAmounts(formData.outputs);

    const sumAmount = (items) =>
      items.reduce((total, item) => total + Number(item.amount || 0), 0);

    const ingredientCost = sumAmount(updatedIngredients);
    const packagingCost = sumAmount(updatedPackagings);
    const equipmentCost = sumAmount(updatedEquipments);
    const utilitiesCost = Number(formData.utilitiesCost || 0);
    const laborCost = Number(formData.laborCost || 0);

    const totalCost =
      ingredientCost +
      packagingCost +
      equipmentCost +
      utilitiesCost +
      laborCost;

    const grossIncome = updatedOutputs.reduce(
      (total, output) => total + Number(output.amount || 0),
      0
    );

    const netIncome = grossIncome - totalCost;
    const profitMargin =
      grossIncome > 0 ? Math.round((netIncome / grossIncome) * 10000) / 100 : 0;

    return {
      ...formData,
      ingredients: updatedIngredients,
      packagings: updatedPackagings,
      equipments: updatedEquipments,
      outputs: updatedOutputs,
      ingredientCost,
      packagingCost,
      equipmentCost,
      totalCost,
      grossIncome,
      netIncome,
      profitMargin,
    };
  }

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [transactions, setTransactions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [packagings, setPackagings] = useState([]);
  const [equipments, setEquipments] = useState([]);
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
      const response = await axios.get(`${apiUrl}/apiJD/production`);
      const responseInventory = await axios.get(`${apiUrl}/apiJD/inventory`);
      const responseEquipment = await axios.get(`${apiUrl}/apiJD/equipment`);

      const responseProduct = await axios.get(`${apiUrl}/apiJD/product`);

      const inventoryData = responseInventory.data.inventory;
      const equipmentData = responseEquipment.data.equipment;

      // Filter for "PACKAGING AND LABELING"
      const packagingItems = inventoryData.filter(
        (item) => item.transactionCategory === "PACKAGING AND LABELING"
      );

      // Filter for "INGREDIENTS"
      const ingredientItems = inventoryData.filter(
        (item) => item.transactionCategory === "INGREDIENTS"
      );

      console.log(response.data.production);

      // console.log(response.data.production);
      // console.log(packagingItems);
      // console.log(ingredientItems);
      // console.log(equipmentData);
      // console.log(responseProductCategory.data.productCategory);
      // console.log(responseProduct.data.product);

      // Update state
      setTransactions(response.data.production);
      setPackagings(packagingItems);
      setIngredients(ingredientItems);
      setEquipments(equipmentData);
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

        if (message.type === "NEW_PRODUCTION_JD") {
          setTransactions((prevData) => [...prevData, message.data]);
        } else if (message.type === "UPDATED_PRODUCTION_JD") {
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
        } else if (message.type === "DELETED_PRODUCTION_JD") {
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

  const ingredientDeps = formData.ingredients
    .map((i) => `${i.quantity}-${i.unitPrice}-${i.amount}`)
    .join();

  const packagingDeps = formData.packagings
    .map((p) => `${p.quantity}-${p.unitPrice}-${p.amount}`)
    .join();

  const equipmentDeps = formData.equipments
    .map((e) => `${e.quantity}-${e.unitPrice}-${e.amount}`)
    .join();

  const outputDeps = formData.outputs
    .map((o) => `${o.quantity}-${o.unitPrice}`)
    .join();

  useEffect(() => {
    setFormData((prev) => calculateCosts(prev));
  }, [
    ingredientDeps,
    packagingDeps,
    equipmentDeps,
    formData.utilitiesCost,
    formData.laborCost,
    outputDeps,
  ]);

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

    if (name === "outputType") {
      formData.outputTypeId = "";
    }

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
            quantity: row.InventoryJD?.[0]?.quantity,
            unit: row.InventoryJD?.[0]?.unit,
            unitPrice: row.InventoryJD?.[0]?.unitPrice,
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
        await axios.put(`${apiUrl}/apiJD/production/${formData.id}`, formData);

        setSuccessMessage("Transaction Updated Successfully!");
      } else {
        // Add new Transaction
        await axios.post(`${apiUrl}/apiJD/production`, formData);

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
        return formatDate3(params.row.transactionDate);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "batch",
      headerName: "Batch",
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "ingredientCost",
      headerName: "Ingredient Cost",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.ingredientCost || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "packagingCost",
      headerName: "Packaging Cost",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.packagingCost || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "equipmentCost",
      headerName: "Equipment Cost",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.equipmentCost || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "utilitiesCost",
      headerName: "Utilities Cost",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.utilitiesCost || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "laborCost",
      headerName: "Labor Cost",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.laborCost || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.totalCost || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "grossIncome",
      headerName: "Gross Income",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.grossIncome || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "netIncome",
      headerName: "Net Income",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.netIncome || 0;
        // Format the number with a thousands separator and 2 decimal places
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount); // Apply formatting for display purposes
      },
    },
    {
      field: "profitMargin",
      headerName: "Profit Margin",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const amount = params.row.profitMargin || 0;
        // Format the number with a thousands separator and 2 decimal places
        return `${new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)}%`;
      },
    },

    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 60,
    //   renderCell: (params) => (
    //     <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
    //       <EditIcon />
    //     </IconButton>
    //   ),
    // },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 60,
    //   renderCell: (params) => (
    //     <IconButton
    //       color="error"
    //       onClick={() => handleDeleteClick(params.row.id)}
    //     >
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // },
  ];

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Productions" subtitle="List of Productions" />
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
        ingredients={ingredients}
        packagings={packagings}
        equipments={equipments}
        products={products}
      />
    </Box>
  );
};

export default ProductionJD;
