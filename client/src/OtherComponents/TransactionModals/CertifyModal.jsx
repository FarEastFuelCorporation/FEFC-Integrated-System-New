import React from "react";
import {
  Box,
  Modal,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { tokens } from "../../theme";
// import CertificateOfDestruction from "../../OtherComponents/Certificates/CertificateOfDestruction";

const CertifyModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setFormData({ ...formData, isDestruction: isChecked }); // Update formData state
  };

  const handleCheckboxChange2 = (e) => {
    const isChecked = e.target.checked;
    setFormData({ ...formData, isDisposal: isChecked }); // Update formData state
  };

  const handleCheckboxChange3 = (e) => {
    const isChecked = e.target.checked;
    setFormData({ ...formData, isAcceptance: isChecked }); // Update formData state
  };

  const handleCheckboxChange4 = (e) => {
    const isChecked = e.target.checked;
    setFormData({ ...formData, isServiceReport: isChecked }); // Update formData state
  };

  return (
    <Box>
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
            {formData.id
              ? "Update Certified Transaction"
              : "Certify Transaction"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDestruction}
                  onChange={handleCheckboxChange}
                  color="secondary"
                />
              }
              label="Certificate of Destruction"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDisposal}
                  onChange={handleCheckboxChange2}
                  color="secondary"
                />
              }
              label="Certificate of Disposal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAcceptance}
                  onChange={handleCheckboxChange3}
                  color="secondary"
                />
              }
              label="Certificate of Acceptance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isServiceReport}
                  onChange={handleCheckboxChange4}
                  color="secondary"
                />
              }
              label="Service Report"
            />
          </Box>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Certified Date"
              name="certifiedDate"
              value={formData.certifiedDate}
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
              label="Certified Time"
              name="certifiedTime"
              value={formData.certifiedTime}
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
            <Grid item xs={12} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel
                  id="typeOfWeight-select-label"
                  style={{ color: colors.grey[100] }}
                  required
                >
                  Type of Weight
                </InputLabel>
                <Select
                  labelId="typeOfWeight-select-label"
                  name="typeOfWeight"
                  value={formData.typeOfWeight}
                  onChange={handleInputChange}
                  label="typeOfCertificate"
                  fullWidth
                >
                  <MenuItem value={"CLIENT WEIGHT"}>CLIENT WEIGHT</MenuItem>
                  <MenuItem value={"SORTED WEIGHT"}>SORTED WEIGHT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Certify"}
          </Button>
        </Box>
      </Modal>
      {/* <CertificateOfDestruction /> */}
    </Box>
  );
};

export default CertifyModal;
