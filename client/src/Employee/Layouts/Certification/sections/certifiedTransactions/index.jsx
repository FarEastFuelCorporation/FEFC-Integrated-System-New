import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";

const CertifiedTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const initialFormData = {
    waste: [],
    id: "",
    bookedTransactionId: "",
    sortedWasteTransactionId: "",
    treatedWastes: [
      {
        treatedDate: null,
        treatedTime: null,
        treatmentProcessId: "",
        treatmentMachineId: "",
        weight: 0,
      },
    ],
    remarks: "",
    statusId: 6,
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

  const processTransactionItem = (sortItem, employeeData) => {
    const receiveItem = sortItem.ReceivedTransaction;
    const dispatchItem = receiveItem.DispatchedTransaction;
    const scheduledItem = dispatchItem.ScheduledTransaction;
    const bookItem = scheduledItem.BookedTransaction;

    const parseDate = (dateString) =>
      dateString ? new Date(dateString) : null;
    const parseTime = (timeString) => {
      if (timeString) {
        const [hours, minutes, seconds] = timeString.split(":");
        return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
      }
      return null;
    };

    const haulingDate = parseDate(bookItem.haulingDate);
    const scheduledDate = parseDate(scheduledItem.scheduledDate);
    const dispatchedDate = parseDate(dispatchItem.dispatchedDate);
    const receivedDate = parseDate(receiveItem.receivedDate);
    const sortedDate = parseDate(sortItem.sortedDate);
    const bookedCreatedDate = parseDate(bookItem.createdAt);
    const scheduledCreatedDate = parseDate(scheduledItem.createdAt);
    const dispatchedCreatedDate = parseDate(dispatchItem.createdAt);
    const receivedCreatedDate = parseDate(receiveItem.createdAt);
    const sortedCreatedDate = parseDate(sortItem.createdAt);

    const haulingTime = parseTime(bookItem.haulingTime);
    const scheduledTime = parseTime(scheduledItem.scheduledTime);
    const dispatchedTime = parseTime(dispatchItem.dispatchedTime);
    const receivedTime = parseTime(receiveItem.receivedTime);
    const sortedTime = parseTime(sortItem.sortedTime);

    const bookedCreatedTime = bookedCreatedDate
      ? bookedCreatedDate.toISOString().split("T")[1].slice(0, 8)
      : null;
    const scheduledCreatedTime = scheduledCreatedDate
      ? scheduledCreatedDate.toISOString().split("T")[1].slice(0, 8)
      : null;
    const dispatchedCreatedTime = dispatchedCreatedDate
      ? dispatchedCreatedDate.toISOString().split("T")[1].slice(0, 8)
      : null;
    const receivedCreatedTime = receivedCreatedDate
      ? receivedCreatedDate.toISOString().split("T")[1].slice(0, 8)
      : null;
    const sortedCreatedTime = sortedCreatedDate
      ? sortedCreatedDate.toISOString().split("T")[1].slice(0, 8)
      : null;

    const scheduledCreatedBy =
      scheduledItem.Employee.firstName + " " + scheduledItem.Employee.lastName;

    const dispatchedCreatedBy =
      dispatchItem.Employee.firstName + " " + dispatchItem.Employee.lastName;

    const receivedCreatedBy =
      receiveItem.Employee.firstName + " " + receiveItem.Employee.lastName;

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
        return employee ? `${employee.firstName} ${employee.lastName}` : null;
      })
      .filter((name) => name !== null)
      .join(", ");

    const updatedSortedWasteTransactions = sortItem.SortedWasteTransaction.map(
      (sortedWasteTransaction) => {
        const updatedTreatedWasteTransactions =
          sortedWasteTransaction.TreatedWasteTransaction.map(
            (treatedWasteTransaction) => {
              const machineName =
                treatedWasteTransaction.TreatmentMachine?.machineName || "";
              const treatmentProcess =
                treatedWasteTransaction.TreatmentProcess?.treatmentProcess ||
                "";
              const bookedTransactionId = scheduledItem.bookedTransactionId;

              return {
                ...treatedWasteTransaction,
                machineName,
                treatmentProcess,
                bookedTransactionId,
              };
            }
          );

        return {
          ...sortedWasteTransaction,
          TreatedWasteTransaction: updatedTreatedWasteTransactions,
        };
      }
    );

    return {
      ...sortItem,
      haulingDate: haulingDate ? haulingDate.toISOString().split("T")[0] : null,
      scheduledDate: scheduledDate
        ? scheduledDate.toISOString().split("T")[0]
        : null,
      dispatchedDate: dispatchedDate
        ? dispatchedDate.toISOString().split("T")[0]
        : null,
      receivedDate: receivedDate
        ? receivedDate.toISOString().split("T")[0]
        : null,
      sortedDate: sortedDate ? sortedDate.toISOString().split("T")[0] : null,
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
      transactionId: bookItem.transactionId ? bookItem.transactionId : null,
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
      sortedWasteTransaction: updatedSortedWasteTransactions,
      sortedScrapTransaction: sortItem.SortedScrapTransaction,
    };
  };

  const processData = useCallback(
    (response) => {
      const transactions = response.data;

      if (transactions) {
        if (Array.isArray(transactions.pendingTransactions)) {
          const flattenedPendingData = transactions.pendingTransactions.map(
            (sortItem) => processTransactionItem(sortItem, employeeData)
          );
          console.log(flattenedPendingData);
          setPendingTransactions(flattenedPendingData);
        }

        if (Array.isArray(transactions.finishedTransactions)) {
          const flattenedFinishedData = transactions.finishedTransactions.map(
            (sortItem) => processTransactionItem(sortItem, employeeData)
          );
          console.log(flattenedFinishedData);
          setFinishedTransactions(flattenedFinishedData);
        }
      }
    },
    [employeeData]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dispatchResponse, employeeResponse] = await Promise.all([
          axios.get(`${apiUrl}/certifiedTransaction`),
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

  const handleOpenModal = (row, waste) => {
    console.log(row);
    setFormData({
      row: row,
      waste: waste,
      isFinished: false,
      id: "",
      bookedTransactionId:
        row.ReceivedTransaction.DispatchedTransaction.ScheduledTransaction
          .bookedTransactionId,
      sortedTransactionId: row.id,
      sortedWasteTransactionId: waste.id,
      treatedWastes: [
        {
          treatedDate: null,
          treatedTime: null,
          treatmentProcessId: "",
          treatmentMachineId: "",
          weight: 0,
        },
      ],
      remarks: "",
      statusId: 6,
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

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Treated Waste Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/treatedTransaction/${row.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.bookedTransactionId,
          },
        }
      );
      console.log();
      processData(response);
      setSuccessMessage("Treated Waste Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = () => {
    let validationErrors = [];

    // Validate bookedTransactionId
    if (!formData.bookedTransactionId) {
      validationErrors.push("Booked Transaction ID is required.");
    }

    // Validate sortedWasteTransactionId
    if (!formData.sortedWasteTransactionId) {
      validationErrors.push("Sorted Waste Transaction ID is required.");
    }

    // Validate treatedWastes
    if (!formData.treatedWastes || formData.treatedWastes.length === 0) {
      validationErrors.push("At least one treated waste entry is required.");
    } else {
      formData.treatedWastes.forEach((waste, index) => {
        if (!waste.treatmentProcessId) {
          validationErrors.push(
            `Treatment Process is required for waste entry #${index + 1}.`
          );
        }
        if (!waste.treatmentMachineId) {
          validationErrors.push(
            `Treatment Machine is required for waste entry #${index + 1}.`
          );
        }
        if (!waste.treatedDate) {
          validationErrors.push(
            `Treated Date is required for waste entry #${index + 1}.`
          );
        }
        if (!waste.treatedTime) {
          validationErrors.push(
            `Treated Time is required for waste entry #${index + 1}.`
          );
        }
        if (waste.weight <= 0) {
          validationErrors.push(
            `Weight must be greater than zero for waste entry #${index + 1}.`
          );
        }
      });
    }

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(" "));
      setShowErrorMessage(true);
      return false;
    }

    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // Perform client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      const updatedFormData = updateIsFinished(formData);
      let response;

      if (!formData.id) {
        response = await axios.post(
          `${apiUrl}/treatedTransaction`,
          updatedFormData
        );
        processData(response);
        setSuccessMessage("Treated Transaction Submitted Successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateIsFinished = (formData) => {
    const updatedFormData = { ...formData };

    // Calculate total treated weight from treatedWastes array
    let totalTreatedWeight = formData.treatedWastes.reduce(
      (total, waste) => total + parseFloat(waste.weight || 0),
      0
    );

    totalTreatedWeight += formData.waste.treatedWeight;

    // Update sortedWasteTransaction with the total treated weight
    if (
      updatedFormData.row &&
      updatedFormData.row.sortedWasteTransaction &&
      updatedFormData.sortedWasteTransactionId
    ) {
      updatedFormData.row.sortedWasteTransaction =
        updatedFormData.row.sortedWasteTransaction.map((item) => {
          if (item.id === updatedFormData.sortedWasteTransactionId) {
            return {
              ...item,
              treatedWeight: totalTreatedWeight,
            };
          }
          return item;
        });

      // Check if all sortedWasteTransaction items are fully treated
      const isAllTreated = updatedFormData.row.sortedWasteTransaction.every(
        (item) => item.treatedWeight === item.weight
      );
      console.log("isAllTreated:", isAllTreated);
      updatedFormData.isFinished = isAllTreated;
    }

    return updatedFormData;
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
        buttonText={"Treat"}
        pendingTransactions={pendingTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
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
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
      />
    </Box>
  );
};

export default CertifiedTransactions;
