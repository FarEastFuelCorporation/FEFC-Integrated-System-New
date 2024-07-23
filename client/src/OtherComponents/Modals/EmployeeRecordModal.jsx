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
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [otherCities, setOtherCities] = useState([]);
  const [otherBarangays, setOtherBarangays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/geoTable/province`);
        console.log(response.data.provinces);
        setProvinces(response.data.provinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  const fetchCities = async (province) => {
    if (province) {
      try {
        const response = await axios.get(`${apiUrl}/geoTable/city/${province}`);
        console.log(response.data.cities);
        setCities(response.data.cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setCities([]);
      setBarangays([]);
    }
    formData.municipality = null;
    formData.barangay = null;
  };

  const fetchBarangays = async (municipality) => {
    if (municipality) {
      try {
        const response = await axios.get(
          `${apiUrl}/geoTable/barangay/${municipality}`
        );
        console.log(response.data.barangays);
        setBarangays(response.data.barangays);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setBarangays([]);
    }
    formData.barangay = null;
  };

  const fetchOtherCities = async (province) => {
    if (province) {
      try {
        const response = await axios.get(`${apiUrl}/geoTable/city/${province}`);
        console.log(response.data.cities);
        setOtherCities(response.data.cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setOtherCities([]);
      setBarangays([]);
    }
    formData.otherMunicipality = null;
    formData.otherBarangay = null;
  };

  const fetchOtherBarangays = async (municipality) => {
    if (municipality) {
      try {
        const response = await axios.get(
          `${apiUrl}/geoTable/barangay/${municipality}`
        );
        console.log(response.data.barangays);
        setOtherBarangays(response.data.barangays);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setOtherBarangays([]);
    }
    formData.otherBarangay = null;
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
    "Employment Details",
    "Family Background",
    "Review & Submit",
  ];

  const StepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="Employee Id"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="gender-select-label"
                    style={{ color: colors.grey[100] }}
                    required
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
                    disabled={!!formData.id}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="civilStatus-select-label"
                    style={{ color: colors.grey[100] }}
                    required
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
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              {gender === "Female" &&
              (civilStatus === "Married" || civilStatus === "Widow") ? (
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    label="Husband's Surname"
                    name="husbandSurname"
                    value={formData.husbandSurname}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{
                      style: { color: colors.grey[100] },
                    }}
                    autoComplete="off"
                  />
                </Grid>
              ) : (
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    label="Affix"
                    name="affix"
                    value={formData.affix}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{
                      style: { color: colors.grey[100] },
                    }}
                    autoComplete="off"
                  />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={3}>
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
                    style: { color: colors.grey[100] },
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
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="bloodType-select-label"
                    style={{ color: colors.grey[100] }}
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
                    <MenuItem value={"UNKNOWN"}>Unknown</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
              Present Address
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  id="province-select"
                  options={provinces}
                  value={formData.province}
                  onChange={(event, newValue) => {
                    fetchCities(newValue);
                    handleInputChange({
                      target: { name: "province", value: newValue },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  id="city-select"
                  options={cities}
                  value={formData.municipality}
                  onChange={(event, newValue) => {
                    fetchBarangays(newValue);
                    handleInputChange({
                      target: { name: "municipality", value: newValue },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City/Municipality"
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      fullWidth
                      required
                    />
                  )}
                  disabled={!formData.province}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  id="barangay-select"
                  options={barangays}
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
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      fullWidth
                      required
                    />
                  )}
                  disabled={!formData.municipality}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="House No./Street Name/"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
              Other Address
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  id="province-select"
                  options={provinces}
                  value={formData.otherProvince}
                  onChange={(event, newValue) => {
                    fetchOtherCities(newValue);
                    handleInputChange({
                      target: {
                        name: "otherProvince",
                        value: newValue,
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  id="city-select"
                  options={otherCities}
                  value={formData.otherMunicipality}
                  onChange={(event, newValue) => {
                    fetchOtherBarangays(newValue);
                    handleInputChange({
                      target: { name: "otherMunicipality", value: newValue },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City/Municipality"
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      fullWidth
                      required
                    />
                  )}
                  disabled={!formData.otherProvince}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  id="barangay-select"
                  options={otherBarangays}
                  value={formData.otherBarangay}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: "otherBarangay",
                        value: newValue,
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Barangay"
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      fullWidth
                      required
                    />
                  )}
                  disabled={!formData.otherMunicipality}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="House No./Street Name/"
                  name="otherAddress"
                  value={formData.otherAddress}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  label="Landline Number"
                  name="landlineNumber"
                  value={formData.landlineNumber}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  label="Email Address"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            {" "}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  label="Employee Id"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: colors.grey[100] },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="gender-select-label"
                    style={{ color: colors.grey[100] }}
                    required
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
                    disabled={!!formData.id}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id="civilStatus-select-label"
                    style={{ color: colors.grey[100] }}
                    required
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
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your information before submitting:
            </Typography>
            {/* Display form data for review */}
            <Typography variant="body1">
              <strong>Employee Id:</strong> {formData.employeeId}
            </Typography>
            <Typography variant="body1">
              <strong>First Name:</strong> {formData.firstName}
            </Typography>
            <Typography variant="body1">
              <strong>Middle Name:</strong> {formData.middleName}
            </Typography>
            <Typography variant="body1">
              <strong>Last Name:</strong> {formData.lastName}
            </Typography>
            {gender === "Female" &&
              (civilStatus === "Married" || civilStatus === "Widow") && (
                <Typography variant="body1">
                  <strong>Spouse Surname:</strong> {formData.spouseSurname}
                </Typography>
              )}
            <Typography variant="body1">
              <strong>Gender:</strong> {gender}
            </Typography>
            <Typography variant="body1">
              <strong>Civil Status:</strong> {civilStatus}
            </Typography>
            <Typography variant="body1">
              <strong>Birthday:</strong> {formData.birthday}
            </Typography>
            <Typography variant="body1">
              <strong>Place of Birth:</strong> {formData.birthPlace}
            </Typography>
            <Typography variant="body1">
              <strong>Blood Type:</strong> {formData.bloodType}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {formData.address}
            </Typography>
            <Typography variant="body1">
              <strong>Province:</strong> {formData.province?.province}
            </Typography>
            <Typography variant="body1">
              <strong>City:</strong> {formData.municipality?.city}
            </Typography>
            <Typography variant="body1">
              <strong>Barangay:</strong> {formData.barangay}
            </Typography>
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
            top: "10%",
            left: "50%",
            transform: "translate(-50%)",
            width: "75vw",
            minHeight: 500,
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
