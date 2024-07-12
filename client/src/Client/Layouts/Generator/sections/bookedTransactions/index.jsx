import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";

const Transactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

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
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

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

      setPendingTransactions(flattenedData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookedTransactionResponse = await axios.get(
          `${apiUrl}/bookedTransaction`
        );

        processDataBookedTransaction(bookedTransactionResponse);
        setFinishedTransactions([]);
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

  const handleEditClick = (row) => {
    const typeToEdit = pendingTransactions.find((type) => type.id === row.id);
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
      console.error(
        `Booked Transaction with ID ${row.id} not found for editing.`
      );
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

      const updatedData = pendingTransactions.filter((type) => type.id !== id);
      setPendingTransactions(updatedData);
      setSuccessMessage("Booked Transaction deleted successfully!");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const {
      haulingDate,
      haulingTime,
      quotationWasteId,
      quotationTransportationId,
      statusId,
      createdBy,
    } = formData;

    if (
      !haulingDate ||
      !haulingTime ||
      !quotationWasteId ||
      !quotationTransportationId ||
      !statusId ||
      !createdBy
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

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
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default Transactions;
