import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";

const ScheduledTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(user.userType);

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
  const [responseData, setResponseData] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const processData = useCallback((response) => {
    const transactions = response.data;

    if (transactions && Array.isArray(transactions.pendingTransactions)) {
      const flattenedPendingData = transactions.pendingTransactions.map(
        (bookItem) => {
          const haulingDate = bookItem.haulingDate
            ? new Date(bookItem.haulingDate)
            : null;
          const bookedCreatedDate = bookItem.createdAt
            ? new Date(bookItem.createdAt)
            : null;
          let haulingTime = null;
          let bookedCreatedTime = null;
          if (bookItem.haulingTime) {
            const [hours, minutes, seconds] = bookItem.haulingTime.split(":");
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
            ...bookItem,
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
            clientName: bookItem.Client ? bookItem.Client.clientName : null,
            wasteName: bookItem.QuotationWaste
              ? bookItem.QuotationWaste.wasteName
              : null,
            vehicleType: bookItem.QuotationTransportation
              ? bookItem.QuotationTransportation.VehicleType.typeOfVehicle
              : null,
            bookedRemarks: bookItem.remarks,
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
            statusId: item.statusId,
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/scheduledTransaction`);
        console.log(response);
        setResponseData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);

  useEffect(() => {
    if (responseData) {
      processData(responseData);
    }
  }, [responseData, processData]);

  const handleOpenModal = (row) => {
    setFormData({
      id: "",
      bookedTransactionId: row.id,
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

  const handleEditClick = (row) => {
    const typeToEdit = finishedTransactions.find((type) => type.id === row.id);

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
      console.error(`Vehicle type with ID ${row.id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Scheduled Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/scheduledTransaction/${row.id}`,
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
      <Transaction
        user={user}
        buttonText={"Schedule"}
        pendingTransactions={pendingTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <Modal
        user={user}
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default ScheduledTransactions;
