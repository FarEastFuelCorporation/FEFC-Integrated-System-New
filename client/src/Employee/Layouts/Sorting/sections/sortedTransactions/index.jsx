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

const SortedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    clientId: "",
    bookedTransactionId: "",
    receivedTransactionId: "",
    sortedDate: "",
    sortedTime: "",
    batchWeight: 0,
    totalSortedWeight: 0,
    discrepancyWeight: 0,
    sortedWastes: [
      {
        quotationWasteId: "",
        treatmentProcessId: "",
        wasteName: "",
        weight: 0,
        clientWeight: 0,
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
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [inProgressTransactions, setInProgressTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isDiscrepancy, setIsDiscrepancy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const sortedTransactionResponse = await axios.get(
        `${apiUrl}/api/sortedTransaction`
      );
      // Helper function to filter by submitTo "SORTING"
      const filterBySubmitToSorting = (transactions) => {
        return transactions.filter((transaction) => {
          const scheduledTransaction = transaction.ScheduledTransaction?.[0];
          const receivedTransaction =
            scheduledTransaction?.ReceivedTransaction?.[0];
          return receivedTransaction?.submitTo === "SORTING";
        });
      };

      // For pending transactions
      const filteredPendingTransactions = filterBySubmitToSorting(
        sortedTransactionResponse.data.pendingTransactions
      );
      setPendingTransactions(filteredPendingTransactions);

      // For in progress transactions
      const filteredInProgressTransactions = filterBySubmitToSorting(
        sortedTransactionResponse.data.inProgressTransactions
      );
      setInProgressTransactions(filteredInProgressTransactions);

      // For finished transactions
      const filteredFinishedTransactions = filterBySubmitToSorting(
        sortedTransactionResponse.data.finishedTransactions
      );
      setFinishedTransactions(filteredFinishedTransactions);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [apiUrl]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (row) => {
    setFormData({
      id: "",
      statusId: row.statusId,
      clientId: row.Client.clientId,
      bookedTransactionId: row.id,
      receivedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].id,
      sortedDate: "",
      sortedTime: "",
      batchWeight: row.ScheduledTransaction[0].ReceivedTransaction[0].netWeight,
      totalSortedWeight: 0,
      discrepancyWeight: 0,
      sortedWastes: [
        {
          quotationWasteId: "",
          treatmentProcessId: "",
          wasteName: "",
          weight: 0,
          clientWeight: 0,
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
    const typeToEdit = row;

    if (typeToEdit) {
      const sortedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .SortedTransaction?.[0] || {};
      setFormData({
        id: sortedTransaction.id,
        clientId: typeToEdit.Client.clientId,
        bookedTransactionId: typeToEdit.id,
        receivedTransactionId:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0].id,
        sortedDate: sortedTransaction.sortedDate,
        sortedTime: sortedTransaction.sortedTime,
        batchWeight:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
            .netWeight,
        totalSortedWeight: sortedTransaction.totalSortedWeight,
        discrepancyWeight: sortedTransaction.discrepancyWeight,
        sortedWastes: sortedTransaction.SortedWasteTransaction
          ? sortedTransaction.SortedWasteTransaction.map((waste) => ({
              quotationWasteId: waste.quotationWasteId || "",
              treatmentProcessId: waste.treatmentProcessId || "",
              wasteName: waste.wasteName || "",
              weight: waste.weight || 0,
              clientWeight: waste.clientWeight || 0,
              formNo: waste.formNo || "",
            }))
          : [
              {
                quotationWasteId: "",
                treatmentProcessId: "",
                wasteName: "",
                weight: 0,
                clientWeight: 0,
                formNo: "",
              },
            ],
        sortedScraps: sortedTransaction.SortedScrapTransaction
          ? sortedTransaction.SortedScrapTransaction
          : [],
        remarks: sortedTransaction.remarks,
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
    setDialog("Are you sure you want to Delete this Sorted Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/sortedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].SortedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();
      setSuccessMessage("Sorted Transaction deleted successfully!");
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
            !waste.weight ||
            !waste.clientWeight ||
            !waste.quotationWasteId ||
            !waste.treatmentProcessId ||
            !waste.wasteName
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
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/sortedTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Sorted Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/sortedTransaction`, formData);

        setSuccessMessage("Sorted Transaction Submitted Successfully!");
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
        buttonText={"Sort"}
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
        setIsDiscrepancy={setIsDiscrepancy}
        isDiscrepancy={isDiscrepancy}
      />
    </Box>
  );
};

export default SortedTransactions;
