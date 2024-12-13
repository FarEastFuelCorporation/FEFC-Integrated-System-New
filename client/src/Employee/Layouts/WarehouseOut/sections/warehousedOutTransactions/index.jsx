import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../HR/sections/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const WarehousedOutTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const warehousedOutDateRef = useRef();
  const warehousedOutTimeRef = useRef();
  const remarksRef = useRef();
  const warehousedOutItemsRefContent = useRef();
  let warehousedOutItemsRef = useRef([
    {
      description: "",
      unit: "",
      quantity: 0,
      quantityOut: 0,
      remaining: 0,
    },
  ]);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    receivedTransactionId: "",
    warehousedOutDate: "",
    warehousedOutTime: "",
    warehousedItems: [
      [
        {
          description: "",
          unit: "",
          quantity: 0,
          quantityOut: 0,
          remaining: 0,
        },
      ],
    ],
    remarks: "",
    statusId: 7,
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
      const response = await axios.get(
        `${apiUrl}/api/warehousedOutTransaction`
      );

      // Helper function to filter by submitTo "SORTING"
      const filterBySubmitToWarehouse = (transactions) => {
        return transactions.filter((transaction) => {
          const scheduledTransaction = transaction.ScheduledTransaction?.[0];
          const receivedTransaction =
            scheduledTransaction?.ReceivedTransaction?.[0];
          return receivedTransaction?.submitTo === "WAREHOUSE";
        });
      };

      // For pending transactions
      const filteredPendingTransactions = filterBySubmitToWarehouse(
        response.data.pendingTransactions
      );
      setPendingTransactions(filteredPendingTransactions);

      // For in progress transactions
      const filteredInProgressTransactions = filterBySubmitToWarehouse(
        response.data.inProgressTransactions
      );
      setInProgressTransactions(filteredInProgressTransactions);

      // For finished transactions
      const filteredFinishedTransactions = filterBySubmitToWarehouse(
        response.data.finishedTransactions
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
    console.log(row);
    const warehousedTransaction =
      row.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
        .WarehousedTransaction?.[0] || {};

    setFormData({
      id: "",
      bookedTransactionId: row.id,
      warehousedTransactionId:
        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.WarehousedTransaction?.[0]?.id,
      warehousedOutDate: "",
      warehousedOutTime: "",
      remarks: "",
      statusId: 7,
      createdBy: user.id,
    });

    warehousedOutItemsRef.current =
      warehousedTransaction.WarehousedTransactionItem
        ? warehousedTransaction.WarehousedTransactionItem.map((item) => {
            const totalQuantityOut = item.WarehousedTransactionItemToOut
              ? item.WarehousedTransactionItemToOut.reduce(
                  (total, transaction) => total + (transaction.quantity || 0),
                  0
                )
              : 0;

            return {
              warehousedTransactionItemId: item.id || "",
              description: item.description || "",
              unit: item.unit || "",
              quantity: (item.quantity || 0) - totalQuantityOut,
              quantityOut: 0,
              remaining: (item.quantity || 0) - totalQuantityOut,
            };
          })
        : [];

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormData);
    warehousedOutItemsRef.current = [
      {
        description: "",
        unit: "",
        quantity: 0,
        quantityOut: 0,
        remaining: 0,
      },
    ];
  };

  const handleEditClick = (row) => {
    const typeToEdit = row;
    console.log(row);
    if (typeToEdit) {
      const warehousedOutTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .WarehousedTransaction?.[0]?.WarehousedOutTransaction?.[0] || {};

      const warehousedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .WarehousedTransaction?.[0] || {};

      setFormData({
        id: warehousedOutTransaction.id,
        bookedTransactionId: row.id,
        warehousedTransactionId:
          typeToEdit.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.WarehousedTransaction?.[0]?.id,
        warehousedOutDate: warehousedOutTransaction.warehousedOutDate,
        warehousedOutTime: warehousedOutTransaction.warehousedOutTime,
        remarks: warehousedOutTransaction.remarks,
        statusId: 7,
        createdBy: user.id,
      });

      warehousedOutItemsRef.current =
        warehousedTransaction.WarehousedTransactionItem
          ? warehousedTransaction.WarehousedTransactionItem.map((item) => {
              const totalQuantityOut = item.WarehousedTransactionItemToOut
                ? item.WarehousedTransactionItemToOut.reduce(
                    (total, transaction) => total + (transaction.quantity || 0),
                    0
                  )
                : 0;

              return {
                bookedTransactionId: row.id || "",
                warehousedTransactionItemId: item.id || "",
                description: item.description || "",
                unit: item.unit || "",
                quantity: item.quantity || 0,
                quantityOut: totalQuantityOut,
                remaining: (item.quantity || 0) - totalQuantityOut,
              };
            })
          : [];

      setOpenModal(true);
    } else {
      console.error(
        `Received Transaction with ID ${row.id} not found for editing.`
      );
    }
  };
  const handleDeleteClick = (row) => {
    console.log(row);
    setOpenDialog(true);
    setDialog(
      "Are you sure you want to Delete this Warehoused Out Transaction?"
    );
    setDialogAction(() => () => handleConfirmDelete(row));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/warehousedOutTransaction/${row.id}`, {
        data: {
          deletedBy: user.id,
          bookedTransactionId: row.bookedTransactionId,
        },
      });

      fetchData();
      setSuccessMessage("Warehoused Out Transaction deleted successfully!");
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

    try {
      const items =
        warehousedOutItemsRefContent.current.querySelectorAll(`[id='item']`);

      // Collect warehoused items data
      const warehousedOutItemsData = [];
      items.forEach((itemRef, index) => {
        if (!itemRef) return;

        const itemData = {
          description:
            itemRef.querySelector(`[name='description-${index}']`)?.value || "",
          unit: itemRef.querySelector(`[name='unit-${index}']`)?.value || "",
          quantity:
            itemRef.querySelector(`[name='quantity-${index}']`)?.value || 0,
          quantityOut:
            itemRef.querySelector(`[name='quantityOut-${index}']`)?.value || 0,
          remaining:
            itemRef.querySelector(`[name='remaining-${index}']`)?.value || 0,
          warehousedTransactionItemId:
            itemRef.querySelector(
              `[name='warehousedTransactionItemId-${index}']`
            )?.value || "",
        };

        // Validate itemData
        if (itemData.remaining < 0) {
          setErrorMessage(
            `Quantity Out must not be greater than the Quantity ${index + 1}`
          );

          setShowErrorMessage(true);
          throw new Error(
            `Quantity Out must not be greater than the Quantity ${index + 1}`
          );
        }

        warehousedOutItemsData.push(itemData);
      });

      setLoading(true);

      // Set formData from refs before validation
      const updatedFormData = {
        ...formData,
        warehousedOutDate: warehousedOutDateRef.current.value,
        warehousedOutTime: warehousedOutTimeRef.current.value,
        remarks: remarksRef.current.value,
        warehousedOutItems: warehousedOutItemsData,
      };

      if (updatedFormData.id) {
        await axios.put(
          `${apiUrl}/api/warehousedOutTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Warehoused Out Transaction Updated Successfully!");
      } else {
        await axios.post(
          `${apiUrl}/api/warehousedOutTransaction`,
          updatedFormData
        );

        setSuccessMessage("Warehoused Out Transaction Submitted Successfully!");
      }

      fetchData();

      console.log(updatedFormData);

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
        buttonText={"Warehouse Out"}
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
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
        refs={{
          warehousedOutDateRef,
          warehousedOutTimeRef,
          warehousedOutItemsRef,
          remarksRef,
        }}
        ref={warehousedOutItemsRefContent}
      />
    </Box>
  );
};

export default WarehousedOutTransactions;
