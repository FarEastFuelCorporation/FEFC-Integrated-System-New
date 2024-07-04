import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";

const DispatchedTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const initialFormData = {
    id: "",
    scheduledTransactionId: "",
    vehicleId: "",
    driverId: "",
    helperId: "",
    isDispatched: false,
    scheduledTime: "",
    remarks: "",
    statusId: 3,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const processData = (response) => {
    const transactions = response.data;

    if (transactions && Array.isArray(transactions.pendingTransactions)) {
      const flattenedFinishedData = transactions.pendingTransactions.map(
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
            );
          }

          if (scheduledItem.scheduledTime) {
            const [hours, minutes, seconds] =
              scheduledItem.scheduledTime.split(":");
            scheduledTime = new Date(
              Date.UTC(1970, 0, 1, hours, minutes, seconds)
            );
          }

          if (bookedCreatedDate) {
            bookedCreatedTime = bookedCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8);
          }

          if (scheduledCreatedDate) {
            scheduledCreatedTime = scheduledCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8);
          }

          const scheduledCreatedBy =
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
            scheduledCreatedBy: scheduledCreatedBy,
            scheduledRemarks: scheduledItem.remarks,
          };
        }
      );

      setPendingTransactions(flattenedFinishedData);
    } else {
      console.error(
        "transactions or transactions.finishedTransactions is undefined or not an array"
      );
    }

    if (transactions && Array.isArray(transactions.finishedTransactions)) {
      const flattenedDispatchedData = transactions.finishedTransactions.map(
        (dispatchedItem) => {
          const item = dispatchedItem.ScheduledTransaction.BookedTransaction;
          const haulingDate = item.haulingDate
            ? new Date(item.haulingDate)
            : null;
          const scheduledDate = dispatchedItem.scheduledDate
            ? new Date(dispatchedItem.scheduledDate)
            : null;
          const bookedCreatedDate = item.createdAt
            ? new Date(item.createdAt)
            : null;
          const scheduledCreatedDate = dispatchedItem.createdAt
            ? new Date(dispatchedItem.createdAt)
            : null;
          let haulingTime = null;
          let scheduledTime = null;
          let bookedCreatedTime = null;
          let scheduledCreatedTime = null;

          if (item.haulingTime) {
            const [hours, minutes, seconds] = item.haulingTime.split(":");
            haulingTime = new Date(
              Date.UTC(1970, 0, 1, hours, minutes, seconds)
            );
          }

          if (dispatchedItem.scheduledTime) {
            const [hours, minutes, seconds] =
              dispatchedItem.scheduledTime.split(":");
            scheduledTime = new Date(
              Date.UTC(1970, 0, 1, hours, minutes, seconds)
            );
          }

          if (bookedCreatedDate) {
            bookedCreatedTime = bookedCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8);
          }

          if (scheduledCreatedDate) {
            scheduledCreatedTime = scheduledCreatedDate
              .toISOString()
              .split("T")[1]
              .slice(0, 8);
          }

          const createdBy =
            dispatchedItem.Employee.firstName +
            " " +
            dispatchedItem.Employee.lastName;

          return {
            ...dispatchedItem,
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
            scheduledRemarks: dispatchedItem.remarks,
          };
        }
      );

      setFinishedTransactions(flattenedDispatchedData);
    } else {
      console.error(
        "transactions or transactions.dispatchedTransactions is undefined or not an array"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/dispatchedTransaction`);
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
        buttonText={"Set"}
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

export default DispatchedTransactions;
