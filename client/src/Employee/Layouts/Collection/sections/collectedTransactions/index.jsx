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

const CollectionTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  // Create refs for the input fields
  const approvedDateRef = useRef();
  const approvedTimeRef = useRef();
  const remarksRef = useRef();

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    billingApprovalTransactionId: "",
    collectedDate: "",
    collectedTime: "",
    collectedAmount: 0,
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

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const billedTransactionResponse = await axios.get(
        `${apiUrl}/api/collectionTransaction`
      );
      // For pending transactions
      setPendingTransactions(
        billedTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        billedTransactionResponse.data.inProgressTransactions
      );
      console.log(billedTransactionResponse.data);
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
      bookedTransactionId: row.id,
      billingApprovalTransactionId:
        row.ScheduledTransaction[0].DispatchedTransaction[0]
          .ReceivedTransaction[0].SortedTransaction[0].CertifiedTransaction[0]
          .BilledTransaction[0].BillingApprovalTransaction.id,
      collectedDate: "",
      collectedTime: "",
      collectedAmount: 0,
      remarks: "",
      statusId: 9,
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
    const typeToEdit = inProgressTransactions.find(
      (type) => type.id === row.id
    );

    if (typeToEdit) {
      const certifiedTransaction =
        typeToEdit.ScheduledTransaction?.[0]?.DispatchedTransaction?.[0]
          ?.ReceivedTransaction?.[0]?.SortedTransaction?.[0]
          ?.CertifiedTransaction?.[0] || {};

      setFormData({
        id: certifiedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        sortedTransactionId:
          typeToEdit.ScheduledTransaction?.[0]?.DispatchedTransaction?.[0]
            ?.ReceivedTransaction?.[0]?.SortedTransaction?.[0].id,
        certificateNumber: certifiedTransaction.certificateNumber,
        certifiedDate: certifiedTransaction.certifiedDate,
        certifiedTime: certifiedTransaction.certifiedTime,
        typeOfCertificate: certifiedTransaction.typeOfCertificate,
        typeOfWeight: certifiedTransaction.typeOfWeight,
        remarks: certifiedTransaction.remarks,
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

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Billed Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/collectionTransaction/${row.ScheduledTransaction?.[0].DispatchedTransaction?.[0].ReceivedTransaction?.[0].SortedTransaction?.[0].CertifiedTransaction?.[0].BilledTransaction?.[0]?.BillingApprovalTransaction.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Collection Transaction Deleted Successfully!");
      setShowSuccessMessage(true);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = (data) => {
    let validationErrors = [];

    // Validate approvedTime
    if (!data.approvedDate) {
      validationErrors.push("Approved Date is required.");
    }

    // Validate approvedTime
    if (!data.approvedTime) {
      validationErrors.push("Approved Time is required.");
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
      approvedDate: approvedDateRef.current.value,
      approvedTime: approvedTimeRef.current.value,
      remarks: remarksRef.current.value,
    };

    // Perform client-side validation
    if (!validateForm(updatedFormData)) {
      return;
    }
    console.log(updatedFormData);
    try {
      setLoading(true);

      if (updatedFormData.id) {
        await axios.put(
          `${apiUrl}/api/collectionTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Collection Transaction Updated Successfully!");
      } else {
        await axios.post(
          `${apiUrl}/api/collectionTransaction`,
          updatedFormData
        );

        setSuccessMessage("Collection Transaction Submitted Successfully!");
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
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
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
      <Transaction
        user={user}
        buttonText={"Collected"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        setSuccessMessage={setSuccessMessage}
        setShowSuccessMessage={setShowSuccessMessage}
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
          approvedDateRef,
          approvedTimeRef,
          remarksRef,
        }}
      />
    </Box>
  );
};

export default CollectionTransactions;