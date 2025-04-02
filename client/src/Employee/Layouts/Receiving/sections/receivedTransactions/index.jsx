import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../HR/sections/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const ReceivedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    scheduledTransactionId: "",
    dispatchedTransactionId: "",
    receivedDate: "",
    receivedTime: "",
    vehicle: "",
    driver: "",
    pttNo: "",
    manifestNo: "",
    pullOutFormNo: "",
    truckScaleNo: "",
    manifestWeight: 0,
    clientWeight: 0,
    grossWeight: 0,
    tareWeight: 0,
    netWeight: 0,
    hasDemurrage: false,
    demurrageDays: 0,
    submitTo: "",
    remarks: "",
    statusId: 4,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [inProgressTransactions, setInProgressTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const receivedTransactionResponse = await axios.get(
        `${apiUrl}/api/receivedTransaction`
      );

      // Define the logisticsId to match
      const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

      // For pending transactions
      const filteredPendingTransactions =
        receivedTransactionResponse.data.pendingTransactions.filter(
          (transaction) =>
            (transaction.statusId === 2 &&
              transaction.ScheduledTransaction &&
              transaction.ScheduledTransaction[0].logisticsId !==
                matchingLogisticsId) ||
            transaction.statusId === 3
        );
      setPendingTransactions(filteredPendingTransactions);

      // For in-progress transactions
      setInProgressTransactions(
        receivedTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        receivedTransactionResponse.data.finishedTransactions
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (row) => {
    setFormData({
      id: "",
      bookedTransactionId: row.id,
      scheduledTransactionId: row.ScheduledTransaction[0].id,
      dispatchedTransactionId:
        row.ScheduledTransaction[0].DispatchedTransaction?.[0]?.id,
      receivedDate: "",
      receivedTime: "",
      vehicle: "",
      driver: "",
      pttNo: "",
      manifestNo: "",
      pullOutFormNo: "",
      truckScaleNo: "",
      manifestWeight: 0,
      clientWeight: 0,
      grossWeight: 0,
      tareWeight: 0,
      netWeight: 0,
      hasDemurrage: false,
      demurrageDays: 0,
      submitTo: "",
      remarks: "",
      statusId: 4,
      createdBy: user.id,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage("");
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
    const typeToEdit = row;
    if (typeToEdit) {
      const receivedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};
      setFormData({
        id: receivedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        scheduledTransactionId: typeToEdit.ScheduledTransaction?.[0]?.id,
        dispatchedTransactionId:
          typeToEdit.ScheduledTransaction?.[0]?.DispatchedTransaction?.[0]
            ?.id || "",
        receivedDate: receivedTransaction.receivedDate,
        receivedTime: receivedTransaction.receivedTime,
        vehicle: receivedTransaction.vehicle,
        driver: receivedTransaction.driver,
        pttNo: receivedTransaction.pttNo,
        manifestNo: receivedTransaction.manifestNo,
        pullOutFormNo: receivedTransaction.pullOutFormNo,
        truckScaleNo: receivedTransaction.truckScaleNo,
        manifestWeight: receivedTransaction.manifestWeight,
        clientWeight: receivedTransaction.clientWeight,
        grossWeight: receivedTransaction.grossWeight,
        tareWeight: receivedTransaction.tareWeight,
        netWeight: receivedTransaction.netWeight,
        hasDemurrage: receivedTransaction.hasDemurrage,
        demurrageDays: receivedTransaction.demurrageDays,
        submitTo: receivedTransaction.submitTo,
        remarks: receivedTransaction.remarks,
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

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Received Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/receivedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Received Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setOpenTransactionModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    // Perform client-side validation
    const {
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
    } = formData;

    // Collect validation errors
    let validationErrors = [];

    if (!receivedDate) validationErrors.push("Received Date is required.");
    if (!receivedTime) validationErrors.push("Received Time is required.");
    if (!formData.dispatchedTransactionId && !formData.vehicle)
      validationErrors.push("Plate Number is required.");
    if (!formData.dispatchedTransactionId && !formData.driver)
      validationErrors.push("Driver is required.");
    if (!pttNo) validationErrors.push("PTT No is required.");
    if (!manifestNo) validationErrors.push("Manifest No is required.");
    if (!pullOutFormNo) validationErrors.push("Pull-Out Form No is required.");
    if (!truckScaleNo) validationErrors.push("Truck Scale No is required.");
    if (manifestWeight == null)
      validationErrors.push("Manifest Weight is required.");
    if (clientWeight == null)
      validationErrors.push("Client Weight is required.");
    if (grossWeight == null) validationErrors.push("Gross Weight is required.");
    if (tareWeight == null) validationErrors.push("Tare Weight is required.");
    if (netWeight == null) validationErrors.push("Net Weight is required.");
    if (!submitTo) validationErrors.push("Submit To is required.");

    // If there are validation errors, show them and stop further processing
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(" "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/receivedTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Received Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/receivedTransaction`, formData);

        setSuccessMessage("Receive Transaction Submitted Successfully!");
      }

      fetchData();

      setShowSuccessMessage(true);
      setOpenTransactionModal(false);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
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
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      />
      <Transaction
        user={user}
        buttonText={"Receive"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        openTransactionModal={openTransactionModal}
        setOpenTransactionModal={setOpenTransactionModal}
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
      />
    </Box>
  );
};

export default ReceivedTransactions;
