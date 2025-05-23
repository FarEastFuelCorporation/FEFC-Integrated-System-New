import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const CollectedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  // Create refs for the input fields
  const collectedDateRef = useRef();
  const collectedTimeRef = useRef();
  const billedAmountRef = useRef();
  const withHoldingTaxRef = useRef();
  const collectedAmountRef = useRef();
  const remarksRef = useRef();

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    billingApprovalTransactionId: "",
    collectedDate: "",
    collectedTime: "",
    billedAmount: 0,
    withHoldingTax: 0,
    collectedAmount: 0,
    remarks: "",
    statusId: 13,
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
      const collectionTransactionResponse = await axios.get(
        `${apiUrl}/api/collectionTransaction`
      );
      // For pending transactions
      setPendingTransactions(
        collectionTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        collectionTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        collectionTransactionResponse.data.finishedTransactions
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
      billingDistributionTransactionId:
        row.BilledTransaction[0].BillingApprovalTransaction
          .BillingDistributionTransaction.id,
      collectedDate: "",
      collectedTime: "",
      collectedAmount: 0,
      remarks: "",
      statusId: 13,
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

    if (name === "billedAmount") {
      setFormData({
        ...formData,
        [name]: value,
        withHoldingTax: value * 0.02,
        collectedAmount: value - value * 0.02,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditClick = (row) => {
    const typeToEdit = row;

    if (typeToEdit) {
      const collectedTransaction =
        typeToEdit.BilledTransaction[0].BillingApprovalTransaction
          .BillingDistributionTransaction.CollectedTransaction || {};

      setFormData({
        id: collectedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        billingApprovalTransactionId:
          collectedTransaction.billingDistributionTransactionId,
        collectedDate: collectedTransaction.collectedDate,
        collectedTime: collectedTransaction.collectedTime,
        billedAmount: collectedTransaction.billedAmount,
        withHoldingTax: collectedTransaction.withHoldingTax,
        collectedAmount: collectedTransaction.collectedAmount,
        remarks: collectedTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Dispatched Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Collected Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/collectionTransaction/${row.BilledTransaction?.[0]?.BillingApprovalTransaction.BillingDistributionTransaction.CollectedTransaction.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Collected Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setOpenTransactionModal(false);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateForm = (data) => {
    let validationErrors = [];

    // Validate collectedDate
    if (!data.collectedDate) {
      validationErrors.push("Collected Date is required.");
    }

    // Validate collectedTime
    if (!data.collectedTime) {
      validationErrors.push("Collected Time is required.");
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

    // Set formData from refs before validation
    const updatedFormData = {
      ...formData,
      collectedDate: collectedDateRef.current.value,
      collectedTime: collectedTimeRef.current.value,
      remarks: remarksRef.current.value,
    };

    // Perform client-side validation
    if (!validateForm(updatedFormData)) {
      return;
    }

    try {
      setLoading(true);

      if (updatedFormData.id) {
        await axios.put(
          `${apiUrl}/api/collectionTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Collected Transaction Updated Successfully!");
      } else {
        await axios.post(
          `${apiUrl}/api/collectionTransaction`,
          updatedFormData
        );

        setSuccessMessage("Collected Transaction Submitted Successfully!");
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
        buttonText={"Collect"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        setSuccessMessage={setSuccessMessage}
        setShowSuccessMessage={setShowSuccessMessage}
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
        refs={{
          collectedDateRef,
          collectedTimeRef,
          billedAmountRef,
          withHoldingTaxRef,
          collectedAmountRef,
          remarksRef,
        }}
      />
    </Box>
  );
};

export default CollectedTransactions;
