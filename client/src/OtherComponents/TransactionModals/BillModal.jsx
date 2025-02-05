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
import BillingStatementForm from "../BillingStatement/BillingStatementForm";

const BillModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  refs,
  isWasteNameToBill,
  setIsWasteNameToBill,
  isPerClientToBill,
  setIsPerClientToBill,
  isIndividualBillingToBill,
  setIsIndividualBillingToBill,
  isIndividualWasteToBill,
  setIsIndividualWasteToBill,
  discount,
  setDiscount,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsWasteNameToBill(isChecked); // Update the individual state
    setFormData({ ...formData, isWasteName: isChecked }); // Update formData state
  };

  const handleCheckboxChange2 = (e) => {
    const isChecked = e.target.checked;
    setIsPerClientToBill(isChecked); // Update the individual state
    setFormData({ ...formData, isPerClient: isChecked }); // Update formData state
  };

  const handleCheckboxChange3 = (e) => {
    const isChecked = e.target.checked;
    setIsIndividualBillingToBill(isChecked); // Update the individual state
    setFormData({ ...formData, isIndividualBilling: isChecked }); // Update formData state
  };

  const handleCheckboxChange4 = (e) => {
    const isChecked = e.target.checked;
    setIsIndividualWasteToBill(isChecked); // Update the individual state
    setFormData({ ...formData, isIndividualWaste: isChecked }); // Update formData state
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
            {formData.id ? "Update Billed Transaction" : "Billing Transaction"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isWasteName}
                  onChange={handleCheckboxChange}
                  color="secondary"
                />
              }
              label="By Waste Name"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isIndividualWaste}
                  onChange={handleCheckboxChange4}
                  color="secondary"
                />
              }
              label="By Individual Waste"
            />
            {formData.clientType === "TRP" && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPerClient}
                      onChange={handleCheckboxChange2}
                      color="secondary"
                    />
                  }
                  label="By Transporter's Client"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isIndividualBilling}
                      onChange={handleCheckboxChange3}
                      color="secondary"
                    />
                  }
                  label="By Individual Billing"
                />
              </>
            )}
          </Box>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Billed Date"
              inputRef={refs.billedDateRef}
              defaultValue={formData.billedDate}
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
              label="Billed Time"
              inputRef={refs.billedTimeRef}
              defaultValue={formData.billedTime}
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
            <TextField
              label="Billing Number"
              inputRef={refs.billingNumberRef}
              defaultValue={formData.billingNumber}
              fullWidth
              type="text"
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
              label="Service Invoice Number"
              inputRef={refs.serviceInvoiceNumberRef}
              defaultValue={formData.serviceInvoiceNumber}
              fullWidth
              type="text"
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
              label="Discount"
              name="discountAmount"
              value={discount}
              onChange={setDiscount}
              fullWidth
              type="text"
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
          <TextField
            label="Remarks"
            inputRef={refs.remarksRef}
            defaultValue={formData.remarks}
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
            {formData.id ? "Update" : "Bill"}
          </Button>

          <BillingStatementForm
            row={formData.row}
            review={true}
            bookedTransactionIds={formData.bookedTransactionId}
            isWasteNameToBill={isWasteNameToBill}
            isPerClientToBill={isPerClientToBill}
            isIndividualBillingToBill={isIndividualBillingToBill}
            isIndividualWasteToBill={isIndividualWasteToBill}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default BillModal;
