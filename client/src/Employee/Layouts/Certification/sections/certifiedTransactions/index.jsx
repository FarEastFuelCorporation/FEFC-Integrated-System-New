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

const CertifiedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    sortedTransactionId: "",
    warehousedTransactionId: "",
    submitTo: "",
    isBilled: false,
    certificateNumber: "",
    certifiedDate: "",
    certifiedTime: "",
    isDestruction: false,
    isDisposal: false,
    isAcceptance: false,
    isServiceReport: false,
    typeOfCertificate: "",
    typeOfWeight: "",
    remarks: "",
    statusId: 9,
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
      const certifiedTransactionResponse = await axios.get(
        `${apiUrl}/api/certifiedTransaction`
      );

      // For pending transactions
      setPendingTransactions(
        certifiedTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        certifiedTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        certifiedTransactionResponse.data.finishedTransactions
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
      sortedTransactionId:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.SortedTransaction?.[0]?.id,
      warehousedTransactionId:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.WarehousedTransaction?.[0]?.id,
      submitTo:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.submitTo,
      isBilled: row.BilledTransaction.length === 0 ? false : true,
      isBillingApproved: row.BilledTransaction?.[0]?.BillingApprovalTransaction
        ? true
        : false,
      certificateNumber: "",
      certifiedDate: "",
      certifiedTime: "",
      isDestruction: false,
      isDisposal: false,
      isAcceptance: false,
      isServiceReport: false,
      typeOfCertificate: "",
      typeOfWeight: "",
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
    const typeToEdit = row;

    if (typeToEdit) {
      const certifiedTransaction = typeToEdit.CertifiedTransaction?.[0] || {};

      const typeOfCertificateArray = certifiedTransaction.typeOfCertificate
        ? certifiedTransaction.typeOfCertificate.split(", ")
        : [];

      setFormData({
        id: certifiedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        sortedTransactionId:
          typeToEdit.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.SortedTransaction?.[0].id,
        warehousedTransactionId:
          typeToEdit.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.WarehousedTransaction?.[0]?.id,
        submitTo:
          typeToEdit.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.submitTo,
        certificateNumber: certifiedTransaction.certificateNumber,
        certifiedDate: certifiedTransaction.certifiedDate,
        certifiedTime: certifiedTransaction.certifiedTime,
        isDestruction:
          typeOfCertificateArray.includes("CERTIFICATE OF DESTRUCTION") ||
          false,
        isDisposal:
          typeOfCertificateArray.includes("CERTIFICATE OF DISPOSAL") || false,
        isAcceptance:
          typeOfCertificateArray.includes("CERTIFICATE OF ACCEPTANCE") || false,
        isServiceReport:
          typeOfCertificateArray.includes("SERVICE REPORT") || false,
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

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Certified Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/certifiedTransaction/${row.CertifiedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Certified Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setOpenTransactionModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateForm = () => {
    let validationErrors = [];

    let typeOfCertificate = [];

    if (formData.isDestruction) {
      typeOfCertificate.push("CERTIFICATE OF DESTRUCTION");
    }
    if (formData.isDisposal) {
      typeOfCertificate.push("CERTIFICATE OF DISPOSAL");
    }
    if (formData.isAcceptance) {
      typeOfCertificate.push("CERTIFICATE OF ACCEPTANCE");
    }
    if (formData.isServiceReport) {
      typeOfCertificate.push("SERVICE REPORT");
    }

    formData.typeOfCertificate = typeOfCertificate.join(", ");

    // Validate bookedTransactionId
    if (!formData.bookedTransactionId) {
      validationErrors.push("Booked Transaction ID is required.");
    }

    // Validate certifiedDate
    if (!formData.certifiedDate) {
      validationErrors.push("Certified Date is required.");
    }

    // Validate certifiedTime
    if (!formData.certifiedTime) {
      validationErrors.push("Certified Time is required.");
    }

    // Validate typeOfCertificate
    if (!formData.typeOfCertificate) {
      validationErrors.push("Type of Certificate is required.");
    }

    // Validate typeOfWeight
    if (!formData.typeOfWeight) {
      validationErrors.push("Type of Weight is required.");
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

    // Perform client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/certifiedTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Certified Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/certifiedTransaction`, formData);

        setSuccessMessage("Certified Transaction Submitted Successfully!");
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
        buttonText={"Certify"}
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
      />
    </Box>
  );
};

export default CertifiedTransactions;
