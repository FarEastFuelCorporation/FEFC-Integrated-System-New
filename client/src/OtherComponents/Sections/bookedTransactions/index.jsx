import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import LoadingSpinner from "../../LoadingSpinner";
import Header from "../../Header";
import SuccessMessage from "../../SuccessMessage";
import ConfirmationDialog from "../../ConfirmationDialog";
import Transaction from "../../Transaction";
import Modal from "../../Modal";

const BookedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = useMemo(
    () => ({
      id: "",
      transporterClientId: "",
      quotationWasteId: "",
      quotationTransportationId: "",
      haulingDate: "",
      haulingTime: "",
      pttNo: "",
      manifestNo: "",
      pullOutFormNo: "",
      remarks: "",
      statusId: 1,
      createdBy: user.id,
    }),
    [user.id]
  );

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
      const bookedTransactionResponse = await axios.get(
        `${apiUrl}/api/bookedTransaction`,
        {
          params: { user: user.id },
        }
      );

      // For pending transactions
      setPendingTransactions(
        bookedTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        bookedTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        bookedTransactionResponse.data.finishedTransactions
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  }, [apiUrl, user.id]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => setFormData(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleEditClick = useCallback(
    (row) => {
      const typeToEdit = pendingTransactions.find((type) => type.id === row.id);
      if (typeToEdit) {
        setFormData({
          ...typeToEdit,
          statusId: 1,
          createdBy: user.id,
        });
        handleOpenModal();
      } else {
        console.error(
          `Booked Transaction with ID ${row.id} not found for editing.`
        );
      }
    },
    [pendingTransactions, user.id]
  );

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Book Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/bookedTransaction/${row.id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Booked Transaction Deleted Successfully!");
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

    const {
      haulingDate,
      haulingTime,
      quotationWasteId,
      quotationTransportationId,
      statusId,
      createdBy,
    } = formData;

    if (
      !haulingDate ||
      !haulingTime ||
      !quotationWasteId ||
      !quotationTransportationId ||
      !statusId ||
      !createdBy
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/bookedTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Booked Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/bookedTransaction`, formData);
        setSuccessMessage("Booked Transaction Submitted Successfully!");
      }

      fetchData();
      setOpenTransactionModal(false);
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
        {user.userType === "GEN" ||
          (user.userType === "TRP" && (
            <Box display="flex">
              <IconButton onClick={handleOpenModal}>
                <PostAddIcon sx={{ fontSize: "40px" }} />
              </IconButton>
            </Box>
          ))}
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
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default BookedTransactions;
