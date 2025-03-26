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
} from "@mui/material";
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
          {formData.id ? "Update Transaction" : "Add New Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
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
        <TextField
          label="Transaction Details"
          name="transactionDetails"
          value={formData.transactionDetails}
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
            name={`transactionCategory`}
            value={formData.transactionCategory || ""}
            onChange={handleInputChange}
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
            name={`fundSource`}
            value={formData.fundSource || ""}
            onChange={handleInputChange}
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
            name={`fundAllocation`}
            value={formData.fundAllocation || ""}
            onChange={handleInputChange}
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
        <TextField
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
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
        <TextField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
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
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update Transaction" : "Add Transaction"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalJD;
