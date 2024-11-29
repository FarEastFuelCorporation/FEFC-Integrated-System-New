import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import ReceiptIcon from "@mui/icons-material/Receipt";

const BilledTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  // Create refs for the input fields
  const billedDateRef = useRef();
  const billedTimeRef = useRef();
  const billingNumberRef = useRef();
  const serviceInvoiceNumberRef = useRef();
  const remarksRef = useRef();

  const initialFormData = {
    id: "",
    bookedTransactionId: [],
    isCertified: false,
    billedDate: "",
    billedTime: "",
    billingNumber: "",
    serviceInvoiceNumber: "",
    billedAmount: 0,
    remarks: "",
    statusId: 10,
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
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const billedTransactionResponse = await axios.get(
        `${apiUrl}/api/billedTransaction`
      );

      // For pending transactions
      setPendingTransactions(
        billedTransactionResponse.data.pendingTransactions
      );

      const filteredInProgressTransactions =
        billedTransactionResponse.data.inProgressTransactions.filter(
          (transaction) => transaction.BilledTransaction.length !== 0
        );

      // For in progress transactions
      console.log(billedTransactionResponse.data.inProgressTransactions);
      setInProgressTransactions(filteredInProgressTransactions);

      // For finished transactions
      setFinishedTransactions(
        billedTransactionResponse.data.finishedTransactions
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
      bookedTransactionId: selectedIds,
      isCertified:
        row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.SortedTransaction?.[0]?.CertifiedTransaction.length === 0
          ? false
          : true,
      billedDate: "",
      billedTime: "",
      billingNumber: "",
      serviceInvoiceNumber: "",
      billedAmount: 0,
      remarks: "",
      statusId: 10,
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

  const handleEditClick = (row) => {
    const typeToEdit = row;

    if (typeToEdit) {
      const billedTransaction = typeToEdit.BilledTransaction?.[0] || {};

      setFormData({
        id: billedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        isCertified:
          typeToEdit?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.SortedTransaction?.[0]?.CertifiedTransaction.length === 0
            ? false
            : true,
        certifiedTransactionId: [
          typeToEdit.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.SortedTransaction?.[0]?.CertifiedTransaction?.[0]
            ?.BilledTransaction?.[0]?.BilledCertified?.certifiedTransactionId,
        ],
        billedDate: billedTransaction.billedDate,
        billedTime: billedTransaction.billedTime,
        billingNumber: billedTransaction.billingNumber,
        serviceInvoiceNumber: billedTransaction.serviceInvoiceNumber,
        billedAmount: billedTransaction.billedAmount,
        remarks: billedTransaction.remarks,
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
    setDialog("Are you sure you want to Delete this Billed Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/billedTransaction/${row.BilledTransaction?.[0]?.id}`,
        {
          data: {
            deletedBy: user.id,
            isCertified:
              row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                ?.SortedTransaction?.[0]?.CertifiedTransaction.length === 0
                ? false
                : true,
          },
        }
      );

      fetchData();

      setSuccessMessage("Billed Transaction Deleted Successfully!");
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

    // Validate billedDate
    if (!data.billedDate) {
      validationErrors.push("Billed Date is required.");
    }

    // Validate billedTime
    if (!data.billedTime) {
      validationErrors.push("Billed Time is required.");
    }

    // Validate billingNumber
    if (!data.billingNumber) {
      validationErrors.push("BIlling Number is required.");
    }

    // Validate serviceInvoiceNumber
    if (!data.serviceInvoiceNumber) {
      validationErrors.push("Service Invoice Number is required.");
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
      billedDate: billedDateRef.current.value,
      billedTime: billedTimeRef.current.value,
      billingNumber: billingNumberRef.current.value,
      serviceInvoiceNumber: serviceInvoiceNumberRef.current.value,
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
          `${apiUrl}/api/billedTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Billed Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/billedTransaction`, updatedFormData);

        setSuccessMessage("Billed Transaction Submitted Successfully!");
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
        {user.userType === 8 && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <ReceiptIcon sx={{ fontSize: "40px" }} />
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
        buttonText={"Bill"}
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
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      <Modal
        user={user}
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
        refs={{
          billedDateRef,
          billedTimeRef,
          billingNumberRef,
          serviceInvoiceNumberRef,
          remarksRef,
        }}
      />
    </Box>
  );
};

export default BilledTransactions;
