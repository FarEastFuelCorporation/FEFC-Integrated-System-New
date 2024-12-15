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
  let warehousedItemsRef = useRef([
    {
      quotationWasteId: "",
      description: "",
      quantity: 0,
      weight: 0,
      clientWeight: 0,
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
    batchWeight: 0,
    totalWarehousedWeight: 0,
    discrepancyWeight: 0,
    warehousedItems: [
      {
        quotationWasteId: "",
        description: "",
        quantity: 0,
        weight: 0,
        clientWeight: 0,
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
  const [isDiscrepancy, setIsDiscrepancy] = useState(false);
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
      clientId: row.createdBy,
      bookedTransactionId: row.id,
      receivedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].id,
      warehousedDate: "",
      warehousedTime: "",
      batchWeight: row.ScheduledTransaction[0].ReceivedTransaction[0].netWeight,
      totalWarehousedWeight: 0,
      discrepancyWeight: 0,
      warehousedItems: [
        {
          quotationWasteId: "",
          description: "",
          quantity: 0,
          weight: 0,
          clientWeight: 0,
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
      remarks: "",
      statusId: 6,
      createdBy: user.id,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage("");
    setFormData({
      id: "",
      warehousedDate: "",
      warehousedTime: "",
      batchWeight: 0,
      totalWarehousedWeight: 0,
      discrepancyWeight: 0,
      warehousedItems: [
        {
          quotationWasteId: "",
          description: "",
          quantity: 0,
          weight: 0,
          clientWeight: 0,
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
      remarks: "",
      statusId: 6,
      createdBy: user.id,
    });
    warehousedItemsRef.current = [
      {
        quotationWasteId: "",
        description: "",
        quantity: 0,
        weight: 0,
        clientWeight: 0,
        gatePass: "",
        warehouse: "",
        area: "",
        section: "",
        level: "",
        palletNumber: "",
        steamNumber: "",
        unit: "",
      },
    ];
  };

  const handleEditClick = (row) => {
    const typeToEdit = row;

    if (typeToEdit) {
      const warehousedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .WarehousedTransaction?.[0] || {};

      setFormData({
        id: warehousedTransaction.id,
        clientId: typeToEdit.createdBy,
        bookedTransactionId: typeToEdit.id,
        receivedTransactionId:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0].id,
        warehousedDate: warehousedTransaction.warehousedDate,
        warehousedTime: warehousedTransaction.warehousedTime,
        batchWeight:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
            .netWeight,
        totalWarehousedWeight: warehousedTransaction.totalWarehousedWeight,
        discrepancyWeight: warehousedTransaction.discrepancyWeight,
        warehousedItems: warehousedTransaction.WarehousedTransactionItem
          ? warehousedTransaction.WarehousedTransactionItem.map((item) => ({
              warehousedTransactionId: item.warehousedTransactionId || "",
              quotationWasteId: item.quotationWasteId || "",
              description: item.description || "",
              unit: item.unit || "",
              quantity: item.quantity || 0,
              weight: item.weight || 0,
              clientWeight: item.clientWeight || 0,
              gatePass: item.gatePass || "",
              warehouse: item.warehouse || "",
              area: item.area || "",
              section: item.section || "",
              level: item.level || "",
              palletNumber: item.palletNumber || "",
              steamNumber: item.steamNumber || "",
            }))
          : [],
        remarks: warehousedTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      warehousedItemsRef.current =
        warehousedTransaction.WarehousedTransactionItem
          ? warehousedTransaction.WarehousedTransactionItem.map((item) => ({
              warehousedTransactionId: item.warehousedTransactionId || "",
              quotationWasteId: item.quotationWasteId || "",
              description: item.description || "",
              unit: item.unit || "",
              quantity: item.quantity || 0,
              weight: item.weight || 0,
              clientWeight: item.clientWeight || 0,
              gatePass: item.gatePass || "",
              warehouse: item.warehouse || "",
              area: item.area || "",
              section: item.section || "",
              level: item.level || "",
              palletNumber: item.palletNumber || "",
              steamNumber: item.steamNumber || "",
            }))
          : [];

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
      const items =
        warehousedItemsRefContent.current.querySelectorAll(`[id='item']`);

      // Collect warehoused items data
      const warehousedItemsData = [];
      let validationErrors = [];

      // Validate warehousedDate and warehousedTime
      const warehousedDateValue = warehousedDateRef.current.value.trim();
      const warehousedTimeValue = warehousedTimeRef.current.value.trim();

      if (!warehousedDateValue) {
        validationErrors.push("Warehoused Date is required.");
      }
      if (!warehousedTimeValue) {
        validationErrors.push("Warehoused Time is required.");
      }

      items.forEach((itemRef, index) => {
        if (!itemRef) return;

        const itemData = {
          description:
            itemRef.querySelector(`[name='description-${index}']`)?.value || "",
          unit: itemRef.querySelector(`[name='unit-${index}']`)?.value || "",
          quantity:
            itemRef.querySelector(`[name='quantity-${index}']`)?.value || 0,
          weight: itemRef.querySelector(`[name='weight-${index}']`)?.value || 0,
          clientWeight:
            itemRef.querySelector(`[name='clientWeight-${index}']`)?.value || 0,
          quotationWasteId:
            itemRef.querySelector(`[name='quotationWasteId-${index}']`)
              ?.value || "",
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

        // Collect errors
        let fieldErrors = [];
        if (!itemData.description) fieldErrors.push("Description is required.");
        if (!itemData.unit) fieldErrors.push("Unit is required.");
        if (itemData.quantity <= 0)
          fieldErrors.push("Quantity must be greater than 0.");
        if (itemData.weight <= 0)
          fieldErrors.push("Weight must be greater than 0.");
        if (!itemData.quotationWasteId)
          fieldErrors.push("Quotation Waste ID is required.");
        if (!itemData.gatePass) fieldErrors.push("Gate Pass is required.");
        if (!itemData.warehouse) fieldErrors.push("Warehouse is required.");
        if (!itemData.area) fieldErrors.push("Area is required.");
        if (!itemData.section) fieldErrors.push("Section is required.");
        if (!itemData.level) fieldErrors.push("Level is required.");
        if (!itemData.palletNumber)
          fieldErrors.push("Pallet Number is required.");
        if (!itemData.steamNumber)
          fieldErrors.push("Steam Number is required.");

        if (fieldErrors.length > 0) {
          validationErrors.push(`Item ${index + 1}: ${fieldErrors.join(", ")}`);
        } else {
          warehousedItemsData.push(itemData);
        }
      });

      // Remarks validation
      if (
        formData.discrepancyWeight !== 0 &&
        !remarksRef.current?.value.trim()
      ) {
        validationErrors.push(
          "Remarks: Remarks are required when Discrepancy Weight is not 0."
        );
      }

      // Concatenate and display validation errors
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join("\n");
        setErrorMessage(errorMessage); // Pass the concatenated string to state
        setShowErrorMessage(true);
        return;
      }

      // Set formData from refs before validation
      const updatedFormData = {
        ...formData,
        warehousedDate: warehousedDateRef.current?.value,
        warehousedTime: warehousedTimeRef.current?.value,
        remarks: remarksRef.current?.value || "",
        warehousedItems: warehousedItemsData,
      };

      // Simulate form submission (replace with your API call)
      console.log("Form Data:", updatedFormData);

      setLoading(true);

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
        setIsDiscrepancy={setIsDiscrepancy}
        isDiscrepancy={isDiscrepancy}
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
