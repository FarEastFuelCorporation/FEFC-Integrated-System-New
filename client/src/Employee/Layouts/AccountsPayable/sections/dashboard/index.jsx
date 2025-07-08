import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Header from "../../../../../OtherComponents/Header";
import {
  formatDate3,
  formatNumber,
} from "../../../../../OtherComponents/Functions";
import axios from "axios";
import { renderCellWithWrapText } from "../../../../../JD/OtherComponents/Functions";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Dashboard = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state

  const [openCardModal, setOpenCardModal] = useState(false);
  const [fundTransactions, setFundTransactions] = useState([]);
  const [selectedFundTransactions, setSelectedFundTransactions] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const cardData = [
    { title: "TRUCKING FUND", value: funds.truckingFund },
    { title: "DIESEL FUND", value: funds.dieselFund },
    { title: "GASOLINE FUND", value: funds.gasolineFund },
    { title: "SCRAP SALES", value: funds.scrapSales },
    { title: "TRUCK SCALE COLLECTION", value: funds.truckScaleCollection },
    { title: "HOUSE COLLECTION", value: funds.houseCollection },
    { title: "PURCHASE REQUEST FUND", value: funds.purchaseRequestFund },
    { title: "PURCHASE REQUEST PAYABLE", value: funds.purchaseRequestPayable },
    { title: "SIR RUEL'S FUND", value: funds.sirRuelFund },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fundTransactionResponse = await axios.get(
          `${apiUrl}/api/fundTransaction`
        );

        setFunds(fundTransactionResponse.data.funds);
        setFundTransactions(fundTransactionResponse.data.fundTransactions);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching employeeData:", error);
      }
    };

    fetchData();
  }, []);

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

  const handleCardClick = (item) => {
    setSelectedFund(item); // store the clicked card info

    const filtered = fundTransactions.filter((tx) => {
      return tx.fundSource === item.title || tx.fundAllocation === item.title;
    });

    setSelectedFundTransactions(filtered);
    setOpenCardModal(true);
  };

  const handleCloseCardModal = () => {
    setOpenCardModal(false);
    setSelectedFund(null);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        {cardData.map((item, index) => (
          <Grid item xs={12} sm={12 / 5} key={index}>
            <Card
              sx={{ minHeight: "115px", cursor: "pointer" }}
              onClick={() => handleCardClick(item)}
            >
              <CardContent>
                {loading ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="h4" color="textSecondary">
                        {formatNumber(item.value)}
                      </Typography>
                    </Box>
                    <MonetizationOnIcon
                      sx={{ fontSize: 40, marginRight: 2 }}
                      color="secondary"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={openCardModal} onClose={handleCloseCardModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedFund?.title}
          </Typography>
          <CustomDataGridStyles>
            <DataGrid
              rows={selectedFundTransactions ? selectedFundTransactions : []}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                sorting: {
                  sortModel: [{ field: "transactionDate", sort: "desc" }],
                },
              }}
            />
          </CustomDataGridStyles>

          <Button
            onClick={handleCloseCardModal}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
