import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";

const BookModal = ({
  user,
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [quotationsData, setQuotationsData] = useState([]);
  const [transporterClient, setTransporterClient] = useState([]);

  const [filteredVehicleTypes, setFilteredVehicleTypes] = useState([]);

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
          `${apiUrl}/api/quotation/${user.id}`
        );
        processDataQuotations(quotationResponse);

        const transporterClientResponse = await axios.get(
          `${apiUrl}/api/transporterClient/${user.id}`
        );
        setTransporterClient(transporterClientResponse.data.transporterClients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);

  const filterVehicleTypes = useCallback(
    (selectedWasteId) => {
      // Find the quotation where QuotationWaste contains the selected waste ID
      const matchingQuotation = quotationsData.find((q) =>
        q.QuotationWaste.some((waste) => waste.id === selectedWasteId)
      );

      // If a matching quotation is found, map the relevant QuotationTransportation data
      if (matchingQuotation) {
        const filteredData = matchingQuotation.QuotationTransportation.map(
          (transport) => ({
            id: transport.vehicleTypeId,
            quotationTransportationId: transport.id,
            typeOfVehicle: transport.VehicleType.typeOfVehicle,
          })
        );

        // Update the state with the filtered vehicle types
        setFilteredVehicleTypes(filteredData);
      } else {
        // If no match found, clear filtered vehicle types
        setFilteredVehicleTypes([]);
      }
    },
    [quotationsData, setFilteredVehicleTypes] // Dependencies
  );
  // Function to handle input changes
  const handleInputChangeAndFilter = (event) => {
    const { name, value } = event.target;

    // Call the provided handleInputChange from the parent component
    handleInputChange(event);

    // Call the filter function if the field is quotationWasteId
    if (name === "quotationWasteId") {
      filterVehicleTypes(value); // Pass the selected waste ID to the filter function
    }
  };

  useEffect(() => {
    if (formData.quotationWasteId) {
      filterVehicleTypes(formData.quotationWasteId);
    }
  }, [formData.quotationWasteId, filterVehicleTypes]);

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
          {formData.id ? "Update Booked Transaction" : "Book Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Proposed Hauling Date"
            name="haulingDate"
            value={formData.haulingDate}
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
            label="Proposed Hauling Time"
            name="haulingTime"
            value={formData.haulingTime}
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
        {user.userType === "TRP" && (
          <>
            <Autocomplete
              multiple
              options={transporterClient} // Options for the dropdown
              // getOptionLabel={(option) => option.clientName} // Display clientName in the dropdown

              getOptionLabel={(option) =>
                option.clientName === "" ? "" : option.clientName
              }
              // value={formData.transporterClientId || []} // Current selected values

              value={transporterClient.filter((emp) =>
                formData.transporterClientId.includes(emp.id)
              )}
              onChange={(event, newValue) => {
                handleInputChangeAndFilter({
                  target: {
                    name: "transporterClientId",
                    value: newValue.map((option) => option.id), // Map selected values to their IDs
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client Name"
                  placeholder="Select clients"
                  fullWidth
                  required
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              )}
            />
          </>
        )}
        <TextField
          label="Waste Name"
          name="quotationWasteId"
          value={formData.quotationWasteId}
          onChange={handleInputChangeAndFilter}
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
          {quotationsData.map((q, index) =>
            q.QuotationWaste.map((waste, wasteIndex) => (
              <MenuItem key={`${index}-${wasteIndex}`} value={waste.id}>
                {waste.wasteName} - {waste.unit}
              </MenuItem>
            ))
          )}
        </TextField>
        {(filteredVehicleTypes.length > 0 || formData.quotationWasteId) && (
          <TextField
            label="Vehicle Type"
            name="quotationTransportationId"
            value={formData.quotationTransportationId}
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
            {filteredVehicleTypes.map((transport, index) => (
              <MenuItem key={index} value={transport.quotationTransportationId}>
                {transport.typeOfVehicle}
              </MenuItem>
            ))}
          </TextField>
        )}
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
          {formData.id ? "Update" : "Book"}
        </Button>
      </Box>
    </Modal>
  );
};

export default BookModal;
