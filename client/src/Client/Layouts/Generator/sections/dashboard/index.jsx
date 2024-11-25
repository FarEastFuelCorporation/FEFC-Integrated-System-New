import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import { tokens } from "../../../../../theme";
import { ResponsivePie } from "@nivo/pie";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ApprovalIcon from "@mui/icons-material/Approval";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import WeekNavigator from "../../../../../OtherComponents/WeekNavigator";
import MonthNavigator from "../../../../../OtherComponents/MonthNavigator";
import DayNavigator from "../../../../../OtherComponents/DayNavigator";
import axios from "axios";
import {
  formatDate3,
  formatNumber,
  formatTime2,
} from "../../../../../OtherComponents/Functions";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import BillingStatementForm from "../../../../../OtherComponents/BillingStatement/BillingStatementForm";

const Dashboard = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const certificateRef = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state
  const [loadingRowId, setLoadingRowId] = useState(null);

  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pending, setPending] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [certified, setCertified] = useState(0);
  const [billed, setBilled] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [billedTransactions, setBilledTransactions] = useState([]);
  const [totals, setTotals] = useState([]);
  const [secondaryLoading, setSecondaryLoading] = useState([]);

  const [row, setRow] = useState(null);

  // useCallback to memoize fetchData function
  const fetchData = useCallback(async () => {
    // Return early if dependencies are invalid
    if (!startDate || !endDate || !user?.id) {
      console.error(
        "Invalid dependencies: startDate, endDate, or user.id is missing."
      );
      return;
    }

    try {
      setLoading(true); // Main loading state
      setSecondaryLoading(true); // Secondary loading state for the 2nd API call

      // Ensure dates are formatted correctly
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      // Start both fetch requests concurrently using Promise.all
      const [response, calculateResponse] = await Promise.all([
        axios.get(
          `${apiUrl}/api/bookedTransaction/dashboard/${formattedStartDate}/${formattedEndDate}/${user.id}`
        ),
        axios.get(
          `${apiUrl}/api/bookedTransaction/dashboard/full/${formattedStartDate}/${formattedEndDate}/${user.id}`
        ),
      ]);

      // Destructure data from the first response
      const {
        pendingCount,
        inProgressCount,
        certifiedCount,
        billedCount,
        allCount,
        billedTransactions,
        billedTransactionsDetail,
      } = response.data;

      // Update states related to the first API call
      setPending(pendingCount);
      setInProgress(inProgressCount);
      setCertified(certifiedCount);
      setBilled(billedCount);
      setAllCount(allCount);
      setTransactions(billedTransactionsDetail);
      console.log(billedTransactionsDetail);
      setBilledTransactions(billedTransactions);

      // Destructure data from the second response
      const { totals } = calculateResponse.data;

      // Update states related to the second API call
      setTotals(totals);

      // Set loading states to false
      setLoading(false); // For the first API call once it's done
      setSecondaryLoading(false); // For the second API call once it's done
    } catch (error) {
      // Handle error with descriptive messages
      console.error("Error fetching data:", error.message || error);
      console.error("Stack Trace:", error.stack || "No stack trace available");

      // Ensure both loading states are set to false in case of an error
      setLoading(false);
      setSecondaryLoading(false);
    }
  }, [apiUrl, startDate, endDate, user?.id]); // Ensure all dependencies are included

  // Effect to fetch data when startDate, endDate, selectedEmployee, or apiUrl changes
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependencies array includes fetchData which is memoized by useCallback

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenPDFInNewTab = () => {
    const input = certificateRef.current;

    if (!input) {
      console.error("PDF generation failed: certificateRef is not ready.");
      return;
    }

    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        const pdfOutput = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
        return;
      }

      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (pageIndex === 0) {
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        processPage(pageIndex + 1, pages);
      });
    };

    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
    setLoadingRowId(null);
    setRow(null);
  };

  const data = [
    { id: "Pending", label: "Pending", value: pending },
    { id: "In Progress", label: "In Progress", value: inProgress },
    { id: "Certified", label: "Certified", value: certified },
    { id: "Billed", label: "Billed", value: billed },
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "transactionId",
      headerName: "Transaction Id",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.transactionId;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "haulingDate",
      headerName: "Hauling Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return formatDate3(params.row.haulingDate);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "haulingTime",
      headerName: "Hauling Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return formatTime2(params.row.haulingTime);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        let status;
        const statusId = params.row.statusId;

        if (statusId === 1) {
          status = "BOOKED";
        } else if (statusId === 2) {
          status = "SCHEDULED";
        } else if (statusId === 3) {
          status = "DISPATCHED";
        } else if (statusId === 4) {
          status = "RECEIVED";
        } else if (statusId === 5) {
          status = "SORTED";
        } else if (statusId === 6) {
          status = "WARHOUSED IN";
        } else if (statusId === 7) {
          status = "WARHOUSED OUT";
        } else if (statusId === 8) {
          status = "TREATED";
        } else if (statusId === 9) {
          status = "CERTIFIED";
        } else if (statusId === 10) {
          status = "BILLED";
        } else if (statusId === 11) {
          status = "BILLING APPROVED";
        } else if (statusId === 12) {
          status = "BILLING DISTRIBUTED";
        } else if (statusId === 13) {
          status = "COLLECTED";
        }

        let value = {};
        value.value = status;

        return renderCellWithWrapText(value);
      },
    },
  ];

  const columnsSummary = [
    {
      field: "billingNumber",
      headerName: "Billing Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 100,
      valueGetter: (params) => {
        return params.row.billingNumber;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "billedDate",
      headerName: "Billed Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 100,
      valueGetter: (params) => {
        return formatDate3(params.row.billedDate);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "billedAmount",
      headerName: "Billed Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 100,
      valueGetter: (params) => {
        const billingNumber = params.row.billingNumber;

        // If secondaryLoading is true, show the CircularProgress
        if (secondaryLoading) {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={24} color="secondary" />
            </Box>
          );
        }

        // Retrieve the billedAmount from the totals object using the billingNumber
        const billingTotal = totals[billingNumber];

        // If there is a valid billingTotal, extract the billedAmount
        if (billingTotal && billingTotal.total) {
          return formatNumber(billingTotal.total); // Adjust this if you want a different amount type
        }

        // Return a placeholder or empty string if no billedAmount is found
        return "-";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 100,
      valueGetter: (params) => {
        const billingNumber = params.row.billingNumber;

        // If secondaryLoading is true, show the CircularProgress
        if (secondaryLoading) {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={24} color="secondary" />
            </Box>
          );
        }

        // Retrieve termsRemarks, terms, and haulingDate from totals
        const termsRemarks = totals[billingNumber]?.termsRemarks;
        const terms = totals[billingNumber]?.terms;
        const haulingDate = totals[billingNumber]?.haulingDate;
        const distributedDate = totals[billingNumber]?.distributedDate;

        // Helper function to add days to a date
        const addDaysToDate = (dateStr, daysToAdd) => {
          const date = new Date(dateStr);
          date.setDate(date.getDate() + daysToAdd);
          return date.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
        };

        let dueDate = "Pending"; // Default value if no condition is met

        if (termsRemarks === "UPON RECEIVING OF DOCUMENTS" && distributedDate) {
          // Add the terms to the distributedDate
          dueDate = formatDate3(addDaysToDate(distributedDate, terms));
        } else if (
          termsRemarks === "UPON HAULING" ||
          termsRemarks === "ON PICKUP" ||
          termsRemarks === "ON DELIVERY"
        ) {
          // Add the terms to the haulingDate
          dueDate = formatDate3(addDaysToDate(haulingDate, terms));
        }

        // Store the computed dueDate into the row for use in remainingDays column
        params.row.dueDate = dueDate;

        return dueDate;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "remainingDays",
      headerName: "Remaining Days",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 100,
      valueGetter: (params) => {
        const dueDate = params.row.dueDate;

        // If no due date is available, return "Pending"
        if (dueDate === "Pending") {
          return "Pending";
        }

        // Get the current date
        const currentDate = new Date();

        // Parse the dueDate string into a Date object
        const dueDateObj = new Date(dueDate);

        // Calculate the difference in time (milliseconds)
        const timeDifference = dueDateObj - currentDate;

        // If the due date is in the future, calculate the remaining days
        if (timeDifference > 0) {
          const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
          if (remainingDays > 1) {
            return `${remainingDays} Days`;
          } else if (remainingDays === 1) {
            return "1 Day";
          } else {
            return "Due Date"; // If remainingDays is 0, show "Due Date"
          }
        }

        // If the due date is in the past, calculate how overdue it is
        const overdueDays = Math.ceil(
          Math.abs(timeDifference) / (1000 * 3600 * 24)
        ); // Convert milliseconds to days
        if (overdueDays === 1) {
          return "1 Day Overdue";
        } else {
          return `${overdueDays} Days Overdue`;
        }
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "view",
      headerName: "View",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <Box sx={{ position: "relative" }}>
            {/* Render BillingStatementForm in a hidden position */}

            <Button
              color="secondary"
              variant="contained"
              disabled={loadingRowId === params.row.id}
              onClick={async () => {
                try {
                  const id = params.row.id; // Get the document ID
                  setLoadingRowId(id); // Track which row is loading

                  // Fetch the transaction details
                  const response = await axios.get(
                    `${apiUrl}/api/bookedTransaction/full/bill/${id}`
                  );

                  // Update the state with fetched data
                  setRow(response.data.transaction.transaction);
                } catch (error) {
                  console.error("Error fetching transaction details:", error);
                } finally {
                  // Reset loading row ID
                }
              }}
            >
              {loadingRowId === params.row.id ? "Loading..." : "View"}
            </Button>
          </Box>
        );
      },
    },
  ];

  // Memoize waitForRender with useCallback
  const waitForRender = useCallback(() => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (certificateRef.current) {
          clearInterval(interval); // Clear the interval once it's ready
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }, []);

  useEffect(() => {
    // If row has been updated, proceed to generate the PDF
    if (row) {
      // Wait for the form to render and then generate the PDF
      waitForRender().then(() => {
        handleOpenPDFInNewTab();
      });
    }
  }, [row, waitForRender]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
      </Box>
      <Box sx={{ position: "absolute", left: "-9999px", zIndex: -1 }}>
        {row && (
          <BillingStatementForm
            statementRef={certificateRef} // Pass ref here
            row={row} // Ensure `row` is correctly updated
          />
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: isMobile ? "100px" : "auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: isMobile ? "none" : "space-between",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          sx={{
            "& .Mui-selected": {
              backgroundColor: colors.greenAccent[400],
              boxShadow: "none",
              borderBottom: `1px solid ${colors.grey[100]}`,
            },
            "& .MuiTab-root > span": {
              paddingRight: "10px",
            },
          }}
        >
          <Tab label="Daily" />
          <Tab label="Weekly" />
          <Tab label="Monthly" />
        </Tabs>
        <Box mt={isMobile ? 0 : -3}>
          {selectedTab === 0 && (
            <DayNavigator setStartDate={setStartDate} setEndDate={setEndDate} />
          )}
          {selectedTab === 1 && (
            <WeekNavigator
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
          {selectedTab === 2 && (
            <MonthNavigator
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
        </Box>
      </Box>
      <hr />
      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={2.5}>
          <Card sx={{ minHeight: 90 }}>
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
                      Pending
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {pending}
                    </Typography>
                  </Box>
                  <PendingActionsIcon
                    sx={{ fontSize: 40, marginRight: 2 }}
                    color="secondary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
          {!isMobile && (
            <Card sx={{ minHeight: 90, marginTop: "20px" }}>
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
                        BIlled
                      </Typography>
                      <Typography variant="h4" color="textSecondary">
                        {billed}
                      </Typography>
                    </Box>
                    <ReceiptIcon
                      sx={{ fontSize: 40, marginRight: 2 }}
                      color="secondary"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={2.5}>
          <Card sx={{ minHeight: 90 }}>
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
                      In Progress
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {inProgress}
                    </Typography>
                  </Box>
                  <EventRepeatIcon
                    sx={{ fontSize: 40, marginRight: 2 }}
                    color="secondary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
          {!isMobile && (
            <Card sx={{ minHeight: 90, marginTop: "20px" }}>
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
                        Completion Rate
                      </Typography>
                      <Typography variant="h4" color="textSecondary">
                        {isNaN((billed / allCount) * 100)
                          ? "0.00%"
                          : formatNumber((billed / allCount) * 100) + "%"}
                      </Typography>
                    </Box>
                    <StarBorderPurple500Icon
                      sx={{ fontSize: 40, marginRight: 2 }}
                      color="secondary"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs={12} sm={2.5}>
          <Card sx={{ minHeight: 90 }}>
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
                      Certified
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {certified}
                    </Typography>
                  </Box>
                  <ApprovalIcon
                    sx={{ fontSize: 40, marginRight: 2 }}
                    color="secondary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
          {!isMobile && (
            <Card sx={{ minHeight: 90, marginTop: "20px" }}>
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
                        Total
                      </Typography>
                      <Typography variant="h4" color="textSecondary">
                        {allCount}
                      </Typography>
                    </Box>
                    <AssignmentIcon
                      sx={{ fontSize: 40, marginRight: 2 }}
                      color="secondary"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        {isMobile && (
          <>
            <Grid item xs={12} sm={2.5}>
              <Card sx={{ minHeight: 90 }}>
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
                          Billed
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {billed}
                        </Typography>
                      </Box>
                      <ReceiptIcon
                        sx={{ fontSize: 40, marginRight: 2 }}
                        color="secondary"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <Card sx={{ minHeight: 90 }}>
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
                          Completion Rate
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {isNaN((billed / allCount) * 100)
                            ? "0.00%"
                            : formatNumber((billed / allCount) * 100) + "%"}
                        </Typography>
                      </Box>
                      <StarBorderPurple500Icon
                        sx={{ fontSize: 40, marginRight: 2 }}
                        color="secondary"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <Card sx={{ minHeight: 90 }}>
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
                          Total
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {allCount}
                        </Typography>
                      </Box>
                      <AssignmentIcon
                        sx={{ fontSize: 40, marginRight: 2 }}
                        color="secondary"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Fourth Column for Pie Chart */}
        <Grid item xs={12} sm={4.5} sx={{ height: "200px" }}>
          <Card sx={{ height: "inherit" }}>
            <CardContent sx={{ height: "inherit" }}>
              <ResponsivePie
                data={data}
                colorBy="id"
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: colors.grey[100],
                      },
                    },
                    legend: {
                      text: {
                        fill: colors.grey[100],
                      },
                    },
                    ticks: {
                      line: {
                        stroke: colors.grey[100],
                        strokeWidth: 1,
                      },
                      text: {
                        fill: colors.grey[100],
                      },
                    },
                  },
                  legends: {
                    text: {
                      fill: colors.grey[100],
                    },
                  },
                }}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: isMobile ? 60 : 20,
                  left: 60,
                }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 10]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={colors.grey[100]}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 10]],
                }}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
                legends={[
                  {
                    anchor: `${isMobile ? "bottom" : "top-left"}`,
                    direction: `${isMobile ? "row" : "column"}`,
                    justify: false,
                    translateX: isMobile ? 0 : -50,
                    translateY: isMobile ? 50 : 0,
                    itemsSpacing: 10,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: colors.grey[100],
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 24,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#999",
                        },
                      },
                    ],
                    legendOffset: 10,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: isMobile ? 3 : 0 }}>
        <Grid item xs={12} sm={7.5}>
          <Card sx={{ minHeight: 450 }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  height: isMobile ? "100px" : "auto",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: isMobile ? "none" : "space-between",
                }}
              >
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    Details:
                  </Typography>
                </Box>
              </Box>
              <CustomDataGridStyles height={"372px"} margin={0}>
                <DataGrid
                  rows={transactions ? transactions : []}
                  columns={columns}
                  getRowId={(row) => row.id}
                  hideFooter
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "total", sort: "asc" }],
                    },
                  }}
                />
              </CustomDataGridStyles>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4.5}>
          <Card sx={{ minHeight: 450 }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  height: isMobile ? "100px" : "auto",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: isMobile ? "none" : "space-between",
                }}
              >
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    Billing Summary:
                  </Typography>
                </Box>
              </Box>
              <CustomDataGridStyles height={"372px"} margin={0}>
                <DataGrid
                  rows={billedTransactions ? billedTransactions : []}
                  columns={columnsSummary}
                  getRowId={(row) => row.id}
                  hideFooter
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "clientName", sort: "asc" }],
                    },
                  }}
                />
              </CustomDataGridStyles>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
