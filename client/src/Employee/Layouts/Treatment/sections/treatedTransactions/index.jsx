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

const TreatedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    waste: [],
    id: "",
    bookedTransactionId: "",
    sortedTransactionId: "",
    warehousedTransactionId: "",
    sortedWasteTransactionId: "",
    warehousedTransactionItemId: "",
    submitTo: "",
    treatedWastes: [
      {
        treatedDate: "",
        treatedTime: "",
        treatmentProcessId: "",
        treatmentMachineId: "",
        weight: 0,
      },
    ],
    remarks: "",
    statusId: 8,
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
      const treatedTransactionResponse = await axios.get(
        `${apiUrl}/api/treatedTransaction`
      );

      // // For pending transactions
      // setPendingTransactions(
      //   treatedTransactionResponse.data.pendingTransactions
      // );

      // // For in progress transactions
      // setInProgressTransactions(
      //   treatedTransactionResponse.data.inProgressTransactions
      // );

      // // For finished transactions
      // setFinishedTransactions(
      //   treatedTransactionResponse.data.finishedTransactions
      // );

      // Define excluded createdBy values
      const excludedCreators = ["GEN-142", "GEN-143"];

      // For pending transactions
      setPendingTransactions(
        treatedTransactionResponse.data.pendingTransactions.filter(
          (transaction) => !excludedCreators.includes(transaction.createdBy)
        )
      );

      // For in-progress transactions
      setInProgressTransactions(
        treatedTransactionResponse.data.inProgressTransactions.filter(
          (transaction) => !excludedCreators.includes(transaction.createdBy)
        )
      );

      // For finished transactions
      setFinishedTransactions(
        treatedTransactionResponse.data.finishedTransactions.filter(
          (transaction) => !excludedCreators.includes(transaction.createdBy)
        )
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

  const handleOpenModal = (row, waste) => {
    setFormData({
      row: row,
      waste: waste
        ? [
            {
              ...waste,
              treatedWastes: waste.treatedWastes || [
                {
                  treatedDate: "",
                  treatedTime: "",
                  treatmentProcessId: "",
                  treatmentMachineId: "",
                  weight: 0,
                },
              ],
              sortedWasteTransactionId: waste?.id,
            },
          ]
        : row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.SortedTransaction?.[0]?.SortedWasteTransaction.map(
            (w) => ({
              ...w,
              treatedWastes: w.treatedWastes || [
                {
                  treatedDate: "",
                  treatedTime: "",
                  treatmentProcessId: "",
                  treatmentMachineId: "",
                  weight: 0,
                },
              ],
              sortedWasteTransactionId: w?.id,
            })
          ),
      isFinished: false,
      id: "",
      bookedTransactionId: row.id,
      sortedTransactionId:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.SortedTransaction?.[0]?.id,
      warehousedTransactionId:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.WarehousedTransaction?.[0]?.id,
      sortedWasteTransactionId: waste?.id,
      warehousedTransactionItemId: waste?.id,
      isWaste: waste ? true : false,
      submitTo:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.submitTo,
      remarks: "",
      statusId: 8,
      createdBy: user.id,
    });
    setOpenModal(true);
  };

  console.log(formData);

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

  const handleDeleteClick = (row) => {
    setOpenDialog(true);
    setDialog(
      "Are you sure you want to Delete this Treated Waste Transaction?"
    );
    setDialogAction(() => () => handleConfirmDelete(row));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/treatedTransaction/${row.id}`, {
        data: {
          deletedBy: user.id,
          bookedTransactionId: row.bookedTransactionId,
          submitTo: row.submitTo,
        },
      });

      fetchData();

      setSuccessMessage("Treated Waste Transaction Deleted Successfully!");
      setOpenTransactionModal(false);
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateForm = () => {
    let validationErrors = [];

    // Validate bookedTransactionId
    if (!formData.bookedTransactionId) {
      validationErrors.push("Booked Transaction ID is required.");
    }

    // Validate waste and treatedWastes
    if (!formData.waste || formData.waste.length === 0) {
      validationErrors.push("At least one waste entry is required.");
    } else {
      formData.waste.forEach((waste, wasteIndex) => {
        if (!waste.sortedWasteTransactionId) {
          validationErrors.push(
            `Sorted Waste Transaction ID is required for waste #${
              wasteIndex + 1
            }.`
          );
        }

        if (!waste.treatedWastes || waste.treatedWastes.length === 0) {
          validationErrors.push(
            `At least one treated waste entry is required for waste #${
              wasteIndex + 1
            }.`
          );
        } else {
          waste.treatedWastes.forEach((treatedWaste, treatedIndex) => {
            if (!treatedWaste.treatmentProcessId) {
              validationErrors.push(
                `Treatment Process is required for treated waste entry #${
                  treatedIndex + 1
                } in waste #${wasteIndex + 1}.`
              );
            }
            if (!treatedWaste.treatmentMachineId) {
              validationErrors.push(
                `Treatment Machine is required for treated waste entry #${
                  treatedIndex + 1
                } in waste #${wasteIndex + 1}.`
              );
            }
            if (!treatedWaste.treatedDate) {
              validationErrors.push(
                `Treated Date is required for treated waste entry #${
                  treatedIndex + 1
                } in waste #${wasteIndex + 1}.`
              );
            }
            if (!treatedWaste.treatedTime) {
              validationErrors.push(
                `Treated Time is required for treated waste entry #${
                  treatedIndex + 1
                } in waste #${wasteIndex + 1}.`
              );
            }
            if (treatedWaste.weight <= 0) {
              validationErrors.push(
                `Weight must be greater than zero for treated waste entry #${
                  treatedIndex + 1
                } in waste #${wasteIndex + 1}.`
              );
            }
          });
        }
      });
    }

    // Calculate total weights for validation
    const scheduledTransaction = formData.row?.ScheduledTransaction?.[0];
    if (scheduledTransaction) {
      const receivedTransaction =
        scheduledTransaction?.ReceivedTransaction?.[0];
      if (receivedTransaction) {
        const sortedTransaction = receivedTransaction?.SortedTransaction?.[0];
        if (sortedTransaction) {
          // Total sorted weight
          const sortedWasteTransactions =
            sortedTransaction?.SortedWasteTransaction || [];
          const totalSortedWeight = sortedWasteTransactions.reduce(
            (total, wasteTransaction) =>
              total +
              (wasteTransaction.weight ? Number(wasteTransaction.weight) : 0),
            0
          );

          // Total treated weight (including treatedWastes within waste)
          let totalTreatedWeight = sortedWasteTransactions.reduce(
            (total, wasteTransaction) =>
              total +
              (wasteTransaction.treatedWeight
                ? Number(wasteTransaction.treatedWeight)
                : 0),
            0
          );

          totalTreatedWeight += formData.waste.reduce((total, waste) => {
            return (
              total +
              (waste.treatedWastes || []).reduce(
                (subTotal, treatedWaste) =>
                  subTotal +
                  (treatedWaste.weight ? Number(treatedWaste.weight) : 0),
                0
              )
            );
          }, 0);

          // Compare treated weight to sorted weight
          if (totalTreatedWeight > totalSortedWeight) {
            validationErrors.push(
              "Total treated weight exceeds the total sorted weight."
            );
          }
        }
      }
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

  const updateIsFinished = (formData) => {
    // Extract relevant data from the formData object
    const scheduledTransaction = formData.row?.ScheduledTransaction?.[0];
    if (!scheduledTransaction) return formData;

    const receivedTransaction = scheduledTransaction?.ReceivedTransaction?.[0];
    if (!receivedTransaction) return formData;

    const submitTo = receivedTransaction?.submitTo;

    const transaction =
      submitTo === "SORTING"
        ? receivedTransaction?.SortedTransaction?.[0]
        : receivedTransaction?.WarehousedTransaction?.[0];

    if (!transaction) return formData;

    // Get transaction items based on submitTo type
    const transactionItems =
      submitTo === "SORTING"
        ? transaction?.SortedWasteTransaction || []
        : transaction?.WarehousedTransactionItem || [];

    // Calculate the total weight
    const totalWarehousedWeight = transactionItems.reduce(
      (total, wasteTransaction) =>
        total + (wasteTransaction.weight ? Number(wasteTransaction.weight) : 0),
      0
    );

    // Calculate the total treated weight from transactionItems
    let totalTreatedWeight = transactionItems.reduce(
      (total, wasteTransaction) =>
        total +
        (wasteTransaction.treatedWeight
          ? Number(wasteTransaction.treatedWeight)
          : 0),
      0
    );

    // Add the treated weight from the waste array in formData
    const waste = formData.waste || [];
    totalTreatedWeight += waste.reduce((total, w) => {
      return (
        total +
        (w.treatedWastes || []).reduce(
          (subTotal, treatedWaste) =>
            subTotal + (treatedWaste.weight ? Number(treatedWaste.weight) : 0),
          0
        )
      );
    }, 0);

    // Update isFinished if totalWarehousedWeight matches totalTreatedWeight
    const isFinished = totalWarehousedWeight === totalTreatedWeight;

    // Return the updated formData with the isFinished flag
    return {
      ...formData,
      isFinished,
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const updatedFormData = updateIsFinished(formData);

      const { row, ...updatedDataWithoutRow } = updatedFormData;

      if (!formData.id) {
        await axios.post(
          `${apiUrl}/api/treatedTransaction`,
          updatedDataWithoutRow
        );
        setSuccessMessage("Treated Transaction Submitted Successfully!");
      }

      fetchData();

      setShowSuccessMessage(true);
      handleCloseModal();
      setOpenTransactionModal(false);
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
        buttonText={"Treat"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
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
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
      />
    </Box>
  );
};

export default TreatedTransactions;
