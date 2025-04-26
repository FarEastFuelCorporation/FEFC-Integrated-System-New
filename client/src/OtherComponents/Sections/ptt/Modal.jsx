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
  useMediaQuery,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { tokens } from "../../../theme";

const SectionModal = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  clients,
  wasteTypes,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddWaste = () => {
    const newWaste = {
      wasteId: "",
      wasteName: "",
      quantity: 0,
    };
    const updatedWastes = [...formData.wastes, newWaste];
    handleInputChange({
      target: { name: "wastes", value: updatedWastes },
    });
  };

  const handleRemoveWaste = (index) => {
    const updatedWastes = formData.wastes.filter((waste, i) => i !== index);
    handleInputChange({
      target: { name: "wastes", value: updatedWastes },
    });
  };

  const handleWasteChange = (index, field, value) => {
    const updatedWastes = formData.wastes.map((waste, i) => {
      if (i !== index) return waste;

      let updatedWaste = {
        ...waste,
        [field]: value,
      };

      console.log("Updated Waste:", field);

      // If wasteId is changed, also update wasteName using wasteDescription
      if (field === "wasteId") {
        const selectedWaste = wasteTypes.find((w) => w.id === value);
        if (selectedWaste) {
          updatedWaste.wasteName = selectedWaste.wasteDescription;
        }
      }

      return updatedWaste;
    });

    handleInputChange({
      target: { name: "wastes", value: updatedWastes },
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
          width: isMobile ? "90%" : "50%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          maxHeight: "80vh",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id
            ? "Update Permit To Transport"
            : "Add New Permit To Transport"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Autocomplete
              fullWidth
              options={clients}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option.clientName || "";
              }}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.clientName
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase())
                )
              }
              value={
                clients.find((c) => c.clientId === formData.clientId) || null
              }
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: "clientId",
                    value: newValue?.clientId || "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client Name"
                  name="clientId"
                  required
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} lg={3}>
            <TextField
              label="PTT No"
              name="ptt"
              value={formData.ptt}
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
          </Grid>
          <Grid item xs={12} lg={3}>
            <TextField
              label="Date Approved"
              name="approvedDate"
              value={formData.approvedDate}
              onChange={handleInputChange}
              fullWidth
              type="date"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              disabled={formData.id}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        {formData.wastes?.map((waste, index) => {
          return (
            <Box key={index}>
              <Typography variant="subtitle2" gutterBottom>
                Item #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={3}>
                  <FormControl fullWidth required>
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
                      name={`wastes[${index}].wasteId`}
                      value={waste.wasteId}
                      onChange={(e) =>
                        handleWasteChange(index, "wasteId", e.target.value)
                      }
                      label="Type of Waste"
                      fullWidth
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                    >
                      {wasteTypes.map((wasteType) => (
                        <MenuItem key={wasteType.id} value={wasteType.id}>
                          {wasteType.wasteCode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label="Waste Name"
                    name={`wastes[${index}].wasteName`}
                    value={waste.wasteName}
                    onChange={(e) =>
                      handleWasteChange(index, "wasteName", e.target.value)
                    }
                    fullWidth
                    required
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={5} lg={2}>
                  <TextField
                    label="Quantity"
                    name={`wastes[${index}].quantity`}
                    value={waste.quantity || 0}
                    onChange={(e) =>
                      handleWasteChange(index, "quantity", e.target.value)
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
                {!formData.id && (
                  <Grid item xs={0.5} textAlign="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveWaste(index)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        })}
        {!formData.id && (
          <Box display="flex" justifyContent="center">
            <IconButton color="success" onClick={handleAddWaste}>
              <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        )}
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
          {formData.id ? "Update" : "Add"}
        </Button>
      </Box>
    </Modal>
  );
};

export default SectionModal;
