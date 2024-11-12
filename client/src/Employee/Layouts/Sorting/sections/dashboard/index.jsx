import { useState, useEffect, useMemo, useCallback } from "react";
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
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { ResponsivePie } from "@nivo/pie";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ScaleIcon from "@mui/icons-material/Scale";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import WeekNavigator from "../../../../../OtherComponents/WeekNavigator";
import MonthNavigator from "../../../../../OtherComponents/MonthNavigator";
import DayNavigator from "../../../../../OtherComponents/DayNavigator";
import axios from "axios";
import { formatNumber } from "../../../../../OtherComponents/Functions";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";

const Dashboard = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state

  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pending, setPending] = useState(0);
  const [onTime, setOnTime] = useState(0);
  const [onTimePercentage, setOnTimePercentage] = useState(0);
  const [late, setLate] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionsSummary, setTransactionsSummary] = useState([]);

  // useCallback to memoize fetchData function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Ensure dates are formatted correctly
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(
        `${apiUrl}/api/sortedTransaction/dashboard/${formattedStartDate}/${formattedEndDate}`
      );

      setPending(response.data.pending);
      setTotal(response.data.totalReceived);
      setOnTime(response.data.onTimeSorted);
      setOnTimePercentage(response.data.onTimeSortedPercentage);
      setLate(response.data.lateSorted);
      setTotalWeight(response.data.totalWeight);
      setTransactions(response.data.transaction);
      setTransactionsSummary(response.data.transactionSummary);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [apiUrl, startDate, endDate]); // Dependencies that trigger the callback

  // Effect to fetch data when startDate, endDate, selectedEmployee, or apiUrl changes
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependencies array includes fetchData which is memoized by useCallback

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const data = [
    { id: "Pending", label: "Pending", value: pending },
    { id: "On-Time", label: "On-Time", value: onTime },
    { id: "Late", label: "Late", value: late },
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "wasteName",
      headerName: "Waste Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "wasteCode",
      headerName: "Waste Code",
      headerAlign: "center",
      align: "center",
      width: 60,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "netWeight",
      headerName: "Weight",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.netWeight);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalSortedWeight",
      headerName: "Total Sorted Weight",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.totalSortedWeight);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "discrepancyWeight",
      headerName: "Discrepancy Weight",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.discrepancyWeight);
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  const columnsSummary = [
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "trips",
      headerName: "Trips",
      headerAlign: "center",
      align: "center",
      width: 80,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "netWeight",
      headerName: "Total Sorted Weight",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.netWeight) || "";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalSortedWeight",
      headerName: "Total Sorted Weight",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.totalSortedWeight);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "discrepancyWeight",
      headerName: "Discrepancy Weight",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return formatNumber(params.row.discrepancyWeight);
      },
      renderCell: renderCellWithWrapText,
    },
  ];

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
                      On-Time Sorted
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {onTime}
                    </Typography>
                  </Box>
                  <SentimentVerySatisfiedIcon
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
                        Pending To Sort
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
                      Late Sorted
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {late}
                    </Typography>
                  </Box>
                  <SentimentVeryDissatisfiedIcon
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
                        Client Satisfaction
                      </Typography>
                      <Typography variant="h4" color="textSecondary">
                        {onTimePercentage}%
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
                      Total Sorted
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {total}
                    </Typography>
                  </Box>
                  <CalendarMonthIcon
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
                        Total Sorted (KG)
                      </Typography>
                      <Typography variant="h4" color="textSecondary">
                        {formatNumber(totalWeight)}
                      </Typography>
                    </Box>
                    <ScaleIcon
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
                          Pending To Sort
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
                          Client Satisfaction
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {onTimePercentage}%
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
                          Total Sorted (KG)
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {formatNumber(totalWeight)}
                        </Typography>
                      </Box>
                      <ScaleIcon
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
                <Box mb={1}>
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
                      sortModel: [{ field: "clientName", sort: "asc" }],
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
                <Box mb={1}>
                  <Typography variant="h6" gutterBottom>
                    Summary:
                  </Typography>
                </Box>
              </Box>
              <CustomDataGridStyles height={"372px"} margin={0}>
                <DataGrid
                  rows={transactionsSummary ? transactionsSummary : []}
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
