import React from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { tokens } from "../../theme";
// import CertificateOfDestruction from "../../OtherComponents/Certificates/CertificateOfDestruction";

const CollectionModal = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  setIsWasteNameToBill,
  setFormData,
  refs,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setFormData({ ...formData, withTax: isChecked }); // Update formData state
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
              ? "Update Collected Transaction"
              : "Collected Transaction"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isWasteName}
                onChange={handleCheckboxChange}
                color="secondary"
              />
            }
            label="Amount Withheld"
          />
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Collected Date"
              inputRef={refs.collectedDateRef}
              defaultValue={formData.collectedDate}
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
              label="Collected Time"
              inputRef={refs.collectedTimeRef}
              defaultValue={formData.collectedTime}
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
            {!formData.withTax && (
              <TextField
                label="Collected Amount"
                value={formData.collectedAmount}
                name="collectedAmount"
                fullWidth
                type="number"
                required
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                onChange={handleInputChange}
                autoComplete="off"
              />
            )}
          </div>
          {formData.withTax && (
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <TextField
                label="Billed Amount"
                name="billedAmount"
                fullWidth
                type="number"
                required
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <TextField
                label="Withholding Tax"
                value={formData.withHoldingTax}
                name="withHoldingTax"
                fullWidth
                type="number"
                required
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <TextField
                label="Collected Amount"
                value={formData.collectedAmount}
                name="collectedAmount"
                fullWidth
                type="number"
                required
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          )}
          <TextField
            label="Remarks"
            inputRef={refs.remarksRef}
            defaultValue={formData.remarksRef}
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
            fullWidth
            autoComplete="off"
            style={{ display: "none" }}
          />
          <TextField
            label="Created By"
            name="createdBy"
            value={formData.createdBy}
            fullWidth
            autoComplete="off"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Collect"}
          </Button>
        </Box>
      </Modal>
      {/* <CertificateOfDestruction /> */}
    </Box>
  );
};

export default CollectionModal;
