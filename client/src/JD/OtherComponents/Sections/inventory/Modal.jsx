import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  Grid,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { tokens } from "../../../theme";

const ModalJD = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const category1 = [
    "EQUIPMENTS",
    "INGREDIENTS",
    "LABOR",
    "PACKAGING AND LABELING",
    "TRANSPORTATION",
    "UNSOLD GOODS",
    "UTILITIES",
    "OPERATIONS",
    "SALES",
  ];

  const category2 = [
    "CASH IN",
    "CASH ON HAND",
    "CASH OUT",
    "EQUIPMENT FUNDS",
    "EQUIPMENTS",
    "INGREDIENTS",
    "LABOR",
    "PACKAGING AND LABELING",
    "TRANSPORTATION",
    "UNSOLD GOODS",
    "UTILITIES",
  ];

  const unitCategory = [
    "PC",
    "PACK",
    "G",
    "KG",
    "ML",
    "L",
    "BOTTLE",
    "BOX",
    "ROLL",
  ];

  const handleAddTransaction = () => {
    const newTransaction = {
      transactionDetails: "",
      transactionCategory: "",
      fundSource: "",
      fundAllocation: "",
      quantity: "",
      unit: "",
      unitPrice: "",
      amount: 0,
      remarks: "",
    };
    const updatedTransactions = [...formData.transactions, newTransaction];
    handleInputChange({
      target: { name: "transactions", value: updatedTransactions },
    });
  };

  const handleRemoveTransaction = (index) => {
    const updatedTransactions = formData.transactions.filter(
      (waste, i) => i !== index
    );
    handleInputChange({
      target: { name: "transactions", value: updatedTransactions },
    });
  };

  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = formData.transactions.map((transaction, i) => {
      if (i !== index) return transaction;

      // Calculate amount if quantity or unitPrice is updated
      const updatedTransaction = {
        ...transaction,
        [field]: value,
        ...(field === "transactionCategory" && {
          transactionDetails: "",
          fundSource: "",
          fundAllocation: "",
          quantity: "",
          unit: "",
          unitPrice: "",
          amount: 0,
          remarks: "",
        }),
      };

      if (field === "quantity" || field === "unitPrice") {
        const quantity = parseFloat(updatedTransaction.quantity) || 0;
        const unitPrice = parseFloat(updatedTransaction.unitPrice) || 0;
        updatedTransaction.amount = quantity * unitPrice;
      }

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "transactions", value: updatedTransactions },
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxHeight: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "scroll",
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Transaction" : "Add New Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1} lg={2}>
            <TextField
              label="Transaction Date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleInputChange}
              type="Date"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
                shrink: true,
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        {formData.transactions.map((transaction, index) => {
          const hasQuantity =
            transaction.transactionCategory === "EQUIPMENTS" ||
            transaction.transactionCategory === "INGREDIENTS" ||
            transaction.transactionCategory === "PACKAGING AND LABELING";

          const hasCategory = transaction.transactionCategory ? true : false;

          return (
            <Box key={index}>
              <Typography variant="subtitle2" gutterBottom>
                Transaction Entry #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={1} lg={2}>
                  <FormControl fullWidth required>
                    <InputLabel
                      style={{
                        color: colors.grey[100],
                      }}
                    >
                      Transaction Category
                    </InputLabel>
                    <Select
                      labelId={`transactionCategory`}
                      name={`transactions[${index}].transactionCategory`}
                      value={transaction.transactionCategory || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          index,
                          "transactionCategory",
                          e.target.value
                        )
                      }
                      fullWidth
                      inputProps={{
                        name: `transactionCategory`,
                        id: `transactionCategory`,
                      }}
                    >
                      {category1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {hasCategory && (
                  <Grid item xs={1} lg={2}>
                    <TextField
                      label="Transaction Details"
                      name={`transactions[${index}].transactionDetails`}
                      value={transaction.transactionDetails || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          index,
                          "transactionDetails",
                          e.target.value
                        )
                      }
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                )}
                {hasCategory && (
                  <Grid item xs={1} lg={2}>
                    <FormControl fullWidth required>
                      <InputLabel
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Fund Source
                      </InputLabel>
                      <Select
                        labelId={`fundSource`}
                        name={`transactions[${index}].fundSource`}
                        value={transaction.fundSource || ""}
                        onChange={(e) =>
                          handleTransactionChange(
                            index,
                            "fundSource",
                            e.target.value
                          )
                        }
                        fullWidth
                        inputProps={{
                          name: `fundSource`,
                          id: `fundSource`,
                        }}
                      >
                        {category2.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {hasCategory && (
                  <Grid item xs={1} lg={2}>
                    <FormControl fullWidth required>
                      <InputLabel
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Fund Allocation
                      </InputLabel>
                      <Select
                        labelId={`fundAllocation`}
                        name={`transactions[${index}].fundAllocation`}
                        value={transaction.fundAllocation || ""}
                        onChange={(e) =>
                          handleTransactionChange(
                            index,
                            "fundAllocation",
                            e.target.value
                          )
                        }
                        fullWidth
                        sx={{ mb: 2 }}
                        inputProps={{
                          name: `fundAllocation`,
                          id: `fundAllocation`,
                        }}
                      >
                        {category2.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {hasCategory && !hasQuantity && (
                  <Grid item xs={1} lg={1.5}>
                    <TextField
                      label="Amount"
                      name={`transactions[${index}].amount`}
                      value={transaction.amount || ""}
                      onChange={(e) =>
                        handleTransactionChange(index, "amount", e.target.value)
                      }
                      type="Number"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                        shrink: true,
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                )}
                {hasCategory && (
                  <Grid item xs={1} lg={!hasQuantity ? 2 : 3.5}>
                    <TextField
                      label="Remarks"
                      name={`transactions[${index}].remarks`}
                      value={transaction.remarks || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                )}
                <Grid item xs={0.5} textAlign="right">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveTransaction(index)}
                  >
                    <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Grid>
                {hasCategory && hasQuantity && (
                  <Grid item xs={1} lg={2}>
                    <FormControl fullWidth required>
                      <InputLabel
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Unit
                      </InputLabel>
                      <Select
                        labelId={`unit`}
                        name={`transactions[${index}].unit`}
                        value={transaction.unit || ""}
                        onChange={(e) =>
                          handleTransactionChange(index, "unit", e.target.value)
                        }
                        fullWidth
                        inputProps={{
                          name: `unit`,
                          id: `unit`,
                        }}
                      >
                        {unitCategory.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {hasCategory && hasQuantity && (
                  <Grid item xs={1} lg={2}>
                    <TextField
                      label="Quantity"
                      name={`transactions[${index}].quantity`}
                      value={transaction.quantity || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                        shrink: true,
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                )}
                {hasCategory && hasQuantity && (
                  <Grid item xs={1} lg={2}>
                    <TextField
                      label="Unit Price"
                      name={`transactions[${index}].unitPrice`}
                      value={transaction.unitPrice || ""}
                      onChange={(e) =>
                        handleTransactionChange(
                          index,
                          "unitPrice",
                          e.target.value
                        )
                      }
                      type="Number"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                        shrink: true,
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                )}
                {hasCategory && hasQuantity && (
                  <Grid item xs={1} lg={2}>
                    <TextField
                      label="Amount"
                      name={`transactions[${index}].amount`}
                      value={transaction.amount || ""}
                      onChange={(e) =>
                        handleTransactionChange(index, "amount", e.target.value)
                      }
                      type="Number"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                        shrink: true,
                      }}
                      autoComplete="off"
                      disabled
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        })}
        <Box display="flex" justifyContent="center">
          <IconButton color="success" onClick={handleAddTransaction}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        <TextField
          label="Created By"
          name="createdBy"
          value={formData.createdBy}
          onChange={handleInputChange}
          fullWidth
          autoComplete="off"
          style={{ display: "none" }}
        />
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update Transaction" : "Add Transaction"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalJD;
