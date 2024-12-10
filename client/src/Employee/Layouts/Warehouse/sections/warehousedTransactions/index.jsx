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

const WarehousedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const warehousedDateRef = useRef();
  const warehousedTimeRef = useRef();
  const remarksRef = useRef();
  const warehousedItemsRefContent = useRef();
  const warehousedItemsRef = useRef([
    {
      description: "",
      quantity: 0,
      gatePass: "",
      warehouse: "",
      area: "",
      section: "",
      level: "",
      palletNumber: "",
      steamNumber: "",
      unit: "",
    },
  ]);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    receivedTransactionId: "",
    warehousedDate: "",
    warehousedTime: "",
    warehousedItems: [
      [
        {
          description: "",
          quantity: 0,
          gatePass: "",
          warehouse: "",
          area: "",
          section: "",
          level: "",
          palletNumber: "",
          steamNumber: "",
          unit: "",
        },
      ],
    ],
    remarks: "",
    statusId: 6,
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
      const response = await axios.get(`${apiUrl}/api/warehousedTransaction`);

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
    setFormData({
      id: "",
      bookedTransactionId: row.id,
      receivedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].id,
      warehousedDate: "",
      warehousedTime: "",
      warehousedItems: [
        [
          {
            description: "",
            quantity: 0,
            gatePass: "",
            warehouse: "",
            area: "",
            section: "",
            level: "",
            palletNumber: "",
            steamNumber: "",
            unit: "",
          },
        ],
      ],
      remarks: "",
      statusId: 6,
      createdBy: user.id,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditClick = (row) => {
    const typeToEdit = row;

    if (typeToEdit) {
      const warehousedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .SortedTransaction?.[0] || {};

      setFormData({
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
          : [],
        remarks: warehousedTransaction.remarks,
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
  const handleDeleteClick = (row) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Warehoused Transaction?");
    setDialogAction(() => () => handleConfirmDelete(row));
  };

  const handleConfirmDelete = async (row) => {
    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/warehousedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].WarehousedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();
      setSuccessMessage("Warehoused In Transaction deleted successfully!");
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
      // setLoading(true);

      console.log(warehousedItemsRefContent);

      console.log(
        warehousedItemsRefContent.current.querySelectorAll(`[id='item']`)
      );

      const items =
        warehousedItemsRefContent.current.querySelectorAll(`[id='item']`);

      // Collect warehoused items data
      const warehousedItemsData = [];
      items.forEach((itemRef, index) => {
        if (!itemRef) return;

        const itemData = {
          description:
            itemRef.querySelector(`[name='description-${index}']`)?.value || "",
          unit: itemRef.querySelector(`[name='unit-${index}']`)?.value || "",
          quantity:
            itemRef.querySelector(`[name='quantity-${index}']`)?.value || 0,
          gatePass:
            itemRef.querySelector(`[name='gatePass-${index}']`)?.value || "",
          warehouse:
            itemRef.querySelector(`[name='warehouse-${index}']`)?.value || "",
          area: itemRef.querySelector(`[name='area-${index}']`)?.value || "",
          section:
            itemRef.querySelector(`[name='section-${index}']`)?.value || "",
          level: itemRef.querySelector(`[name='level-${index}']`)?.value || "",
          palletNumber:
            itemRef.querySelector(`[name='palletNumber-${index}']`)?.value ||
            "",
          steamNumber:
            itemRef.querySelector(`[name='steamNumber-${index}']`)?.value || "",
        };

        // Validate itemData
        if (!itemData.description || itemData.quantity <= 0) {
          throw new Error(`Invalid data for item ${index + 1}`);
        }

        warehousedItemsData.push(itemData);
      });

      // Set formData from refs before validation
      const updatedFormData = {
        ...formData,
        warehousedDate: warehousedDateRef.current.value,
        warehousedTime: warehousedTimeRef.current.value,
        remarks: remarksRef.current.value,
        warehousedItems: warehousedItemsData,
      };

      console.log(updatedFormData);

      if (updatedFormData.id) {
        await axios.put(
          `${apiUrl}/api/warehousedTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Warehoused In Transaction Updated Successfully!");
      } else {
        await axios.post(
          `${apiUrl}/api/warehousedTransaction`,
          updatedFormData
        );

        setSuccessMessage("Warehoused In Transaction Submitted Successfully!");
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
        buttonText={"Warehouse In"}
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
          warehousedDateRef,
          warehousedTimeRef,
          warehousedItemsRef,
          remarksRef,
        }}
        ref={warehousedItemsRefContent}
      />
    </Box>
  );
};

export default WarehousedTransactions;
