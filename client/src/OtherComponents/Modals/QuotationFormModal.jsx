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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { tokens } from "../../theme";

const QuotationFormModal = ({
  open,
  handleCloseModal,
  formData,
  successMessage,
  handleInputChange,
}) => {
  const [clients, setClients] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [wasteTypes, setWasteTypes] = useState([]);
  const modeOptions = ["BUYING", "CHARGE", "FREE OF CHARGE"];
  const unitOptions = ["PC", "KG", "L", "DRUM", "LOT"];
  const vatCalculationOptions = [
    "VAT EXCLUSIVE",
    "VAT INCLUSIVE",
    "NON VATABLE",
  ];

  useEffect(() => {
    if (open) {
      const fetchClientsAndWasteTypes = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const [clientsResponse, wasteTypesResponse] = await Promise.all([
            axios.get(`${apiUrl}/marketingDashboard/clients`),
            axios.get(`${apiUrl}/marketingDashboard/typeOfWastes`),
          ]);

          setClients(clientsResponse.data.clients);
          const mappedWasteTypes = wasteTypesResponse.data.typeOfWastes.map(
            (waste) => ({
              id: waste.id,
              wasteName: waste.wasteName,
              wasteCode: waste.wasteCode,
            })
          );
          setWasteTypes(mappedWasteTypes);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchClientsAndWasteTypes();
    }
  }, [open]);

  const handleAddWaste = () => {
    const newWaste = {
      id: null,
      quotationId: null,
      wasteId: "",
      wasteName: "",
      mode: "",
      unit: "",
      unitPrice: 0,
      vatCalculation: "",
      maxCapacity: 0,
    };
    const updatedWastes = [...formData.quotationWastes, newWaste];
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleRemoveWaste = (index) => {
    const updatedWastes = formData.quotationWastes.filter(
      (waste, i) => i !== index
    );
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleWasteInputChangeLocal = (index, field, value) => {
    const updatedWastes = formData.quotationWastes.map((waste, i) =>
      i === index ? { ...waste, [field]: value } : waste
    );
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleWasteCodeChange = (index, value) => {
    const selectedWasteType = wasteTypes.find(
      (wasteType) => wasteType.id === value
    );

    if (selectedWasteType) {
      const updatedWastes = formData.quotationWastes.map((waste, i) =>
        i === index
          ? { ...waste, wasteId: value, wasteName: selectedWasteType.wasteName }
          : waste
      );
      handleInputChange({
        target: { name: "quotationWastes", value: updatedWastes },
      });
    } else {
      console.warn(`No waste type found for id: ${value}`);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/marketingDashboard/quotations`, formData);
      // Assuming successMessage is handled by the parent component
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      style={{ overflowY: "scroll", scrollbarWidth: "none" }}
    >
      <Box
        p={3}
        bgcolor="background.paper"
        borderRadius={1}
        boxShadow={24}
        minWidth={400}
        margin="auto"
        mt={5}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={handleCloseModal} color="error">
            <CloseIcon style={{ fontSize: "32" }} />
          </IconButton>
        </Box>
        <Typography variant="h6" gutterBottom>
          Quotation Form
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <TextField
                label="Quotation Code"
                name="quotationCode"
                value={formData.quotationCode}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel
                  id="client-select-label"
                  style={{
                    color: colors.grey[100],
                  }}
                >
                  Client
                </InputLabel>
                <Select
                  labelId="client-select-label"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  label="Client"
                  fullWidth
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.clientName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1}>
              <TextField
                label="Validity"
                name="validity"
                value={formData.validity}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                label="Terms Charge"
                name="termsCharge"
                value={formData.termsCharge}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                label="Terms Buying"
                name="termsBuying"
                value={formData.termsBuying}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
            </Grid>
            <Grid item xs={2.5}>
              <TextField
                label="Scope of Work"
                name="scopeOfWork"
                value={formData.scopeOfWork}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
              />
            </Grid>
            <Grid item xs={2.5}>
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
              />
            </Grid>
          </Grid>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ marginTop: "20px" }}
          >
            Quotation Wastes
          </Typography>
          <Box>
            {formData.quotationWastes.map((waste, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Waste Entry #{index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
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
                        name={`quotationWastes[${index}].wasteId`}
                        value={waste.wasteId}
                        onChange={(e) =>
                          handleWasteCodeChange(index, e.target.value)
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
                  <Grid item xs={3}>
                    <TextField
                      label="Waste Name"
                      name={`quotationWastes[${index}].wasteName`}
                      value={waste.wasteName}
                      onChange={(e) =>
                        handleWasteInputChangeLocal(
                          index,
                          "wasteName",
                          e.target.value
                        )
                      }
                      fullWidth
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`mode-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Mode
                      </InputLabel>
                      <Select
                        labelId={`mode-label-${index}`}
                        name={`quotationWastes[${index}].mode`}
                        value={waste.mode}
                        onChange={(e) =>
                          handleWasteInputChangeLocal(
                            index,
                            "mode",
                            e.target.value
                          )
                        }
                        fullWidth
                        inputProps={{
                          name: `quotationWastes[${index}].mode`,
                          id: `mode-select-${index}`,
                        }}
                      >
                        {modeOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`unit-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Unit
                      </InputLabel>
                      <Select
                        labelId={`unit-label-${index}`}
                        name={`quotationWastes[${index}].unit`}
                        value={waste.unit}
                        onChange={(e) =>
                          handleWasteInputChangeLocal(
                            index,
                            "unit",
                            e.target.value
                          )
                        }
                        fullWidth
                        inputProps={{
                          name: `quotationWastes[${index}].unit`,
                          id: `unit-select-${index}`,
                        }}
                      >
                        {unitOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      label="Unit Price"
                      name={`quotationWastes[${index}].unitPrice`}
                      value={waste.unitPrice}
                      onChange={(e) =>
                        handleWasteInputChangeLocal(
                          index,
                          "unitPrice",
                          e.target.value
                        )
                      }
                      fullWidth
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`vat-calculation-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        VAT Calculation
                      </InputLabel>
                      <Select
                        labelId={`vat-calculation-label-${index}`}
                        name={`quotationWastes[${index}].vatCalculation`}
                        value={waste.vatCalculation}
                        onChange={(e) =>
                          handleWasteInputChangeLocal(
                            index,
                            "vatCalculation",
                            e.target.value
                          )
                        }
                        fullWidth
                        inputProps={{
                          name: `quotationWastes[${index}].vatCalculation`,
                          id: `vat-calculation-select-${index}`,
                        }}
                      >
                        {vatCalculationOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      label="Max Capacity"
                      name={`quotationWastes[${index}].maxCapacity`}
                      value={waste.maxCapacity}
                      onChange={(e) =>
                        handleWasteInputChangeLocal(
                          index,
                          "maxCapacity",
                          e.target.value
                        )
                      }
                      fullWidth
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
                      onClick={() => handleRemoveWaste(index)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton color="success" onClick={handleAddWaste}>
              <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
        {successMessage && (
          <Typography
            variant="body2"
            color="success"
            sx={{ marginTop: "10px", textAlign: "center" }}
          >
            {successMessage}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default QuotationFormModal;
