import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Grid,
  Select,
  Autocomplete,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const EmployeeRecordModal = ({
  openModal,
  handleCloseModal,
  handleInputChange,
  formData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const provincesList = [
    "Abra",
    "Agusan del Norte",
    "Agusan del Sur",
    "Aklan",
    "Albay",
    "Antique",
    "Apayao",
    "Aurora",
    "Basilan",
    "Bataan",
    "Batanes",
    "Batangas",
    "Benguet",
    "Biliran",
    "Bohol",
    "Bukidnon",
    "Bulacan",
    "Cagayan",
    "Camarines Norte",
    "Camarines Sur",
    "Camiguin",
    "Capiz",
    "Catanduanes",
    "Cavite",
    "Cebu",
    "Cotabato",
    "Davao de Oro",
    "Davao del Norte",
    "Davao del Sur",
    "Davao Occidental",
    "Davao Oriental",
    "Dinagat Islands",
    "Eastern Samar",
    "Guimaras",
    "Ifugao",
    "Ilocos Norte",
    "Ilocos Sur",
    "Iloilo",
    "Isabela",
    "Kalinga",
    "Kamisar",
    "La Union",
    "Laguna",
    "Lanao del Norte",
    "Lanao del Sur",
    "Leyte",
    "Maguindanao",
    "Marinduque",
    "Masbate",
    "Metro Manila",
    "Misamis Occidental",
    "Misamis Oriental",
    "Mountain Province",
    "Negros Occidental",
    "Negros Oriental",
    "Northern Samar",
    "Nueva Ecija",
    "Nueva Vizcaya",
    "Occidental Mindoro",
    "Oriental Mindoro",
    "Palawan",
    "Pampanga",
    "Pangasinan",
    "Quezon",
    "Quirino",
    "Rizal",
    "Romblon",
    "Samar",
    "Sarangani",
    "Siquijor",
    "Sorsogon",
    "Southern Leyte",
    "Sultan Kudarat",
    "Sulu",
    "Surigao del Norte",
    "Surigao del Sur",
    "Tarlac",
    "Tawi-Tawi",
    "Zambales",
    "Zamboanga del Norte",
    "Zamboanga del Sur",
    "Zamboanga Sibugay",
  ];

  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(API_KEY);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(formData.gender);
  const [civilStatus, setCivilStatus] = useState(formData.civilStatus);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinces, setProvinces] = useState(provincesList);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const fetchOptions = useCallback(
    async (input, level, setState, additionalParams = {}) => {
      try {
        const queryParams = new URLSearchParams({
          input,
          level,
          ...additionalParams,
        });
        const response = await axios.get(
          `${apiUrl}/api/autocomplete?${queryParams}`
        );

        if (response.data && response.data.predictions) {
          const formattedOptions = response.data.predictions.map(
            (prediction) => ({
              label: prediction.structured_formatting.main_text,
              place_id: prediction.place_id,
            })
          );
          console.log(formattedOptions);
          setState(formattedOptions);
        }
      } catch (error) {
        console.error(`Error fetching ${level} options:`, error);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    // Fetch initial provinces in the Philippines
    const fetchProvinces = async () => {
      await fetchOptions(
        "Philippines",
        "administrative_area_level_1",
        setProvinces
      );
    };
    fetchProvinces();
  }, [fetchOptions]);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedProvince) {
        await fetchOptions("", "locality", setCities, {
          province_id: selectedProvince.place_id,
        });
        setSelectedCity(null);
        setBarangays([]);
      }
    };
    fetchCities();
  }, [selectedProvince, fetchOptions]);

  useEffect(() => {
    const fetchBarangays = async () => {
      if (selectedCity) {
        await fetchOptions("", "sublocality_level_1", setBarangays, {
          city_id: selectedCity.place_id,
        });
      }
    };
    fetchBarangays();
  }, [selectedCity, fetchOptions]);

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
    handleInputChange(event);
  };

  const handleCivilStatusChange = (event) => {
    const selectedCivilStatus = event.target.value;
    setCivilStatus(selectedCivilStatus);
    handleInputChange(event);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = [
    "Personal Information",
    "Additional Details",
    "Review & Submit",
  ];

  const StepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={3}>
                <TextField
                  label="Employee Id"
                  name="employeeId"
                  value={formData.employeeId}
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
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="gender-select-label"
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="gender-select-label"
                    name="gender"
                    value={gender}
                    onChange={handleGenderChange}
                    label="Gender"
                    fullWidth
                    required
                    disabled={!!formData.id}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="civilStatus-select-label"
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Civil Status
                  </InputLabel>
                  <Select
                    labelId="civilStatus-select-label"
                    name="civilStatus"
                    value={civilStatus}
                    onChange={handleCivilStatusChange}
                    label="civilStatus"
                    fullWidth
                    required
                  >
                    <MenuItem value={"Single"}>Single</MenuItem>
                    <MenuItem value={"Married"}>Married</MenuItem>
                    <MenuItem value={gender === "Male" ? "Widower" : "Widow"}>
                      {gender === "Male" ? "Widower" : "Widow"}
                    </MenuItem>
                    <MenuItem value={"Live-in"}>Live-in</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={3}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
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
              <Grid item xs={3}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
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
              <Grid item xs={3}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
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
              {gender === "Female" &&
                (civilStatus === "Married" || civilStatus === "Widow") && (
                  <Grid item xs={3}>
                    <TextField
                      label="Spouse Surname"
                      name="spouseSurname"
                      value={formData.spouseSurname}
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
                )}
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={3}>
                <TextField
                  label="Birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  type="date"
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
              <Grid item xs={6}>
                <TextField
                  label="Place of Birth"
                  name="birthPlace"
                  value={formData.birthPlace}
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
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="bloodType-select-label"
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Blood Type
                  </InputLabel>
                  <Select
                    labelId="bloodType-select-label"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    label="bloodType"
                    fullWidth
                  >
                    <MenuItem value={"A+"}>A+</MenuItem>
                    <MenuItem value={"A-"}>A-</MenuItem>
                    <MenuItem value={"B+"}>B+</MenuItem>
                    <MenuItem value={"B-"}>B-</MenuItem>
                    <MenuItem value={"AB+"}>AB+</MenuItem>
                    <MenuItem value={"AB-"}>AB-</MenuItem>
                    <MenuItem value={"O+"}>O+</MenuItem>
                    <MenuItem value={"O-"}>O-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={4}>
                <Autocomplete
                  options={provincesList}
                  value={selectedProvince}
                  onChange={(event, newValue) => {
                    setSelectedProvince(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      fullWidth
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
              <Grid item xs={4}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.label}
                  value={selectedCity}
                  onChange={(event, newValue) => {
                    setSelectedCity(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      fullWidth
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                      autoComplete="off"
                    />
                  )}
                  disabled={!selectedProvince}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  options={barangays}
                  getOptionLabel={(option) => option.label}
                  value={formData.barangay}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: { name: "barangay", value: newValue },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Barangay"
                      fullWidth
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                      autoComplete="off"
                    />
                  )}
                  disabled={!selectedCity}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography>Review & Submit</Typography>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            height: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Employee Record" : "Add Employee Record"}
          </Typography>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <StepContent />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                currentStep === steps.length - 1 ? handleFormSubmit : handleNext
              }
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeeRecordModal;
