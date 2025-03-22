import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const TreatModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleFormSubmit,
  errorMessage,
  setErrorMessage,
  showErrorMessage,
  setShowErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [treatmentProcesses, setTreatmentProcesses] = useState([]);
  const [treatmentMachines, setTreatmentMachines] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalTreatedWeight, setTotalTreatedWeight] = useState(0);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const [treatmentProcessesResponse, treatmentMachinesResponse] =
            await Promise.all([
              axios.get(`${apiUrl}/api/treatmentProcess`),
              axios.get(`${apiUrl}/api/treatmentMachine`),
            ]);

          setTreatmentProcesses(
            treatmentProcessesResponse.data.treatmentProcesses
          );
          setTreatmentMachines(
            treatmentMachinesResponse.data.treatmentMachines
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
    if (!open) {
      setErrorMessage("");
      setShowErrorMessage(false);
    }
  }, [open, setErrorMessage, setShowErrorMessage]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          setTotalWeight(
            formData.waste.reduce((acc, w) => acc + (w.weight || 0), 0)
          );

          setTotalTreatedWeight(
            formData.waste.reduce(
              (acc, w) =>
                acc +
                (w.treatedWeight || 0) +
                calculateTotalWeight(w.treatedWastes || []),
              0
            )
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [open, formData.waste, formData.waste.treatedWeight]);

  const formatWeight = (weight) => {
    // Check if weight is NaN
    if (isNaN(weight)) {
      return ""; // Return empty string if weight is NaN
    }

    // Format the number if it's a valid number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 20,
    }).format(weight);
  };

  // Function to calculate the total weight
  const calculateTotalWeight = (treatedWastes = []) => {
    return treatedWastes.reduce(
      (total, waste) =>
        total +
        (isNaN(parseFloat(waste.weight)) ? 0 : parseFloat(waste.weight)),
      0
    );
  };

  const handleInputChange = (e, i, index, name) => {
    const { value } = e.target;

    setFormData((prevFormData) => {
      const updatedWaste = [...prevFormData.waste]; // Copy waste array
      updatedWaste[i] = {
        ...updatedWaste[i],
        treatedWastes: updatedWaste[i].treatedWastes.map((w, idx) =>
          idx === index ? { ...w, [name]: value } : w
        ),
      };

      return {
        ...prevFormData,
        waste: updatedWaste, // Update the waste array
      };
    });
  };

  const handleTreatmentProcessChange = (i, index, value) => {
    // Filter the treatment machines based on the selected treatment process
    const filteredMachines = treatmentMachines.filter(
      (machine) => machine.TreatmentProcess.id === value
    );

    setFormData((prevFormData) => {
      const updatedWaste = [...prevFormData.waste]; // Copy waste array
      updatedWaste[i] = {
        ...updatedWaste[i],
        treatedWastes: updatedWaste[i].treatedWastes.map((w, idx) =>
          idx === index
            ? { ...w, treatmentProcessId: value, filteredMachines }
            : w
        ),
      };

      return {
        ...prevFormData,
        waste: updatedWaste, // Update the waste array
      };
    });
  };

  const handleTreatmentMachineChange = (i, index, value) => {
    setFormData((prevFormData) => {
      const updatedWaste = [...prevFormData.waste]; // Copy waste array
      updatedWaste[i] = {
        ...updatedWaste[i],
        treatedWastes: updatedWaste[i].treatedWastes.map((w, idx) =>
          idx === index ? { ...w, treatmentMachineId: value } : w
        ),
      };

      return {
        ...prevFormData,
        waste: updatedWaste, // Update the waste array
      };
    });
  };

  const handleWeightChange = (i, index, field, value) => {
    setFormData((prevFormData) => {
      const updatedWaste = [...prevFormData.waste];

      if (!updatedWaste[i] || !updatedWaste[i].treatedWastes) {
        return prevFormData; // Ensure waste and treatedWastes exist before modifying
      }

      const updatedTreatedWastes = [...updatedWaste[i].treatedWastes];

      // Parse weight safely
      const currentWeight = parseFloat(updatedTreatedWastes[index][field]) || 0;
      const newValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

      // Update the weight of the specified treated waste
      updatedTreatedWastes[index][field] = value;

      // Recalculate the total treated weight for this waste
      updatedWaste[i].treatedWastes = updatedTreatedWastes;

      // Recalculate total treated weight across all wastes
      const newTotalTreatedWeight = updatedWaste.reduce(
        (total, w) => total + calculateTotalWeight(w.treatedWastes || []),
        0
      );

      // Update state
      setTotalTreatedWeight(newTotalTreatedWeight);

      return {
        ...prevFormData,
        waste: updatedWaste,
      };
    });
  };

  const addWasteField = (index) => {
    const newWasteField = {
      treatedDate: null,
      treatedTime: null,
      treatmentProcessId: "",
      treatmentMachineId: "",
      weight: 0,
    };

    const updatedWaste = [...formData.waste]; // Clone waste array
    if (!updatedWaste[index].treatedWastes) {
      updatedWaste[index].treatedWastes = []; // Ensure treatedWastes exists
    }
    updatedWaste[index].treatedWastes.push(newWasteField);

    setFormData({
      ...formData,
      waste: updatedWaste,
    });

    // Recalculate the total weight
    setTotalTreatedWeight(calculateTotalWeight(updatedWaste));
  };

  const removeWasteField = (idx, index) => {
    const updatedWaste = [...formData.waste]; // Clone waste array
    updatedWaste[idx].treatedWastes = updatedWaste[idx].treatedWastes.filter(
      (_, i) => i !== index
    );

    setFormData({
      ...formData,
      waste: updatedWaste, // Update the waste array properly
    });

    // Recalculate the total weight
    setTotalTreatedWeight(
      calculateTotalWeight(updatedWaste.flatMap((w) => w.treatedWastes || []))
    );
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
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Treated Transaction" : "Treatment Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        {!formData.isWaste && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <Typography variant="h5">TOTAL</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor:
                      totalTreatedWeight === totalWeight
                        ? colors.greenAccent[700]
                        : "red",
                    color: "white",
                  }}
                >
                  <Typography variant="h6">
                    {formatWeight(totalTreatedWeight)} Kg Treated /
                    {formatWeight(totalWeight)} Kg
                  </Typography>
                </Box>
              </Box>
            </Box>
            <hr />
          </Box>
        )}

        {formData.waste.map((item, i) => (
          <Box key={i}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <Typography variant="h5">
                {formData.waste ? formData.waste[i].wasteName : ""}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor:
                      formData.waste[i].treatedWastes.reduce(
                        (total, waste) =>
                          total + (parseFloat(waste.weight) || 0),
                        0
                      ) === formData.waste[i].weight
                        ? colors.greenAccent[700]
                        : "red",
                    color: "white",
                  }}
                >
                  <Typography variant="h6">
                    {formatWeight(
                      formData.waste[i].treatedWastes.reduce(
                        (total, waste) =>
                          total + (parseFloat(waste.weight) || 0),
                        0
                      )
                    )}{" "}
                    Kg Treated /{formatWeight(formData.waste[i].weight)} Kg
                  </Typography>
                </Box>
              </Box>
            </Box>
            {item.treatedWastes.map((waste, index) => (
              <Box key={index}>
                <Typography variant="subtitle2" gutterBottom>
                  Waste Entry #{index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`treatmentProcess-type-select-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Treatment Process
                      </InputLabel>
                      <Select
                        labelId={`treatmentProcess-type-select-label-${index}`}
                        name={`treatedWastes[${index}].treatmentProcessId`}
                        value={waste.treatmentProcessId}
                        onChange={(e) =>
                          handleTreatmentProcessChange(i, index, e.target.value)
                        }
                        label="treatmentProcess"
                        fullWidth
                        required
                      >
                        {treatmentProcesses.map((process) => (
                          <MenuItem key={process.id} value={process.id}>
                            {process.treatmentProcess}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`treatmentMachine-type-select-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Treatment Machine
                      </InputLabel>
                      <Select
                        labelId={`treatmentMachine-type-select-label-${index}`}
                        name={`treatedWastes[${index}].treatmentMachineId`}
                        value={waste.treatmentMachineId}
                        onChange={(e) =>
                          handleTreatmentMachineChange(i, index, e.target.value)
                        }
                        label="treatmentMachine"
                        fullWidth
                        required
                      >
                        {waste.filteredMachines &&
                          waste.filteredMachines.map((machine) => (
                            <MenuItem key={machine.id} value={machine.id}>
                              {machine.machineName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1.5}>
                    <TextField
                      label="Weight"
                      name={`treatedWastes[${index}].weight`}
                      value={waste.weight}
                      onChange={(e) =>
                        handleWeightChange(i, index, "weight", e.target.value)
                      }
                      type="number"
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
                  <Grid item xs={2}>
                    <TextField
                      label="Treated Date"
                      name={`treatedWastes[${index}].treatedDate`}
                      value={waste.treatedDate}
                      onChange={(e) =>
                        handleInputChange(e, i, index, "treatedDate")
                      }
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
                  </Grid>
                  <Grid item xs={1.5}>
                    <TextField
                      label="Treated Time"
                      name={`treatedWastes[${index}].treatedTime`}
                      value={waste.treatedTime}
                      onChange={(e) =>
                        handleInputChange(e, i, index, "treatedTime")
                      }
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
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeWasteField(i, index)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {formData.waste[i].treatedWastes.reduce(
              (total, waste) => total + (parseFloat(waste.weight) || 0),
              0
            ) < formData.waste[i].weight && (
              <Box display="flex" justifyContent="center" mt={2}>
                <IconButton color="success" onClick={() => addWasteField(i)}>
                  <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Box>
            )}
            <hr />
          </Box>
        ))}
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
          {formData.id ? "Update" : "Treat"}
        </Button>
      </Box>
    </Modal>
  );
};

export default TreatModal;
