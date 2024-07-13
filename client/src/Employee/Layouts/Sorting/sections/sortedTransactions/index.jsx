import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";

const SortedTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const initialFormData = {
    id: "",
    clientId: "",
    bookedTransactionId: "",
    receivedTransactionId: "",
    sortedDate: null,
    sortedTime: null,
    batchWeight: 0,
    totalSortedWeight: 0,
    discrepancyWeight: 0,
    sortedWastes: [
      {
        quotationWasteId: "",
        wasteName: "",
        weight: 0,
        formNo: "",
      },
    ],
    sortedScraps: [],
    remarks: "",
    statusId: 5,
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
  const [isDiscrepancy, setIsDiscrepancy] = useState(false);

  const processData = useCallback(
    (response) => {
      const transactions = response.data;

      if (transactions && Array.isArray(transactions.pendingTransactions)) {
        const flattenedPendingData = transactions.pendingTransactions.map(
          (receiveItem) => {
            const dispatchItem = receiveItem.DispatchedTransaction;
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
            const receivedDate = receiveItem.receivedDate
              ? new Date(receiveItem.receivedDate)
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
            const receivedCreatedDate = receiveItem.createdAt
              ? new Date(receiveItem.createdAt)
              : null;
            let haulingTime = null;
            let scheduledTime = null;
            let dispatchedTime = null;
            let receivedTime = null;
            let bookedCreatedTime = null;
            let scheduledCreatedTime = null;
            let dispatchedCreatedTime = null;
            let receivedCreatedTime = null;

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

            if (receiveItem.receivedTime) {
              const [hours, minutes, seconds] =
                receiveItem.receivedTime.split(":");
              receivedTime = new Date(
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

            if (receivedCreatedDate) {
              receivedCreatedTime = receivedCreatedDate
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

            const receivedCreatedBy =
              receiveItem.Employee.firstName +
              " " +
              receiveItem.Employee.lastName;

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
              ...receiveItem,
              haulingDate: haulingDate
                ? haulingDate.toISOString().split("T")[0]
                : null,
              scheduledDate: scheduledDate
                ? scheduledDate.toISOString().split("T")[0]
                : null,
              dispatchedDate: dispatchedDate
                ? dispatchedDate.toISOString().split("T")[0]
                : null,
              receivedDate: receivedDate
                ? receivedDate.toISOString().split("T")[0]
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
              receivedTime: receivedTime
                ? receivedTime.toISOString().split("T")[1].slice(0, 5)
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
              receivedCreatedDate: receivedCreatedDate
                ? receivedCreatedDate.toISOString().split("T")[0]
                : null,
              bookedCreatedTime: bookedCreatedTime,
              scheduledCreatedTime: scheduledCreatedTime,
              dispatchedCreatedTime: dispatchedCreatedTime,
              receivedCreatedTime: receivedCreatedTime,
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
              statusId: bookItem.statusId,
              plateNumber: dispatchItem.Vehicle.plateNumber,
              driverName: `${dispatchItem.EmployeeDriver.firstName} ${dispatchItem.EmployeeDriver.lastName}`,
              helper: helper,
              bookedRemarks: bookItem.remarks,
              dispatchedRemarks: dispatchItem.remarks,
              scheduledRemarks: scheduledItem.remarks,
              receivedRemarks: receiveItem.remarks,
              scheduledCreatedBy: scheduledCreatedBy,
              dispatchedCreatedBy: dispatchedCreatedBy,
              receivedCreatedBy: receivedCreatedBy,
            };
          }
        );
        console.log(flattenedPendingData);
        setPendingTransactions(flattenedPendingData);
      }

      if (transactions && Array.isArray(transactions.finishedTransactions)) {
        const flattenedFinishedData = transactions.finishedTransactions.map(
          (sortItem) => {
            const receiveItem = sortItem.ReceivedTransaction;
            const dispatchItem = receiveItem.DispatchedTransaction;
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
            const receivedDate = receiveItem.receivedDate
              ? new Date(receiveItem.receivedDate)
              : null;
            const sortedDate = sortItem.sortedDate
              ? new Date(sortItem.sortedDate)
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
            const receivedCreatedDate = receiveItem.createdAt
              ? new Date(receiveItem.createdAt)
              : null;
            const sortedCreatedDate = sortItem.createdAt
              ? new Date(sortItem.createdAt)
              : null;
            let haulingTime = null;
            let scheduledTime = null;
            let dispatchedTime = null;
            let receivedTime = null;
            let sortedTime = null;
            let bookedCreatedTime = null;
            let scheduledCreatedTime = null;
            let dispatchedCreatedTime = null;
            let receivedCreatedTime = null;
            let sortedCreatedTime = null;

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

            if (receiveItem.receivedTime) {
              const [hours, minutes, seconds] =
                receiveItem.receivedTime.split(":");
              receivedTime = new Date(
                Date.UTC(1970, 0, 1, hours, minutes, seconds)
              );
            }

            if (sortItem.sortedTime) {
              const [hours, minutes, seconds] = sortItem.sortedTime.split(":");
              sortedTime = new Date(
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

            if (receivedCreatedDate) {
              receivedCreatedTime = receivedCreatedDate
                .toISOString()
                .split("T")[1]
                .slice(0, 8);
            }

            if (sortedCreatedDate) {
              sortedCreatedTime = sortedCreatedDate
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

            const receivedCreatedBy =
              receiveItem.Employee.firstName +
              " " +
              receiveItem.Employee.lastName;

            const sortedCreatedBy =
              sortItem.Employee.firstName + " " + sortItem.Employee.lastName;

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
              ...sortItem,
              haulingDate: haulingDate
                ? haulingDate.toISOString().split("T")[0]
                : null,
              scheduledDate: scheduledDate
                ? scheduledDate.toISOString().split("T")[0]
                : null,
              dispatchedDate: dispatchedDate
                ? dispatchedDate.toISOString().split("T")[0]
                : null,
              receivedDate: receivedDate
                ? receivedDate.toISOString().split("T")[0]
                : null,
              sortedDate: sortedDate
                ? sortedDate.toISOString().split("T")[0]
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
              receivedTime: receivedTime
                ? receivedTime.toISOString().split("T")[1].slice(0, 5)
                : null,
              sortedTime: sortedTime
                ? sortedTime.toISOString().split("T")[1].slice(0, 5)
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
              receivedCreatedDate: receivedCreatedDate
                ? receivedCreatedDate.toISOString().split("T")[0]
                : null,
              sortedCreatedDate: sortedCreatedDate
                ? sortedCreatedDate.toISOString().split("T")[0]
                : null,
              bookedCreatedTime: bookedCreatedTime,
              scheduledCreatedTime: scheduledCreatedTime,
              dispatchedCreatedTime: dispatchedCreatedTime,
              receivedCreatedTime: receivedCreatedTime,
              sortedCreatedTime: sortedCreatedTime,
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
              statusId: bookItem.statusId,
              plateNumber: dispatchItem.Vehicle.plateNumber,
              driverName: `${dispatchItem.EmployeeDriver.firstName} ${dispatchItem.EmployeeDriver.lastName}`,
              helper: helper,
              bookedRemarks: bookItem.remarks,
              dispatchedRemarks: dispatchItem.remarks,
              scheduledRemarks: scheduledItem.remarks,
              receivedRemarks: receiveItem.remarks,
              sortedRemarks: sortItem.remarks,
              pttNo: receiveItem.pttNo,
              manifestNo: receiveItem.manifestNo,
              pullOutFormNo: receiveItem.pullOutFormNo,
              manifestWeight: receiveItem.manifestWeight,
              clientWeight: receiveItem.clientWeight,
              grossWeight: receiveItem.grossWeight,
              tareWeight: receiveItem.tareWeight,
              netWeight: receiveItem.netWeight,
              scheduledCreatedBy: scheduledCreatedBy,
              dispatchedCreatedBy: dispatchedCreatedBy,
              receivedCreatedBy: receivedCreatedBy,
              sortedCreatedBy: sortedCreatedBy,
            };
          }
        );
        console.log(flattenedFinishedData);
        setFinishedTransactions(flattenedFinishedData);
      }
    },
    [employeeData]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dispatchResponse, employeeResponse] = await Promise.all([
          axios.get(`${apiUrl}/sortedTransaction`),
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
      id: "",
      clientId:
        row.DispatchedTransaction.ScheduledTransaction.BookedTransaction.Client
          .clientId,
      bookedTransactionId:
        row.DispatchedTransaction.ScheduledTransaction.bookedTransactionId,
      receivedTransactionId: row.id,
      sortedDate: null,
      sortedTime: null,
      batchWeight: row.netWeight,
      totalSortedWeight: 0,
      discrepancyWeight: 0,
      sortedWastes: [
        {
          quotationWasteId: "",
          wasteName: "",
          weight: 0,
          formNo: "",
        },
      ],
      sortedScraps: [],
      remarks: "",
      statusId: 5,
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
        clientId:
          typeToEdit.ReceivedTransaction.DispatchedTransaction
            .ScheduledTransaction.BookedTransaction.Client.clientId,
        bookedTransactionId:
          typeToEdit.ReceivedTransaction.DispatchedTransaction
            .ScheduledTransaction.bookedTransactionId,
        receivedTransactionId: typeToEdit.ReceivedTransaction.id,
        sortedDate: typeToEdit.sortedDate,
        sortedTime: typeToEdit.sortedTime,
        batchWeight: typeToEdit.netWeight,
        totalSortedWeight: typeToEdit.totalSortedWeight,
        discrepancyWeight: typeToEdit.discrepancyWeight,
        sortedWastes: typeToEdit.SortedWasteTransaction,
        sortedScraps: typeToEdit.SortedScrapTransaction,
        remarks: typeToEdit.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Received Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (row) => {
    console.log(row);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Received Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/sortedTransaction/${row.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId:
              row.ReceivedTransaction.DispatchedTransaction.ScheduledTransaction
                .bookedTransactionId,
          },
        }
      );

      processData(response);
      setSuccessMessage("Received Transaction deleted successfully!");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform client-side validation
    const {
      receivedTransactionId,
      sortedDate,
      sortedTime,
      totalSortedWeight,
      createdBy,
      sortedWastes,
      sortedScraps,
      remarks,
    } = formData;
    if (
      !receivedTransactionId ||
      !sortedDate ||
      !sortedTime ||
      !totalSortedWeight ||
      !createdBy ||
      (sortedWastes &&
        sortedWastes.some(
          (waste) =>
            !waste.weight || !waste.quotationWasteId || !waste.wasteName
        )) ||
      (sortedScraps &&
        sortedScraps.some((scrap) => !scrap.weight || !scrap.scrapTypeId)) ||
      (isDiscrepancy && !remarks)
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }
    try {
      let response;
      console.log(formData);
      if (formData.id) {
        response = await axios.put(
          `${apiUrl}/sortedTransaction/${formData.id}`,
          formData
        );

        processData(response);
        setSuccessMessage("Update Received Transaction successfully!");
      } else {
        response = await axios.post(`${apiUrl}/sortedTransaction`, formData);
        processData(response);
        setSuccessMessage("Receive Transaction successfully!");
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
        buttonText={"Sort"}
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
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
        setIsDiscrepancy={setIsDiscrepancy}
        isDiscrepancy={isDiscrepancy}
      />
    </Box>
  );
};

export default SortedTransactions;
