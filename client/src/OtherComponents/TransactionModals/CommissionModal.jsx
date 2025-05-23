import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import CommissionStatement from "../BillingStatement/CommissionStatement";

const CommissionModal = ({
  user,
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const [logistics, setThirdPartyLogistics] = useState([]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const logisticsResponse = await axios.get(`${apiUrl}/api/logistics`);

      setThirdPartyLogistics(logisticsResponse.data.logistics);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          {formData.id
            ? "Update Commissioned Transaction"
            : "Commission Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Date"
            name="commissionedDate"
            value={formData.commissionedDate}
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
            label="Time"
            name="commissionedTime"
            value={formData.commissionedTime}
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
          {formData.id ? "Update" : "Submit"}
        </Button>
        <CommissionStatement
          user={user}
          row={formData.row}
          review={true}
          bookedTransactionIds={formData.bookedTransactionId}
        />
      </Box>
    </Modal>
  );
};

export default CommissionModal;
