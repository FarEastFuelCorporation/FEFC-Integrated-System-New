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
import Header from "../../Header";
import { tokens } from "../../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { ResponsivePie } from "@nivo/pie";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaidIcon from "@mui/icons-material/Paid";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ScaleIcon from "@mui/icons-material/Scale";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import axios from "axios";
import { formatNumber } from "../../Functions";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import DayNavigator from "../../DayNavigator";
import WeekNavigator from "../../WeekNavigator";
import MonthNavigator from "../../MonthNavigator";
import StatCard from "../../StatCard";

const DashboardJD = ({ user, socket }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state

  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summary, setSummary] = useState({});
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

      const response = await axios.get(`${apiUrl}/apiJD/ledger/summary`);

      const responseInventory = await axios.get(`${apiUrl}/apiJD/inventory`);

      const unusedInventories = responseInventory.data.inventory.reduce(
        (sum, item) => {
          return (
            sum + item.updatedQuantity.toFixed(2) * item.unitPrice.toFixed(2)
          );
        },
        0
      );

      setSummary({
        ...response.data.summary,
        "UNUSED INVENTORIES": unusedInventories,
      });

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
    {
      id: "CASH ON HAND",
      label: "CASH ON HAND",
      value: (summary["CASH ON HAND"] || 0).toFixed(2), // Fallback to 0 if undefined or null
    },
    {
      id: "UNSOLD GOODS",
      label: "UNSOLD GOODS",
      value: (summary["UNSOLD GOODS"] || 0).toFixed(2),
    },
    {
      id: "UNUSED INVENTORIES",
      label: "UNUSED INVENTORIES",
      value: (summary["UNUSED INVENTORIES"] || 0).toFixed(2),
    },
    {
      id: "EQUIPMENTS",
      label: "EQUIPMENTS",
      value: (summary["EQUIPMENTS"] || 0).toFixed(2),
    },
    {
      id: "EQUIPMENT FUNDS",
      label: "EQUIPMENT FUNDS",
      value: (summary["EQUIPMENT FUNDS"] || 0).toFixed(2),
    },
    {
      id: "UTILITIES",
      label: "UTILITIES",
      value: (summary["UTILITIES"] || 0).toFixed(2),
    },
    {
      id: "LABOR",
      label: "LABOR",
      value: (summary["LABOR"] || 0).toFixed(2),
    },
    {
      id: "TRANSPORTATION",
      label: "TRANSPORTATION",
      value: (summary["TRANSPORTATION"] || 0).toFixed(2),
    },
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transactionDetails",
      headerName: "Transaction Details",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
  ];

  const columnsSummary = [
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transactionDetails",
      headerName: "Transaction Details",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
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
          <Tab label="SUMMARY" />
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
                <StatCard
                  title={"Cash On Hand"}
                  value={formatNumber(summary["CASH ON HAND"])}
                  Icon={PaidIcon}
                />
              )}
            </CardContent>
          </Card>
          {!isMobile && (
            <>
              <Card sx={{ minHeight: 90, marginTop: "20px" }}>
                <CardContent>
                  {loading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <StatCard
                      title={"Equipment Value"}
                      value={formatNumber(summary["EQUIPMENTS"])}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
              <Card sx={{ minHeight: 90, marginTop: "20px" }}>
                <CardContent>
                  {loading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <StatCard
                      title={"Labor Fund"}
                      value={formatNumber(summary["LABOR"])}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={2.5}>
          <Card sx={{ minHeight: 90 }}>
            <CardContent>
              {loading ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                <StatCard
                  title={"Unsold Goods"}
                  value={formatNumber(summary["UNSOLD GOODS"])}
                  Icon={PaidIcon}
                />
              )}
            </CardContent>
          </Card>
          {!isMobile && (
            <>
              <Card sx={{ minHeight: 90, marginTop: "20px" }}>
                <CardContent>
                  {loading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <StatCard
                      title={"Equipment Funds"}
                      value={formatNumber(summary["EQUIPMENT FUNDS"])}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
              <Card sx={{ minHeight: 90, marginTop: "20px" }}>
                <CardContent>
                  {loading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <StatCard
                      title={"Transportation Funds"}
                      value={formatNumber(summary["TRANSPORTATION"])}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={2.5}>
          <Card sx={{ minHeight: 90 }}>
            <CardContent>
              {loading ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                <StatCard
                  title={"Unused Inventories"}
                  value={formatNumber(summary["UNUSED INVENTORIES"])}
                  Icon={PaidIcon}
                />
              )}
            </CardContent>
          </Card>
          {!isMobile && (
            <>
              <Card sx={{ minHeight: 90, marginTop: "20px" }}>
                <CardContent>
                  {loading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <StatCard
                      title={"Utilities Funds"}
                      value={formatNumber(summary["UTILITIES"])}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
              <Card sx={{ minHeight: 90, marginTop: "20px" }}>
                <CardContent>
                  {loading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <StatCard
                      title={"Total"}
                      value={formatNumber(
                        summary["TOTAL"] + summary["UNUSED INVENTORIES"]
                      )}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
            </>
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
                    <StatCard
                      title={"Equipment Value"}
                      value={formatNumber(summary["EQUIPMENTS"])}
                      Icon={PaidIcon}
                    />
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
                    <StatCard
                      title={"Equipment Funds"}
                      value={formatNumber(summary["EQUIPMENT FUNDS"])}
                      Icon={PaidIcon}
                    />
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
                    <StatCard
                      title={"Utilities Funds"}
                      value={formatNumber(summary["UTILITIES"])}
                      Icon={PaidIcon}
                    />
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
                    <StatCard
                      title={"Labor Fund"}
                      value={formatNumber(summary["LABOR"])}
                      Icon={PaidIcon}
                    />
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
                    <StatCard
                      title={"Transportation Funds"}
                      value={formatNumber(summary["TRANSPORTATION"])}
                      Icon={PaidIcon}
                    />
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
                    <StatCard
                      title={"Total"}
                      value={formatNumber(summary["TOTAL"])}
                      Icon={PaidIcon}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Fourth Column for Pie Chart */}
        <Grid
          item
          xs={12}
          sm={4.5}
          sx={{ height: isMobile ? "550px" : "320px" }}
        >
          <Card sx={{ height: "inherit" }}>
            <CardContent sx={{ height: "inherit" }}>
              <ResponsivePie
                data={data}
                colors={{ scheme: "set3" }} // Add this to apply 'set3' color scheme
                colorBy="id"
                tooltip={({ datum }) => (
                  <div
                    style={{
                      background: "#333",
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      fontSize: "13px",
                    }}
                  >
                    <strong>{datum.id}</strong>
                    <br />
                    Value: {formatNumber(datum.value)}
                  </div>
                )}
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
                  top: isMobile ? -100 : 50,
                  right: 50,
                  bottom: isMobile ? 170 : 20,
                  left: 50,
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
                enableArcLinkLabels={isMobile ? false : true}
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
                legends={
                  isMobile
                    ? [
                        {
                          anchor: isMobile ? "bottom" : "top-left",
                          direction: "column",
                          justify: false,
                          translateX: isMobile ? 0 : -300,
                          translateY: isMobile ? 150 : 0,
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
                        },
                      ]
                    : []
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: isMobile ? 3 : 0 }}>
        <Grid item xs={12} sm={7.5}>
          <Card sx={{ minHeight: 290 }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
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
              <CustomDataGridStyles height={"250px"} margin={0}>
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
          <Card sx={{ minHeight: 290 }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
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
              <CustomDataGridStyles height={"250px"} margin={0}>
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

export default DashboardJD;
