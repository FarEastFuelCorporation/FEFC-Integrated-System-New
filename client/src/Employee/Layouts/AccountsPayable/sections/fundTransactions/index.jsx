import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import { renderCellWithWrapText } from "../../../../../JD/OtherComponents/Functions";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FundTransactionModal from "./FundTransactionModal";
import { FundTransactionValidation } from "./Validation";
import {
  formatDate3,
  formatNumber,
} from "../../../../../OtherComponents/Functions";

const fundLabels = [
  { label: "TRUCKING FUND", value: "truckingFund" },
  { label: "DIESEL FUND", value: "dieselFund" },
  { label: "GASOLINE FUND", value: "gasolineFund" },
  { label: "SCRAP SALES", value: "scrapSales" },
  { label: "TRUCK SCALE COLLECTION", value: "truckScaleCollection" },
  { label: "HOUSE COLLECTION", value: "houseCollection" },
  { label: "PURCHASE REQUEST FUND", value: "purchaseRequestFund" },
  { label: "PURCHASE REQUEST PAYABLE", value: "purchaseRequestPayable" },
  { label: "SIR RUEL'S FUND", value: "sirRuelFund" },
];

const FundTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    transactionNumber: "",
    transactionDate: "",
    fundSource: "",
    fundAllocation: "",
    amount: "",
    remarks: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [fundTransactions, setFundTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  const [funds, setFunds] = useState({
    truckingFund: 0,
    dieselFund: 0,
    gasolineFund: 0,
    scrapSales: 0,
    truckScaleCollection: 0,
    houseCollection: 0,
    purchaseRequestFund: 0,
    purchaseRequestPayable: 0,
    sirRuelFund: 0,
  });

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fundTransactionResponse = await axios.get(
        `${apiUrl}/api/fundTransaction`
      );

      setFunds(fundTransactionResponse.data.funds);
      setFundTransactions(fundTransactionResponse.data.fundTransactions);

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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
    setErrorMessage("");
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (row) => {
    if (row) {
      setFormData({
        id: row.id,
        transactionNumber: row.transactionNumber,
        transactionDate: row.transactionDate,
        fundSource: row.fundSource,
        fundAllocation: row.fundAllocation,
        amount: row.amount,
        remarks: row.remarks,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Commission Approval Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog(
      "Are you sure you want to Delete this Commission Approval Transaction?"
    );
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);

      const response = await axios.delete(
        `${apiUrl}/api/fundTransaction/${id}`,
        {
          data: {
            deletedBy: user.id,
          },
        }
      );

      const { fundSource, fundAllocation, amount } = response.data;

      // 🧠 Update fund balances
      setFunds((prevFunds) => {
        const sourceKey = fundLabels.find((f) => f.label === fundSource)?.value;
        const allocationKey = fundLabels.find(
          (f) => f.label === fundAllocation
        )?.value;

        return {
          ...prevFunds,
          ...(sourceKey && {
            [sourceKey]: (prevFunds[sourceKey] || 0) + amount,
          }),
          ...(allocationKey && {
            [allocationKey]: (prevFunds[allocationKey] || 0) - amount,
          }),
        };
      });

      // 🧠 Remove transaction from state
      setFundTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );

      setSuccessMessage("Fund Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setOpenTransactionModal(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const validationErrors = FundTransactionValidation(formData, errorMessage);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);

      let fundSource,
        fundAllocation,
        fundAmount = 0;

      if (formData.id) {
        const response = await axios.put(
          `${apiUrl}/api/fundTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Fund Transaction Updated Successfully!");

        // Update the state by replacing the updated transaction
        setFundTransactions((prev) =>
          prev.map((t) =>
            t.id === formData.id ? response.data.fundTransaction : t
          )
        );

        fundSource = response.data.fundTransaction.fundSource;
        fundAllocation = response.data.fundTransaction.fundAllocation;
        fundAmount = response.data.amountDifference;

        setSuccessMessage("Fund Transaction Updated Successfully!");
      } else {
        const response = await axios.post(
          `${apiUrl}/api/fundTransaction`,
          formData
        );

        // Add the new transaction to the top of the list
        setFundTransactions((prev) => [response.data.fundTransaction, ...prev]);

        fundSource = response.data.fundTransaction.fundSource;
        fundAllocation = response.data.fundTransaction.fundAllocation;
        fundAmount = response.data.fundTransaction.amount;

        setSuccessMessage("Fund Transaction Submitted Successfully!");
      }

      // ✅ Update funds state
      setFunds((prevFunds) => {
        // Convert label to key (assumes fundLabels is sorted the same way)
        const sourceKey =
          fundLabels.find((f) => f.label === fundSource)?.value || "";
        const allocationKey =
          fundLabels.find((f) => f.label === fundAllocation)?.value || "";

        return {
          ...prevFunds,
          ...(sourceKey && {
            [sourceKey]: (prevFunds[sourceKey] || 0) - fundAmount,
          }),
          ...(allocationKey && {
            [allocationKey]: (prevFunds[allocationKey] || 0) + fundAmount,
          }),
        };
      });

      setShowSuccessMessage(true);
      setOpenTransactionModal(false);
      handleCloseModal();

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "transactionNumber",
      headerName: "Transaction Number",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.transactionDate
          ? formatDate3(params.row.transactionDate)
          : "";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fundSource",
      headerName: "Fund Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fundAllocation",
      headerName: "Fund Allocation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.amount ? formatNumber(params.row.amount) : "";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.remarks ? params.row.remarks : "NO REMARKS";
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  if (user.userType === 12) {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    );
  }

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Fund Transactions"
          subtitle="List of Fund Transactions"
        />
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
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
      <CustomDataGridStyles>
        <DataGrid
          rows={fundTransactions ? fundTransactions : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "transactionNumber", sort: "desc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <FundTransactionModal
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        fundLabels={fundLabels}
        funds={funds}
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

export default FundTransactions;
