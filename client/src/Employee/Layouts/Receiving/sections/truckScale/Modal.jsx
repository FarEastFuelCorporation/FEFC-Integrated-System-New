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
import { tokens } from "../../../../../theme";

const SectionModal = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  clients,
  clientWasteNames,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          {formData.id ? "Update Truck Scale" : "Add New Truck Scale"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth required disabled={!!formData.id}>
              <InputLabel
                style={{
                  color: colors.grey[100],
                }}
              >
                Transaction Type
              </InputLabel>
              <Select
                labelId={`transactionType`}
                name={`transactionType`}
                value={formData.transactionType || ""}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  name: `transactionType`,
                  id: `transactionType`,
                }}
              >
                <MenuItem key={"INBOUND"} value={"INBOUND"}>
                  {"INBOUND"}
                </MenuItem>
                <MenuItem key={"OUTBOUND"} value={"OUTBOUND"}>
                  {"OUTBOUND"}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.id && (
            <Grid item xs={12} lg={6}>
              <TextField
                label="Truck Scale No"
                name="truckScaleNo"
                value={formData.truckScaleNo}
                onChange={handleInputChange}
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
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            {!formData.id && (
              <Autocomplete
                freeSolo
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
                inputValue={formData.clientName}
                onInputChange={(event, newInputValue) => {
                  handleInputChange({
                    target: {
                      name: "clientName",
                      value: newInputValue || "",
                    },
                  });
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === "object" && newValue !== null) {
                    // Selected from the list
                    handleInputChange({
                      target: {
                        name: "clientName",
                        value: newValue.clientName,
                      },
                    });
                    handleInputChange({
                      target: {
                        name: "clientId",
                        value: newValue.clientId,
                      },
                    });
                  } else {
                    // Manually typed
                    handleInputChange({
                      target: {
                        name: "clientId",
                        value: "",
                      },
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client Name"
                    name="clientName"
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
            )}
            {!formData.id && (
              <Autocomplete
                value={formData.commodity}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "commodity",
                      value:
                        typeof newValue === "string"
                          ? newValue
                          : newValue?.label || "",
                    },
                  });
                }}
                inputValue={formData.commodity}
                onInputChange={(event, newInputValue) => {
                  handleInputChange({
                    target: {
                      name: "commodity",
                      value: newInputValue,
                    },
                  });
                }}
                options={clientWasteNames.map((waste) => ({ label: waste }))}
                getOptionLabel={(option) => {
                  return typeof option === "string" ? option : option.label;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Commodity"
                    name="commodity"
                    required
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                    autoComplete="off"
                  />
                )}
                fullWidth
                freeSolo
              />
            )}
            {formData.id && (
              <TextField
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                disabled={formData.id}
                autoComplete="off"
              />
            )}
            {formData.id && (
              <TextField
                label="Commodity"
                name="commodity"
                value={formData.commodity}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                disabled={formData.id}
                autoComplete="off"
              />
            )}
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Plate Number"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              disabled={formData.id}
              autoComplete="off"
            />
            <TextField
              label="Driver"
              name="driver"
              value={formData.driver}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              disabled={formData.id}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3}>
            <TextField
              label="First Scale Date"
              name="firstScaleDate"
              value={formData.firstScaleDate}
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
          <Grid item xs={12} lg={3}>
            <TextField
              label="First Scale Time"
              name="firstScaleTime"
              value={formData.firstScaleTime}
              onChange={handleInputChange}
              fullWidth
              type="time"
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
          <Grid item xs={12} lg={3}>
            <TextField
              label="Second Scale Date"
              name="secondScaleDate"
              value={formData.secondScaleDate}
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
              disabled={!formData.id}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} lg={3}>
            <TextField
              label="Second Scale Time"
              name="secondScaleTime"
              value={formData.secondScaleTime}
              onChange={handleInputChange}
              fullWidth
              type="time"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              disabled={!formData.id}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {formData.transactionType === "OUTBOUND" && (
            <Grid item xs={12} lg={4}>
              <TextField
                label="Tare Weight"
                name="tareWeight"
                value={formData.tareWeight}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                disabled={formData.transactionType === "INBOUND"}
                autoComplete="off"
              />
            </Grid>
          )}
          <Grid item xs={12} lg={4}>
            <TextField
              label="Gross Weight"
              name="grossWeight"
              value={formData.grossWeight}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              disabled={formData.transactionType === "OUTBOUND"}
              autoComplete="off"
            />
          </Grid>
          {formData.transactionType === "INBOUND" && (
            <Grid item xs={12} lg={4}>
              <TextField
                label="Tare Weight"
                name="tareWeight"
                value={formData.tareWeight}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                disabled={formData.transactionType === "INBOUND"}
                autoComplete="off"
              />
            </Grid>
          )}
          <Grid item xs={12} lg={4}>
            <TextField
              label="Net Weight"
              name="netWeight"
              value={formData.netWeight}
              onChange={handleInputChange}
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
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
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
          </Grid>
        </Grid>
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
