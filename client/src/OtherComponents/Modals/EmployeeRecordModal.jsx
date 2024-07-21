import { useState, useEffect } from "react";
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

const EmployeeRecordModal = ({
  openModal,
  handleCloseModal,
  handleInputChange,
  formData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(formData.gender);
  const [civilStatus, setCivilStatus] = useState(formData.civilStatus);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBaranggays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/geoTable/province`);

        console.log(response.data.provinces);
        setProvinces(response.data.provinces);
      } catch (error) {
        console.error("Error fetching province:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/geoTable/city/${selectedProvince}`
          );
          console.log(response.data.cities);
          setCities(response.data.cities);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedProvince, apiUrl]);

  useEffect(() => {
    if (selectedCity) {
      const fetchBaranggays = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/geoTable/baranggays/${selectedCity}`
          );
          console.log(response.data.baranggays);
          setBaranggays(response.data.baranggays);
        } catch (error) {
          console.error("Error fetching baranggays:", error);
        }
      };

      fetchBaranggays();
    } else {
      // Clear barangays if no city is selected
      setBaranggays([]);
    }
  }, [selectedCity, apiUrl]);

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
                  options={provinces}
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
                  value={formData.barangay}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: { name: "baranggay", value: newValue },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Baranggay"
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
            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <TextField
                  label="Street"
                  name="street"
                  value={formData.street}
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
              <Grid item xs={6}>
                <TextField
                  label="Subdivision/Village"
                  name="subdivisionVillage"
                  value={formData.subdivisionVillage}
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
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your details:
            </Typography>
            {/* Add review details here */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
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
