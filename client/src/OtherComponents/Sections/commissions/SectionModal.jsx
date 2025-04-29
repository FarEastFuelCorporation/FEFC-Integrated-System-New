import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { tokens } from "../../../theme";

const SectionModal = ({
  user,
  open,
  handleCloseModal,
  formData,
  setFormData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  clients,
  quotationWaste,
  employees,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleAddItem = () => {
    const newItem = {
      id: "",
      quotationItemId: "",
      amount: 0,
    };
    const updatedItems = [...formData.items, newItem];
    handleInputChange({
      target: { name: "items", value: updatedItems },
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((waste, i) => i !== index);
    handleInputChange({
      target: { name: "items", value: updatedItems },
    });
  };

  const handleWasteChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      style={{ overflowY: "scroll", scrollbarWidth: "none" }}
    >
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={handleCloseModal} color="error">
            <CloseIcon style={{ fontSize: "32" }} />
          </IconButton>
        </Box>
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Commission Form" : "Add New Commission Form"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={3}>
            <TextField
              label="Date"
              name="transactionDate"
              type="date"
              value={formData.transactionDate}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
          {formData.id && (
            <Grid item xs={6} lg={3}>
              <TextField
                label="Commission Code"
                name="commissionCode"
                value={formData.commissionCode}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!!formData.id}
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
          )}
          <Grid item xs={12} lg={formData.id ? 6 : 9}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => option.clientName || ""}
              value={
                clients.find(
                  (client) => client.clientId === formData.clientId
                ) || null
              }
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: "clientId",
                    value: newValue ? newValue.clientId : "",
                  },
                });
              }}
              disabled={!!formData.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  required
                  fullWidth
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => option.employeeName || ""}
              value={
                employees.find(
                  (emp) => emp.employeeId === formData.employeeId
                ) || null
              }
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: "employeeId",
                    value: newValue ? newValue.employeeId : "",
                  },
                });
              }}
              disabled={!!formData.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Agent"
                  required
                  fullWidth
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <TextField
          label="Created By"
          name="createdBy"
          value={user}
          onChange={handleInputChange}
          fullWidth
          required
          autoComplete="off"
          style={{ display: "none" }}
        />
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
          Items
        </Typography>
        <Box>
          {formData.items.map((waste, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Item #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                  <FormControl fullWidth required disabled={!formData.clientId}>
                    <InputLabel
                      id={`waste-type-select-label-${index}`}
                      style={{
                        color: colors.grey[100],
                      }}
                    >
                      Type of Waste
                    </InputLabel>
                    <Select
                      labelId={`waste-type-select-label-${index}`}
                      name={`items[${index}].quotationWasteId`}
                      value={waste.quotationWasteId}
                      onChange={(e) =>
                        handleWasteChange(
                          index,
                          "quotationWasteId",
                          e.target.value
                        )
                      }
                      label="Type of Waste"
                      fullWidth
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                    >
                      {quotationWaste.map((waste) => (
                        <MenuItem key={waste.id} value={waste.id}>
                          {waste.wasteName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <TextField
                    label="Amount"
                    name={`items[${index}].amount`}
                    value={waste.amount}
                    onChange={(e) =>
                      handleWasteChange(index, "amount", e.target.value)
                    }
                    type="number"
                    fullWidth
                    required
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={0.5} textAlign="right">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton color="success" onClick={handleAddItem}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SectionModal;
