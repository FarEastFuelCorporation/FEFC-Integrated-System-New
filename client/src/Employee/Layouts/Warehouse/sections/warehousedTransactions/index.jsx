import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../HR/sections/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const getInitialWarehousedItemValues = () => ({
  warehousedTransactionId: "",
  gatePass: "",
  warehouse: "",
  area: "",
  section: "",
  level: "",
  palletNumber: "",
  steamNumber: "",
  quantity: 0,
  unit: "",
  description: "",
});

// Helper function to filter by submitTo "SORTING"
const filterBySubmitToSorting = (transactions) => {
  return transactions.filter((transaction) => {
    const scheduledTransaction = transaction.ScheduledTransaction?.[0];
    const receivedTransaction = scheduledTransaction?.ReceivedTransaction?.[0];
    return receivedTransaction?.submitTo === "WAREHOUSE";
  });
};

const WarehousedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const methods = useForm({
    defaultValues: {
      warehousedItems: [getInitialWarehousedItemValues()],
      warehousedDate: "",
      warehousedTime: "",
      remarks: "",
      statusId: 5,
      createdBy: user.id,
    },
  });

  const { reset, handleSubmit } = methods;

  const [openModal, setOpenModal] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [inProgressTransactions, setInProgressTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/api/warehousedTransaction`);

      setPendingTransactions(filterBySubmitToSorting(data.pendingTransactions));
      setInProgressTransactions(
        filterBySubmitToSorting(data.inProgressTransactions)
      );
      setFinishedTransactions(
        filterBySubmitToSorting(data.finishedTransactions)
      );

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
    const initialValues = {
      id: "",
      bookedTransactionId: row.id,
      receivedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].id,
      warehousedDate: "",
      warehousedTime: "",
      warehousedItems: [getInitialWarehousedItemValues()],
      remarks: "",
      statusId: 5,
      createdBy: user.id,
    };
    reset(initialValues); // Reset the form with initial values
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const handleEditClick = (row) => {
    const typeToEdit = inProgressTransactions.find(
      (type) => type.id === row.id
    );

    if (typeToEdit) {
      const warehousedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .SortedTransaction?.[0] || {};
      const initialValues = {
        id: warehousedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        receivedTransactionId:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0].id,
        warehousedDate: warehousedTransaction.warehousedDate,
        warehousedTime: warehousedTransaction.warehousedTime,
        warehousedItems: warehousedTransaction.WarehousedTransactionItem
          ? warehousedTransaction.WarehousedTransactionItem.map((item) => ({
              warehousedTransactionId: item.warehousedTransactionId || "",
              gatePass: item.gatePass || "",
              warehouse: item.warehouse || "",
              area: item.area || "",
              section: item.section || "",
              level: item.level || "",
              palletNumber: item.palletNumber || "",
              steamNumber: item.steamNumber || "",
              quantity: item.quantity || 0,
              unit: item.unit || "",
              description: item.description || "",
            }))
          : [getInitialWarehousedItemValues()],
        remarks: warehousedTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      };

      reset(initialValues); // Reset form data with fetched values
      setOpenModal(true);
    } else {
      console.error(
        `Received Transaction with ID ${row.id} not found for editing.`
      );
    }
  };
  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Warehoused Transaction?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/warehousedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].SortedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();
      setSuccessMessage("Received Transaction deleted successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (data.id) {
        await axios.put(`${apiUrl}/api/warehousedTransaction/${data.id}`, data);

        setSuccessMessage("Warehoused Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/warehousedTransaction`, data);

        setSuccessMessage("Warehoused Transaction Submitted Successfully!");
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
        buttonText={"Warehouse"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal
            user={user}
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmit(onSubmit)}
          />
        </form>
      </FormProvider>
    </Box>
  );
};

export default WarehousedTransactions;
