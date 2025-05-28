import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const SortModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  setIsDiscrepancy,
  isDiscrepancy,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [quotations, setQuotations] = useState([]);
  const [scrapTypes, setScrapTypes] = useState([]);
  const [treatmentProcesses, setTreatmentProcesses] = useState([]);
  const [transporterClients, setTransporterClients] = useState([]);
  const unitOptions = [
    "PC",
    "KG",
    "L",
    "DRUM",
    "LOT",
    "CASE",
    "PALLET",
    "CUBIC METER",
    "TRIP",
  ];

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const [
            quotationsResponse,
            scrapTypesResponse,
            treatmentProcesses,
            transporterClientResponse,
          ] = await Promise.all([
            axios.get(`${apiUrl}/api/quotation/${formData.clientId}`),
            axios.get(`${apiUrl}/api/scrapType`),
            axios.get(`${apiUrl}/api/treatmentProcess`),
            axios.get(`${apiUrl}/api/transporterClient/${formData.clientId}`),
          ]);

          setQuotations(quotationsResponse.data.quotations);
          setScrapTypes(scrapTypesResponse.data.scrapTypes);
          setTreatmentProcesses(treatmentProcesses.data.treatmentProcesses);
          setTransporterClients(
            transporterClientResponse.data.transporterClients
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [open, formData.clientId]);

  useEffect(() => {
    const totalSortedWeight = calculateTotalSortedWeight(
      formData.sortedWastes,
      formData.sortedScraps
    );
    const discrepancyWeight = calculateDiscrepancyWeight(
      parseFloat(formData.batchWeight || 0),
      totalSortedWeight
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalSortedWeight,
      discrepancyWeight,
    }));
    if (discrepancyWeight === 0) {
      setIsDiscrepancy(false);
    } else {
      setIsDiscrepancy(true);
    }
  }, [
    formData.sortedWastes,
    formData.sortedScraps,
    formData.batchWeight,
    setFormData,
    setIsDiscrepancy,
  ]);

  const calculateTotalSortedWeight = (sortedWastes, sortedScraps) => {
    const totalSortedWasteWeight = sortedWastes.reduce((total, waste) => {
      return total + parseFloat(waste.weight || 0);
    }, 0);

    const totalSortedScrapWeight = sortedScraps.reduce((total, scrap) => {
      return total + parseFloat(scrap.weight || 0);
    }, 0);

    return totalSortedWasteWeight + totalSortedScrapWeight;
  };

  const calculateDiscrepancyWeight = (batchWeight, totalSortedWeight) => {
    return batchWeight - totalSortedWeight;
  };

  const handleWasteChange = useCallback(
    (index, field, value) => {
      const updatedSortedWastes = formData.sortedWastes.map((waste, i) =>
        i === index ? { ...waste, [field]: value } : waste
      );
      setFormData({
        ...formData,
        sortedWastes: updatedSortedWastes,
      });
    },
    [formData, setFormData]
  );

  const handleWasteCodeChange = useCallback(
    (index, value) => {
      let selectedWasteType = null;

      for (let quotation of quotations) {
        selectedWasteType = quotation.QuotationWaste.find(
          (waste) => waste.id === value
        );
        if (selectedWasteType) break;
      }

      if (selectedWasteType) {
        const updatedWastes = formData.sortedWastes.map((waste, i) =>
          i === index
            ? {
                ...waste,
                quotationWasteId: value,
                wasteName: selectedWasteType.wasteName,
              }
            : waste
        );
        handleInputChange({
          target: { name: "sortedWastes", value: updatedWastes },
        });
      } else {
        console.warn(`No waste type found for id: ${value}`);
      }
    },
    [quotations, formData, handleInputChange]
  );

  const handleScrapChange = useCallback(
    (index, field, value) => {
      const updatedSortedScraps = formData.sortedScraps.map((scrap, i) =>
        i === index ? { ...scrap, [field]: value } : scrap
      );
      setFormData({
        ...formData,
        sortedScraps: updatedSortedScraps,
      });
    },
    [formData, setFormData]
  );

  const handleScrapTypeChange = useCallback(
    (index, value) => {
      const selectedScrapType = scrapTypes.find((scrap) => scrap.id === value);

      if (selectedScrapType) {
        const updatedScraps = formData.sortedScraps.map((scrap, i) =>
          i === index
            ? {
                ...scrap,
                scrapTypeId: value,
              }
            : scrap
        );
        handleInputChange({
          target: { name: "sortedScraps", value: updatedScraps },
        });
      } else {
        console.warn(`No scrap type found for id: ${value}`);
      }
    },
    [scrapTypes, formData, handleInputChange]
  );

  const addWasteField = () => {
    setFormData({
      ...formData,
      sortedWastes: [
        ...formData.sortedWastes,
        {
          quotationWasteId: "",
          transporterClientId: "",
          treatmentProcessId: "",
          wasteName: "",
          weight: 0,
          clientWeight: 0,
          clientUnit: "",
          formNo: "",
        },
      ],
    });
  };

  const removeWasteField = (index) => {
    const newSortedWastes = formData.sortedWastes.filter((_, i) => i !== index);
    setFormData({ ...formData, sortedWastes: newSortedWastes });
  };

  const addScrapField = () => {
    setFormData({
      ...formData,
      sortedScraps: [
        ...formData.sortedScraps,
        {
          scrapTypeId: "",
          weight: 0,
        },
      ],
    });
  };

  const removeScrapField = (index) => {
    const newSortedScraps = formData.sortedScraps.filter((_, i) => i !== index);
    setFormData({ ...formData, sortedScraps: newSortedScraps });
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
          width: 1400,
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
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Sorted Transaction" : "Sort Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Sort Date"
            name="sortedDate"
            value={formData.sortedDate}
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
            autoComplete="off"
          />
          <TextField
            label="Sort Time"
            name="sortedTime"
            value={formData.sortedTime}
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
            autoComplete="off"
          />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Batch Weight"
              name={`batchWeight`}
              value={formData.batchWeight}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Total Sorted Weight"
              name={`totalSortedWeight`}
              value={formData.totalSortedWeight}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Discrepancy Weight"
              name={`discrepancyWeight`}
              value={formData.discrepancyWeight}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
          Sorted Wastes
        </Typography>
        {formData.sortedWastes.map((waste, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Waste Entry #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={2.5}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`waste-type-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId={`waste-type-select-label-${index}`}
                    name={`sortedWastes[${index}].quotationWasteId`}
                    value={waste.quotationWasteId || ""}
                    onChange={(e) =>
                      handleWasteCodeChange(index, e.target.value)
                    }
                    label="Category"
                    fullWidth
                    required
                    disabled={formData.statusId === 4}
                  >
                    {quotations
                      .flatMap((quotation) =>
                        quotation.QuotationWaste.filter(
                          (waste) =>
                            !["AHW", "ANHW", "AHNHW"].includes(
                              waste.TypeOfWaste.wasteCode
                            ) // Exclude these waste codes
                        )
                      ) // Flatten all filtered wastes from quotations
                      .sort((a, b) => a.wasteName.localeCompare(b.wasteName)) // Sort by wasteName in ascending order
                      .map((waste) => (
                        <MenuItem key={waste.id} value={waste.id}>
                          {waste.wasteName} {"("}
                          {waste.TypeOfWaste.wasteCode}
                          {")"} - {waste.unit} ({waste.Quotation?.quotationCode}
                          )
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Waste Name"
                  name="wasteName"
                  value={waste.wasteName}
                  onChange={(e) =>
                    handleWasteChange(index, "wasteName", e.target.value)
                  }
                  fullWidth
                  required
                  disabled={formData.statusId === 4}
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              </Grid>
              {transporterClients.length > 0 && (
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel
                      id={`transporterClientId-select-label-${index}`}
                      style={{
                        color: colors.grey[100],
                      }}
                    >
                      Transporter's Client
                    </InputLabel>
                    <Select
                      labelId={`transporterClientId-select-label-${index}`}
                      name={`sortedWastes[${index}].transporterClientId`}
                      value={waste.transporterClientId || ""}
                      onChange={(e) =>
                        handleWasteChange(
                          index,
                          "transporterClientId",
                          e.target.value
                        )
                      }
                      label="Transporter's Client"
                      fullWidth
                      required
                      disabled={formData.statusId === 4}
                    >
                      {transporterClients.map((transporterClient) => (
                        <MenuItem
                          key={transporterClient.id}
                          value={transporterClient.id}
                        >
                          {transporterClient.clientName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`treatmentProcessId-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Treatment Process
                  </InputLabel>
                  <Select
                    labelId={`treatmentProcessId-select-label-${index}`}
                    name={`sortedWastes[${index}].treatmentProcessId`}
                    value={waste.treatmentProcessId || ""}
                    onChange={(e) =>
                      handleWasteChange(
                        index,
                        "treatmentProcessId",
                        e.target.value
                      )
                    }
                    label="Treatment Process"
                    fullWidth
                    required
                    disabled={formData.statusId === 4}
                  >
                    {treatmentProcesses.map((treatmentProcess) => (
                      <MenuItem
                        key={treatmentProcess.id}
                        value={treatmentProcess.id}
                      >
                        {treatmentProcess.treatmentProcess}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                <TextField
                  label="Weight (Kg)"
                  name="weight"
                  value={waste.weight}
                  onChange={(e) =>
                    handleWasteChange(index, "weight", e.target.value)
                  }
                  type="number"
                  fullWidth
                  required
                  disabled={formData.statusId === 4}
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  label="Client Weight"
                  name="clientWeight"
                  value={waste.clientWeight}
                  onChange={(e) =>
                    handleWasteChange(index, "clientWeight", e.target.value)
                  }
                  type="number"
                  fullWidth
                  required
                  disabled={formData.statusId === 4}
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={1}>
                <FormControl fullWidth required>
                  <InputLabel
                    id={`unit-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Client Unit
                  </InputLabel>
                  <Select
                    labelId={`unit-label-${index}`}
                    name={`quotationWastes[${index}].unit`}
                    value={waste.clientUnit || ""}
                    onChange={(e) =>
                      handleWasteChange(index, "clientUnit", e.target.value)
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
                  label="Form No"
                  name="formNo"
                  value={waste.formNo}
                  onChange={(e) =>
                    handleWasteChange(index, "formNo", e.target.value)
                  }
                  fullWidth
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={0.5}>
                <IconButton
                  color="error"
                  onClick={() => removeWasteField(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton color="success" onClick={addWasteField}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
          Sorted Scraps
        </Typography>
        {formData.sortedScraps.map((scrap, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Scrap Entry #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`scrap-type-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId={`scrap-type-select-label-${index}`}
                    name={`sortedWastes[${index}].scrapTypeId`}
                    value={scrap.scrapTypeId}
                    onChange={(e) =>
                      handleScrapTypeChange(index, e.target.value)
                    }
                    label="Category"
                    fullWidth
                    required
                    disabled={formData.statusId === 4}
                  >
                    {scrapTypes.map((scrapType) => (
                      <MenuItem key={scrapType.id} value={scrapType.id}>
                        {scrapType.typeOfScrap}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  label="Weight"
                  name="weight"
                  value={scrap.weight}
                  onChange={(e) =>
                    handleScrapChange(index, "weight", e.target.value)
                  }
                  type="number"
                  fullWidth
                  disabled={formData.statusId === 4}
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={1.5}></Grid>
              <Grid item xs={1}>
                <IconButton
                  color="error"
                  onClick={() => removeScrapField(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton color="success" onClick={addScrapField}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        {isDiscrepancy && (
          <TextField
            label="Discrepancy Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            fullWidth
            required={isDiscrepancy}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
        )}
        <TextField
          label="Status Id"
          name="statusId"
          value={formData.statusId}
          onChange={handleInputChange}
          fullWidth
          autoComplete="off"
          style={{ display: "none" }}
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
          {formData.id ? "Update" : "Sort"}
        </Button>
      </Box>
    </Modal>
  );
};

export default SortModal;
