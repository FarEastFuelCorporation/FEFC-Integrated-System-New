import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { format } from "date-fns";
import axios from "axios";
import { tokens } from "../../../../../theme";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import {
  CircleLogo,
  CustomAccordionDetails,
  CustomAccordionStyles,
} from "../../../../../OtherComponents/CustomAccordionStyles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccordionSummary from "@mui/material/AccordionSummary";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AlarmIcon from "@mui/icons-material/Alarm";

const ScheduledTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    scheduledDate: "",
    scheduledTime: "",
    remarks: "",
    statusId: 2,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const transactions =
    selectedTab === 0 ? pendingTransactions : finishedTransactions;

  const processData = (response) => {
    const transactions = response.data;

    if (transactions && Array.isArray(transactions.pendingTransactions)) {
      const flattenedPendingData = transactions.pendingTransactions.map(
        (item) => {
          const haulingDate = item.haulingDate
            ? new Date(item.haulingDate)
            : null;
          const bookedCreatedDate = item.createdAt
            ? new Date(item.createdAt)
            : null;
          let haulingTime = null;
          let bookedCreatedTime = null;
          if (item.haulingTime) {
            const [hours, minutes, seconds] = item.haulingTime.split(":");
            haulingTime = new Date(
              Date.UTC(1970, 0, 1, hours, minutes, seconds)
            ); // Create a date using UTC
          }
          if (bookedCreatedDate) {
            bookedCreatedTime = bookedCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8); // Extract HH:mm:ss from createdAt timestamp
          }

          return {
            ...item,
            haulingDate: haulingDate
              ? haulingDate.toISOString().split("T")[0]
              : null,
            haulingTime: haulingTime
              ? haulingTime.toISOString().split("T")[1].slice(0, 5)
              : null,
            bookedCreatedDate: bookedCreatedDate
              ? bookedCreatedDate.toISOString().split("T")[0]
              : null,
            bookedCreatedTime: bookedCreatedTime,
            clientName: item.Client ? item.Client.clientName : null,
            wasteName: item.QuotationWaste
              ? item.QuotationWaste.wasteName
              : null,
            vehicleType: item.QuotationTransportation
              ? item.QuotationTransportation.VehicleType.typeOfVehicle
              : null,
            bookedRemarks: item.remarks,
          };
        }
      );

      setPendingTransactions(flattenedPendingData);
    } else {
      console.error(
        "bookedTransactions or bookedTransactions.pendingTransactions is undefined or not an array"
      );
    }

    if (transactions && Array.isArray(transactions.finishedTransactions)) {
      const flattenedFinishedData = transactions.finishedTransactions.map(
        (scheduledItem) => {
          const item = scheduledItem.BookedTransaction;
          const haulingDate = item.haulingDate
            ? new Date(item.haulingDate)
            : null;
          const scheduledDate = scheduledItem.scheduledDate
            ? new Date(scheduledItem.scheduledDate)
            : null;
          const bookedCreatedDate = item.createdAt
            ? new Date(item.createdAt)
            : null;
          const scheduledCreatedDate = scheduledItem.createdAt
            ? new Date(scheduledItem.createdAt)
            : null;
          let haulingTime = null;
          let scheduledTime = null;
          let bookedCreatedTime = null;
          let scheduledCreatedTime = null;
          if (item.haulingTime) {
            const [hours, minutes, seconds] = item.haulingTime.split(":");
            haulingTime = new Date(
              Date.UTC(1970, 0, 1, hours, minutes, seconds)
            ); // Create a date using UTC
          }
          if (scheduledItem.scheduledTime) {
            const [hours, minutes, seconds] =
              scheduledItem.scheduledTime.split(":");
            scheduledTime = new Date(
              Date.UTC(1970, 0, 1, hours, minutes, seconds)
            ); // Create a date using UTC
          }
          if (bookedCreatedDate) {
            bookedCreatedTime = bookedCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8); // Extract HH:mm:ss from createdAt timestamp
          }
          if (scheduledCreatedDate) {
            scheduledCreatedTime = scheduledCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8); // Extract HH:mm:ss from createdAt timestamp
          }

          const createdBy =
            scheduledItem.Employee.firstName +
            " " +
            scheduledItem.Employee.lastName;

          return {
            ...scheduledItem,
            haulingDate: haulingDate
              ? haulingDate.toISOString().split("T")[0]
              : null,
            scheduledDate: scheduledDate
              ? scheduledDate.toISOString().split("T")[0]
              : null,
            haulingTime: haulingTime
              ? haulingTime.toISOString().split("T")[1].slice(0, 5)
              : null,
            scheduledTime: scheduledTime
              ? scheduledTime.toISOString().split("T")[1].slice(0, 5)
              : null,
            bookedCreatedDate: bookedCreatedDate
              ? bookedCreatedDate.toISOString().split("T")[0]
              : null,
            scheduledCreatedDate: scheduledCreatedDate
              ? scheduledCreatedDate.toISOString().split("T")[0]
              : null,
            bookedCreatedTime: bookedCreatedTime,
            scheduledCreatedTime: scheduledCreatedTime,
            clientName: item.Client ? item.Client.clientName : null,
            wasteName: item.QuotationWaste
              ? item.QuotationWaste.wasteName
              : null,
            transactionId: item.transactionId ? item.transactionId : null,
            vehicleType: item.QuotationTransportation
              ? item.QuotationTransportation.VehicleType.typeOfVehicle
              : null,
            bookedRemarks: item.remarks,
            createdBy: createdBy,
            scheduledRemarks: scheduledItem.remarks,
          };
        }
      );

      setFinishedTransactions(flattenedFinishedData);
    } else {
      console.error(
        "bookedTransactions or bookedTransactions.finishedTransactions is undefined or not an array"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/scheduledTransaction`);
        console.log(response);
        processData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);

  const handleOpenModal = (id) => {
    console.log(id);
    setFormData({
      id: "",
      bookedTransactionId: id,
      scheduledDate: "",
      scheduledTime: "",
      remarks: "",
      statusId: 2,
      createdBy: user.id,
    });
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
    const typeToEdit = finishedTransactions.find((type) => type.id === id);

    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        bookedTransactionId: typeToEdit.bookedTransactionId,
        scheduledDate: typeToEdit.scheduledDate,
        scheduledTime: typeToEdit.scheduledTime,
        remarks: typeToEdit.remarks,
        statusId: 2,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(`Vehicle type with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Scheduled Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/scheduledTransaction/${id}`,
        {
          data: { deletedBy: user.id },
        }
      );

      processData(response);
      setSuccessMessage("Scheduled Transaction deleted successfully!");
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
          `${apiUrl}/scheduledTransaction/${formData.id}`,
          formData
        );

        processData(response);
        setSuccessMessage("Update Scheduled Transaction successfully!");
      } else {
        console.log(formData);
        response = await axios.post(`${apiUrl}/scheduledTransaction`, formData);
        processData(response);
        setSuccessMessage("Scheduled Transaction successfully!");
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

      <Box mt="40px">
        <Card>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            sx={{
              "& .Mui-selected": {
                backgroundColor: colors.greenAccent[400],
                boxShadow: "none",
                borderBottom: `1px solid ${colors.grey[100]}`,
              },
            }}
          >
            <Tab label="Pending" />
            <Tab label="Finished" />
          </Tabs>
          <CustomAccordionStyles>
            {transactions.map((row) => (
              <Accordion key={row.id}>
                <AccordionSummary sx={{}}>
                  <Typography variant="h4">
                    Transaction ID: {row.transactionId}
                    {" - "}
                    {((user.userType !== "GEN") !== "TRP") !== "IFM" && (
                      <Box>
                        {" - "}
                        {row.clientName} {" - "}
                        {format(new Date(row.haulingDate), "MMMM dd, yyyy")}
                      </Box>
                    )}
                  </Typography>
                  {selectedTab === 0 ? (
                    <Button
                      onClick={() => handleOpenModal(row.id)}
                      sx={{ backgroundColor: `${colors.greenAccent[700]}` }}
                    >
                      <Typography
                        sx={{
                          color: `${colors.grey[100]}`,
                          fontSize: "10px !important",
                        }}
                      >
                        Schedule
                      </Typography>
                    </Button>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <IconButton onClick={() => handleEditClick(row.id)}>
                        <EditIcon sx={{ color: "#ff9800" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(row.id)}>
                        <DeleteIcon sx={{ color: "#f44336" }} />
                      </IconButton>
                    </div>
                  )}
                </AccordionSummary>
                <CustomAccordionDetails>
                  <Box sx={{ my: 3, position: "relative" }}>
                    <CircleLogo>
                      <CollectionsBookmarkIcon
                        sx={{
                          fontSize: "30px",
                          color: `${colors.greenAccent[400]}`,
                        }}
                      />
                    </CircleLogo>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h4"
                        my={1}
                        color={colors.greenAccent[400]}
                      >
                        Booked
                      </Typography>
                      <Typography variant="h5">
                        {row.bookedCreatedDate} {row.bookedCreatedTime}
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
                    <Typography variant="h5">
                      Waste Name: {row.wasteName}
                    </Typography>
                    <Typography variant="h5">
                      Vehicle Type: {row.vehicleType}
                    </Typography>
                    <Typography variant="h5">
                      Remarks: {row.bookedRemarks}
                    </Typography>
                  </Box>
                  <hr />
                  <Box sx={{ my: 3, position: "relative" }}>
                    <CircleLogo>
                      <AlarmIcon
                        sx={{
                          fontSize: "30px",
                          color: `${colors.grey[900]}`,
                        }}
                      />
                    </CircleLogo>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h4"
                        my={1}
                        color={colors.greenAccent[400]}
                      >
                        {selectedTab === 0 ? "For Scheduling" : "Scheduled"}
                      </Typography>
                      <Typography variant="h5">
                        {row.scheduledCreatedDate} {row.scheduledCreatedTime}
                      </Typography>
                    </Box>
                    {selectedTab === 0 ? (
                      <Box></Box>
                    ) : (
                      <Box>
                        <Typography variant="h5">
                          Scheduled Date:{" "}
                          {format(new Date(row.scheduledDate), "MMMM dd, yyyy")}
                        </Typography>
                        <Typography variant="h5">
                          Scheduled Time:{" "}
                          {row.haulingTime
                            ? format(
                                parseTimeString(row.scheduledTime),
                                "hh:mm aa"
                              )
                            : ""}
                        </Typography>

                        <Typography variant="h5">
                          Remarks: {row.scheduledRemarks}
                        </Typography>
                        <Typography variant="h5">
                          Scheduled By: {row.createdBy}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <hr />
                </CustomAccordionDetails>
              </Accordion>
            ))}
          </CustomAccordionStyles>
        </Card>
      </Box>
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
            {formData.id
              ? "Update Scheduled Transaction"
              : "Schedule Transaction"}
          </Typography>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Scheduled Date"
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
              label="Scheduled Time"
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.id
              ? "Update Scheduled Transaction"
              : "Schedule Transaction"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ScheduledTransactions;
