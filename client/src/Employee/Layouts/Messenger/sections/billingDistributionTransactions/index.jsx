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

const BillingDistributionTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  // Create refs for the input fields
  const distributedDateRef = useRef();
  const distributedTimeRef = useRef();
  const remarksRef = useRef();

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    billingApprovalTransactionId: "",
    distributedDate: "",
    distributedTime: "",
    collectedAmount: 0,
    remarks: "",
    statusId: 12,
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
      const billingDistributionTransactionResponse = await axios.get(
        `${apiUrl}/api/billingDistributionTransaction`
      );
      // For pending transactions
      setPendingTransactions(
        billingDistributionTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        billingDistributionTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        billingDistributionTransactionResponse.data.finishedTransactions
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
      billingApprovalTransactionId:
        row.BilledTransaction[0].BillingApprovalTransaction.id,
      collectedDate: "",
      collectedTime: "",
      collectedAmount: 0,
      remarks: "",
      statusId: 12,
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
      const billingDistributionTransaction =
        typeToEdit.BilledTransaction[0].BillingApprovalTransaction
          .BillingDistributionTransaction || {};

      setFormData({
        id: billingDistributionTransaction.id,
        bookedTransactionId: typeToEdit.id,
        billingApprovalTransactionId:
          typeToEdit.BilledTransaction?.[0].BillingApprovalTransaction.id,
        distributedDate: billingDistributionTransaction.distributedDate,
        distributedTime: billingDistributionTransaction.distributedTime,
        remarks: billingDistributionTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Billing Distribution Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog(
      "Are you sure you want to Delete this Billing Distribution Transaction?"
    );
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/billingDistributionTransaction/${row.BilledTransaction?.[0]?.BillingApprovalTransaction.BillingDistributionTransaction.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage(
        "Billing Distribution Transaction Deleted Successfully!"
      );
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

    // Validate distributedDate
    if (!data.distributedDate) {
      validationErrors.push("Distributed Date is required.");
    }

    // Validate distributedTime
    if (!data.distributedTime) {
      validationErrors.push("Distributed Time is required.");
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
      distributedDate: distributedDateRef.current.value,
      distributedTime: distributedTimeRef.current.value,
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
          `${apiUrl}/api/billingDistributionTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage(
          "Billing Distribution Transaction Updated Successfully!"
        );
      } else {
        await axios.post(
          `${apiUrl}/api/billingDistributionTransaction`,
          updatedFormData
        );

        setSuccessMessage(
          "Billing Distribution Transaction Submitted Successfully!"
        );
      }

      fetchData();

      setShowSuccessMessage(true);
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
        buttonText={"Distribute"}
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
          distributedDateRef,
          distributedTimeRef,
          remarksRef,
        }}
      />
    </Box>
  );
};

export default BillingDistributionTransactions;
