// src/pages/sections/LegalServiceAgreements/LsaModal.jsx

import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import { formatNumber } from "../../../../../OtherComponents/Functions";

const FundTransactionModal = ({
  open,
  onClose,
  formData,
  fundLabels,
  funds,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  setErrorMessage,
  showErrorMessage,
  setShowErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
          width: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Fund Transaction" : "Add New Fund Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>

        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Transaction Date"
              name="transactionDate"
              value={formData.transactionDate}
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
            {formData.transactionNumber && (
              <TextField
                label="Transaction Number"
                name="transactionNumber"
                value={formData.transactionNumber}
                onChange={handleInputChange}
                fullWidth
                required
                disabled
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Choose Fund Source"
              name="fundSource"
              value={formData.fundSource}
              onChange={handleInputChange}
              select
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            >
              <MenuItem key={"CASH IN"} value={"CASH IN"}>
                {"CASH IN"}
              </MenuItem>
              {fundLabels.sort().map((fund) => (
                <MenuItem key={fund.label} value={fund.label}>
                  {fund.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Amount"
              value={formatNumber(
                funds[
                  fundLabels.find((item) => item.label === formData.fundSource)
                    ?.value
                ] || 0
              )}
              onChange={handleInputChange}
              fullWidth
              disabled
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
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Choose Fund Allocation"
              name="fundAllocation"
              value={formData.fundAllocation}
              onChange={handleInputChange}
              select
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            >
              <MenuItem key={"CASH OUT"} value={"CASH OUT"}>
                {"CASH OUT"}
              </MenuItem>
              {fundLabels.sort().map((fund) => (
                <MenuItem key={fund.label} value={fund.label}>
                  {fund.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Amount"
              value={formatNumber(
                funds[
                  fundLabels.find(
                    (item) => item.label === formData.fundAllocation
                  )?.value
                ] || 0
              )}
              onChange={handleInputChange}
              fullWidth
              disabled
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
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              type="number"
              autoComplete="off"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              sx={{
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update" : "Add"}
        </Button>
      </Box>
    </Modal>
  );
};

export default FundTransactionModal;
