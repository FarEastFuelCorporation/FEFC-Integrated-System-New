import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  MenuItem,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { format } from "date-fns";
import axios from "axios";
import { tokens } from "../../../../../theme";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import {
  CustomAccordionDetails,
  CustomAccordionStyles,
  CustomAccordionSummary,
} from "../../../../../OtherComponents/CustomAccordionStyles";

const Transactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    quotationWasteId: "",
    quotationTransportationId: "",
    haulingDate: "",
    haulingTime: "",
    pttNo: "",
    manifestNo: "",
    pullOutFormNo: "",
    remarks: "",
    statusId: 1,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [bookedTransactions, setBookedTransactions] = useState([]);
  const [quotationsData, setQuotationsData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const processDataBookedTransaction = (response) => {
    const transactions = response.data;
    if (transactions && Array.isArray(transactions.bookedTransactions)) {
      const flattenedData = transactions.bookedTransactions.map((item) => {
        const haulingDate = item.haulingDate
          ? new Date(item.haulingDate)
          : null;
        const createdDate = item.createdAt ? new Date(item.createdAt) : null;
        let haulingTime = null;
        let createdTime = null;
        if (item.haulingTime) {
          const [hours, minutes, seconds] = item.haulingTime.split(":");
          haulingTime = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds)); // Create a date using UTC
        }
        if (createdDate) {
          createdTime = createdDate.toISOString().split("T")[1].slice(0, 8); // Extract HH:mm:ss from createdAt timestamp
        }

        return {
          ...item,
          haulingDate: haulingDate
            ? haulingDate.toISOString().split("T")[0]
            : null,
          haulingTime: haulingTime
            ? haulingTime.toISOString().split("T")[1].slice(0, 5)
            : null,
          createdDate: createdDate
            ? createdDate.toISOString().split("T")[0]
            : null,
          createdTime: createdTime,
          wasteName: item.QuotationWaste ? item.QuotationWaste.wasteName : null,
          vehicleType: item.QuotationTransportation
            ? item.QuotationTransportation.VehicleType.typeOfVehicle
            : null,
        };
      });

      setBookedTransactions(flattenedData);
    } else {
      console.error(
        "bookedTransactions or bookedTransactions.bookedTransactions is undefined or not an array"
      );
    }
  };

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
        const [bookedTransactionResponse, quotationResponse] =
          await Promise.all([
            axios.get(`${apiUrl}/bookedTransaction`),
            axios.get(`${apiUrl}/quotation/${user.id}`),
          ]);
        processDataBookedTransaction(bookedTransactionResponse);
        processDataQuotations(quotationResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const typeToEdit = bookedTransactions.find((type) => type.id === id);
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        quotationWasteId: typeToEdit.quotationWasteId,
        quotationTransportationId: typeToEdit.quotationTransportationId,
        haulingDate: typeToEdit.haulingDate,
        haulingTime: typeToEdit.haulingTime,
        pttNo: typeToEdit.pttNo,
        manifestNo: typeToEdit.manifestNo,
        pullOutFormNo: typeToEdit.pullOutFormNo,
        remarks: typeToEdit.remarks,
        statusId: 1,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Booked Transaction with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this vehicle type?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      await axios.delete(`${apiUrl}/bookedTransaction/${id}`, {
        data: { deletedBy: user.id },
      });

      const updatedData = bookedTransactions.filter((type) => type.id !== id);
      setBookedTransactions(updatedData);
      setSuccessMessage("Booked Transaction deleted successfully!");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (formData.id) {
        response = await axios.put(
          `${apiUrl}/bookedTransaction/${formData.id}`,
          formData
        );

        processDataBookedTransaction(response);
        setSuccessMessage("Booked Transaction updated successfully!");
      } else {
        response = await axios.post(`${apiUrl}/bookedTransaction`, formData);

        processDataBookedTransaction(response);
        setSuccessMessage("Booked Transaction successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="Transactions" subtitle="List of Transactions" />
        {user.userType === "GEN" && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomAccordionStyles>
        {bookedTransactions.map((row) => (
          <Accordion key={row.id}>
            <CustomAccordionSummary
              row={row}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
            <CustomAccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4" color={colors.greenAccent[400]}>
                  Booked
                </Typography>
                <Typography variant="h5">
                  {row.createdDate} {row.createdTime}
                </Typography>
              </Box>
              <Typography variant="h5">
                Hauling Date:{" "}
                {format(new Date(row.haulingDate), "MMMM dd, yyyy")}
              </Typography>
              <Typography variant="h5">
                Hauling Time:{" "}
                {row.haulingTime
                  ? format(parseTimeString(row.haulingTime), "hh:mm aa")
                  : ""}
              </Typography>
              <Typography variant="h5">Waste Name: {row.wasteName}</Typography>
              <Typography variant="h5">
                Vehicle Type: {row.vehicleType}
              </Typography>
              <Typography variant="h5">Remarks: {row.remarks}</Typography>
              <hr></hr>
            </CustomAccordionDetails>
          </Accordion>
        ))}
      </CustomAccordionStyles>
      <Modal open={openModal} onClose={handleCloseModal}>
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
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Hauling Date"
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
              label="Hauling Time"
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
          <TextField
            label="Waste Name"
            name="quotationWasteId"
            value={formData.quotationWasteId}
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
            {quotationsData
              .flatMap((q) => q.quotationWasteId)
              .map((wasteId, index) => (
                <MenuItem key={index} value={wasteId}>
                  {quotationsData[index].wasteNames[index]}
                </MenuItem>
              ))}
          </TextField>
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
            {quotationsData
              .flatMap((q) => q.quotationTransportationId)
              .map((transportationId, index) => (
                <MenuItem key={transportationId} value={transportationId}>
                  {quotationsData[index].vehicleTypes[index]}
                </MenuItem>
              ))}
          </TextField>
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
            {formData.id ? "Update Booked Transaction" : "Book Transaction"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Transactions;
