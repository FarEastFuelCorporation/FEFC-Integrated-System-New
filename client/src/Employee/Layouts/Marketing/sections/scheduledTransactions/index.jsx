import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const ScheduledTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    logisticsId: "",
    scheduledDate: "",
    scheduledTime: "",
    remarks: "",
    statusId: 2,
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
      const scheduledTransactionResponse = await axios.get(
        `${apiUrl}/api/scheduledTransaction`
      );

      // For pending transactions
      setPendingTransactions(
        scheduledTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        scheduledTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        scheduledTransactionResponse.data.finishedTransactions
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
      logisticsId: "",
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
    const typeToEdit = row;

    if (typeToEdit) {
      const scheduledTransaction = typeToEdit.ScheduledTransaction?.[0];

      setFormData({
        id: scheduledTransaction?.id,
        bookedTransactionId: typeToEdit.id,
        logisticsId: scheduledTransaction.logisticsId,
        scheduledDate: scheduledTransaction?.scheduledDate,
        scheduledTime: scheduledTransaction?.scheduledTime,
        remarks: scheduledTransaction?.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(`Vehicle type with ID ${row.id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Scheduled Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      // Make the delete request
      await axios.delete(
        `${apiUrl}/api/scheduledTransaction/${row.ScheduledTransaction[0].id}`,
        {
          data: { deletedBy: user.id },
        }
      );

      // Filter out the deleted transaction from each state
      // setPendingTransactions((prevPendingTransactions) =>
      //   prevPendingTransactions.filter(
      //     (transaction) => transaction.id !== row.id
      //   )
      // );
      // setInProgressTransactions((prevInProgressTransactions) =>
      //   prevInProgressTransactions.filter(
      //     (transaction) => transaction.id !== row.id
      //   )
      // );
      // setFinishedTransactions((prevFinishedTransactions) =>
      //   prevFinishedTransactions.filter(
      //     (transaction) => transaction.id !== row.id
      //   )
      // );
      fetchData();
      // Display success message
      setSuccessMessage("Scheduled Transaction Deleted Successfully!");
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
    const { scheduledDate, scheduledTime, logisticsId, statusId, createdBy } =
      formData;

    if (
      !scheduledDate ||
      !scheduledTime ||
      !logisticsId ||
      !statusId ||
      !createdBy
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      let newTransaction;
      setLoading(true);
      if (formData.id) {
        newTransaction = await axios.put(
          `${apiUrl}/api/scheduledTransaction/${formData.id}`,
          formData
        );
        // Update the existing transaction in each state
        // Remove old entry and add the updated one in each state
        // setPendingTransactions((prevPendingTransactions) => [
        //   ...prevPendingTransactions.filter(
        //     (transaction) => transaction.id !== formData.id
        //   ),
        //   ...newTransaction.data.pendingTransactions,
        // ]);

        // setInProgressTransactions((prevInProgressTransactions) => [
        //   ...prevInProgressTransactions.filter(
        //     (transaction) => transaction.id !== formData.id
        //   ),
        //   ...newTransaction.data.inProgressTransactions,
        // ]);

        // setFinishedTransactions((prevFinishedTransactions) => [
        //   ...prevFinishedTransactions.filter(
        //     (transaction) => transaction.id !== formData.id
        //   ),
        //   ...newTransaction.data.finishedTransactions,
        // ]);
        setSuccessMessage("Scheduled Transaction Updated Successfully!");
      } else {
        newTransaction = await axios.post(
          `${apiUrl}/api/scheduledTransaction`,
          formData
        );

        // Merging new data with previous state data
        // setPendingTransactions((prevPendingTransactions) => [
        //   ...prevPendingTransactions,
        //   ...newTransaction.data.pendingTransactions,
        // ]);

        // setInProgressTransactions((prevInProgressTransactions) => [
        //   ...prevInProgressTransactions,
        //   ...newTransaction.data.inProgressTransactions,
        // ]);

        // setFinishedTransactions((prevFinishedTransactions) => [
        //   ...prevFinishedTransactions,
        //   ...newTransaction.data.finishedTransactions,
        // ]);
        setSuccessMessage("Scheduled Transaction Submitted Successfully!");
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

  const handleDeleteClickBook = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Cancel this Book Transaction?");
    setDialogAction(() => () => handleConfirmDeleteBook(id));
  };

  const handleConfirmDeleteBook = async (row) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/bookedTransaction/${row.id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();

      setSuccessMessage("Booked Transaction Canceled Successfully!");
      setShowSuccessMessage(true);
      setOpenTransactionModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
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
        buttonText={"Schedule"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleDeleteClickBook={handleDeleteClickBook}
        openTransactionModal={openTransactionModal}
        setOpenTransactionModal={setOpenTransactionModal}
        hasCancel={true}
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
        schedule={true}
      />
    </Box>
  );
};

export default ScheduledTransactions;
