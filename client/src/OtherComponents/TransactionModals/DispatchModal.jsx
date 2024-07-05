import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";

const DispatchModal = ({
  user,
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [quotationsData, setQuotationsData] = useState([]);
  const processDataQuotations = (response) => {
    const transactions = response.data;

    if (transactions && Array.isArray(transactions.quotations)) {
      const flattenedData = transactions.quotations.map((item) => ({
        ...item,
        wasteNames: item.QuotationWaste
          ? item.QuotationWaste.map((qw) =>
              qw.wasteName ? qw.wasteName : null
            )
          : [],
        quotationWasteId: item.QuotationWaste
          ? item.QuotationWaste.map((qw) => (qw.id ? qw.id : null))
          : [],
        vehicleTypes: item.QuotationTransportation
          ? item.QuotationTransportation.map((qt) =>
              qt.VehicleType ? qt.VehicleType.typeOfVehicle : null
            )
          : [],
        quotationTransportationId: item.QuotationTransportation
          ? item.QuotationTransportation.map((qt) => (qt.id ? qt.id : null))
          : [],
        haulingDate: item.haulingDate
          ? new Date(item.haulingDate).toISOString().split("T")[0]
          : null, // Convert timestamp to yyyy-mm-dd format
      }));

      setQuotationsData(flattenedData);
    } else {
      console.error(
        "quotations or quotations.quotations is undefined or not an array"
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotationResponse = await axios.get(
          `${apiUrl}/quotation/${user.id}`
        );

        processDataQuotations(quotationResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);
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
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id
            ? "Update Dispatched Transaction"
            : "Dispatch Transaction"}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Dispatch Date"
            name="scheduledDate"
            value={formData.scheduledDate}
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
            label="Dispatch Time"
            name="scheduledTime"
            value={formData.scheduledTime}
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
          {formData.id
            ? "Update Dispatched Transaction"
            : "Dispatch Transaction"}
        </Button>
      </Box>
    </Modal>
  );
};

export default DispatchModal;
