import React, { useState, useEffect, useCallback } from "react";
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
    bookedTransactionId: "",
    scheduledTransactionId: "",
    vehicleId: "",
    driverId: "",
    helperIds: "",
    isDispatched: false,
    dispatchedDate: null,
    dispatchedTime: null,
    remarks: "",
    statusId: 3,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [responseData, setResponseData] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [error, setError] = useState("");

  const processData = useCallback(
    (response) => {
      const transactions = response.data;

      if (transactions && Array.isArray(transactions.pendingTransactions)) {
        const flattenedPendingData = transactions.pendingTransactions.map(
          (scheduledItem) => {
            const bookItem = scheduledItem.BookedTransaction;
            const haulingDate = bookItem.haulingDate
              ? new Date(bookItem.haulingDate)
              : null;
            const scheduledDate = scheduledItem.scheduledDate
              ? new Date(scheduledItem.scheduledDate)
              : null;
            const bookedCreatedDate = bookItem.createdAt
              ? new Date(bookItem.createdAt)
              : null;
            const scheduledCreatedDate = scheduledItem.createdAt
              ? new Date(scheduledItem.createdAt)
              : null;
            let haulingTime = null;
            let scheduledTime = null;
            let bookedCreatedTime = null;
            let scheduledCreatedTime = null;

            if (bookItem.haulingTime) {
              const [hours, minutes, seconds] = bookItem.haulingTime.split(":");
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
              clientName: bookItem.Client ? bookItem.Client.clientName : null,
              wasteName: bookItem.QuotationWaste
                ? bookItem.QuotationWaste.wasteName
                : null,
              transactionId: bookItem.transactionId
                ? bookItem.transactionId
                : null,
              vehicleType: bookItem.QuotationTransportation
                ? bookItem.QuotationTransportation.VehicleType.typeOfVehicle
                : null,
              vehicleTypeId: bookItem.QuotationTransportation
                ? bookItem.QuotationTransportation.vehicleTypeId
                : null,
              bookedRemarks: bookItem.remarks,
              statusId: bookItem.statusId,
              scheduledCreatedBy: scheduledCreatedBy,
              scheduledRemarks: scheduledItem.remarks,
            };
          }
        );

        setPendingTransactions(flattenedPendingData);
      }

      if (transactions && Array.isArray(transactions.finishedTransactions)) {
        const flattenedFinishedData = transactions.finishedTransactions.map(
          (dispatchItem) => {
            const scheduledItem = dispatchItem.ScheduledTransaction;
            const bookItem = scheduledItem.BookedTransaction;
            const haulingDate = bookItem.haulingDate
              ? new Date(bookItem.haulingDate)
              : null;
            const scheduledDate = scheduledItem.scheduledDate
              ? new Date(scheduledItem.scheduledDate)
              : null;
            const dispatchedDate = dispatchItem.dispatchedDate
              ? new Date(dispatchItem.dispatchedDate)
              : null;
            const bookedCreatedDate = bookItem.createdAt
              ? new Date(bookItem.createdAt)
              : null;
            const scheduledCreatedDate = scheduledItem.createdAt
              ? new Date(scheduledItem.createdAt)
              : null;
            const dispatchedCreatedDate = dispatchItem.createdAt
              ? new Date(dispatchItem.createdAt)
              : null;
            let haulingTime = null;
            let scheduledTime = null;
            let dispatchedTime = null;
            let bookedCreatedTime = null;
            let scheduledCreatedTime = null;
            let dispatchedCreatedTime = null;

            if (bookItem.haulingTime) {
              const [hours, minutes, seconds] = bookItem.haulingTime.split(":");
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

            if (dispatchItem.dispatchedTime) {
              const [hours, minutes, seconds] =
                dispatchItem.dispatchedTime.split(":");
              dispatchedTime = new Date(
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

            if (dispatchedCreatedDate) {
              dispatchedCreatedTime = dispatchedCreatedDate
                .toISOString()
                .split("T")[1]
                .slice(0, 8);
            }

            const scheduledCreatedBy =
              scheduledItem.Employee.firstName +
              " " +
              scheduledItem.Employee.lastName;

            const dispatchedCreatedBy =
              dispatchItem.Employee.firstName +
              " " +
              dispatchItem.Employee.lastName;

            const helperIdsArray = dispatchItem.helperId
              .split(",")
              .map((id) => id.trim());

            const helper = helperIdsArray
              .map((helperId) => {
                const employee = employeeData.find(
                  (emp) => emp.employeeId === helperId
                );
                return employee
                  ? `${employee.firstName} ${employee.lastName}`
                  : null;
              })
              .filter((name) => name !== null)
              .join(", ");

            return {
              ...dispatchItem,
              haulingDate: haulingDate
                ? haulingDate.toISOString().split("T")[0]
                : null,
              scheduledDate: scheduledDate
                ? scheduledDate.toISOString().split("T")[0]
                : null,
              dispatchedDate: dispatchedDate
                ? dispatchedDate.toISOString().split("T")[0]
                : null,
              haulingTime: haulingTime
                ? haulingTime.toISOString().split("T")[1].slice(0, 5)
                : null,
              scheduledTime: scheduledTime
                ? scheduledTime.toISOString().split("T")[1].slice(0, 5)
                : null,
              dispatchedTime: dispatchedTime
                ? dispatchedTime.toISOString().split("T")[1].slice(0, 5)
                : null,
              bookedCreatedDate: bookedCreatedDate
                ? bookedCreatedDate.toISOString().split("T")[0]
                : null,
              scheduledCreatedDate: scheduledCreatedDate
                ? scheduledCreatedDate.toISOString().split("T")[0]
                : null,
              dispatchedCreatedDate: dispatchedCreatedDate
                ? dispatchedCreatedDate.toISOString().split("T")[0]
                : null,
              bookedCreatedTime: bookedCreatedTime,
              scheduledCreatedTime: scheduledCreatedTime,
              dispatchedCreatedTime: dispatchedCreatedTime,
              clientName: bookItem.Client ? bookItem.Client.clientName : null,
              wasteName: bookItem.QuotationWaste
                ? bookItem.QuotationWaste.wasteName
                : null,
              transactionId: bookItem.transactionId
                ? bookItem.transactionId
                : null,
              vehicleType: bookItem.QuotationTransportation
                ? bookItem.QuotationTransportation.VehicleType.typeOfVehicle
                : null,
              vehicleTypeId: bookItem.QuotationTransportation
                ? bookItem.QuotationTransportation.vehicleTypeId
                : null,
              bookedRemarks: bookItem.remarks,
              statusId: bookItem.statusId,
              scheduledCreatedBy: scheduledCreatedBy,
              scheduledRemarks: scheduledItem.remarks,
              helper: helper,
              dispatchedCreatedBy: dispatchedCreatedBy,
              dispatchedRemarks: dispatchItem.remarks,
            };
          }
        );

        setFinishedTransactions(flattenedFinishedData);
      }
    },
    [employeeData]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dispatchResponse, employeeResponse] = await Promise.all([
          axios.get(`${apiUrl}/dispatchedTransaction`),
          axios.get(`${apiUrl}/employee`),
        ]);

        setResponseData(dispatchResponse);
        setEmployeeData(employeeResponse.data.employees);
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
      vehicleTypeId: row.vehicleTypeId,
      id: "",
      bookedTransactionId: row.bookedTransactionId,
      scheduledTransactionId: row.id,
      vehicleId: "",
      driverId: "",
      helperIds: "",
      isDispatched: false,
      dispatchedDate: null,
      dispatchedTime: null,
      remarks: "",
      statusId: 3,
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

  const handleAutocompleteChange = (event, newValue) => {
    const updatedHelperIds = newValue.map((item) => item.employeeId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      helperIds: updatedHelperIds.join(", "),
    }));
  };

  const handleEditClick = (row) => {
    const typeToEdit = finishedTransactions.find((type) => type.id === row.id);

    if (typeToEdit) {
      setFormData({
        vehicleTypeId: typeToEdit.vehicleTypeId,
        id: typeToEdit.id,
        bookedTransactionId: typeToEdit.bookedTransactionId,
        scheduledTransactionId: typeToEdit.scheduledTransactionId,
        vehicleId: typeToEdit.vehicleId,
        driverId: typeToEdit.driverId,
        helperIds: typeToEdit.helperId,
        isDispatched: typeToEdit.isDispatched,
        dispatchedDate: typeToEdit.dispatchedDate,
        dispatchedTime: typeToEdit.dispatchedTime,
        remarks: typeToEdit.remarks,
        statusId: 3,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Dispatched Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (row) => {
    console.log(row);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Dispatched Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/dispatchedTransaction/${row.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.ScheduledTransaction.bookedTransactionId,
          },
        }
      );

      processData(response);
      setSuccessMessage("Dispatched Transaction deleted successfully!");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const {
      dispatchedDate,
      dispatchedTime,
      vehicleId,
      driverId,
      helperIds,
      statusId,
      createdBy,
    } = formData;

    if (
      !dispatchedDate ||
      !dispatchedTime ||
      !vehicleId ||
      !driverId ||
      helperIds.length === 0 ||
      !statusId ||
      !createdBy
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      if (!formData.driverId) {
        setError("Driver selection is required.");
      } else {
        setError("");

        let response;

        if (formData.id) {
          response = await axios.put(
            `${apiUrl}/dispatchedTransaction/${formData.id}`,
            formData
          );

          processData(response);
          setSuccessMessage("Update Dispatched Transaction successfully!");
        } else {
          response = await axios.post(
            `${apiUrl}/dispatchedTransaction`,
            formData
          );
          processData(response);
          setSuccessMessage("Dispatch Transaction successfully!");
        }

        setShowSuccessMessage(true);
        handleCloseModal();
      }
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
        buttonText={"Dispatch"}
        pendingTransactions={pendingTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <Modal
        user={user}
        error={error}
        handleAutocompleteChange={handleAutocompleteChange}
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

export default DispatchedTransactions;
