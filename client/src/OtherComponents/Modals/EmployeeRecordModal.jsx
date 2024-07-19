import { useState } from "react";
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

// List of provinces in the Philippines
const provinces = [
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

const EmployeeRecordModal = ({
  openModal,
  handleCloseModal,
  handleInputChange,
  formData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(API_KEY);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(formData.gender);
  const [civilStatus, setCivilStatus] = useState(formData.civilStatus);

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Function to fetch autocomplete suggestions from Google Places API
  const fetchOptions = async (input, level, setter) => {
    console.log(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${level}&key=${API_KEY}`
    );
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${level}&key=${API_KEY}`,
        {
          params: {
            input: input,
            types: level,
            key: API_KEY,
          },
        }
      );

      if (response.data && response.data.predictions) {
        const formattedOptions = response.data.predictions.map(
          (prediction) => ({
            label: prediction.description,
            place_id: prediction.place_id,
          })
        );
        setter(formattedOptions);
      }
    } catch (error) {
      console.error(`Error fetching ${level} options:`, error);
    }
  };

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
                    required
                  >
                    <MenuItem value={"A+"}>A+</MenuItem>
                    <MenuItem value={"A-"}>A-</MenuItem>
                    <MenuItem value={"B+"}>B+</MenuItem>
                    <MenuItem value={"B-"}>B-</MenuItem>
                    <MenuItem value={"AB+"}>AB+</MenuItem>
                    <MenuItem value={"AB-"}>AB-</MenuItem>
                    <MenuItem value={"O+"}>O+</MenuItem>
                    <MenuItem value={"O-"}>O-</MenuItem>
                    <MenuItem value={"Unknown"}>Unknown</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={provinces}
                  getOptionLabel={(option) => option.label}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue) {
                      fetchOptions(
                        newInputValue,
                        "administrative_area_level_2",
                        setProvinces
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={cities}
                  getOptionLabel={(option) => option.label}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue) {
                      fetchOptions(
                        newInputValue,
                        "administrative_area_level_3",
                        setCities
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="City" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={barangays}
                  getOptionLabel={(option) => option.label}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue) {
                      fetchOptions(
                        newInputValue,
                        "administrative_area_level_4",
                        setBarangays
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Barangay"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                label="Created By"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                fullWidth
                autoComplete="off"
                style={{ display: "none" }}
              />
            </Grid>
            {/* Additional Details Content Here */}
            <Typography variant="subtitle1">Additional Details</Typography>
            {/* Add fields or details for this step */}
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="subtitle1">
              Review your information and submit
            </Typography>
            {/* Display a summary of the information */}
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
