import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
import PeopleIcon from "@mui/icons-material/People";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import WeekNavigator from "../../../../../OtherComponents/WeekNavigator";
import MonthNavigator from "../../../../../OtherComponents/MonthNavigator";
import DayNavigator from "../../../../../OtherComponents/DayNavigator";
import axios from "axios";
import {
  formatDate2,
  formatNumber,
} from "../../../../../OtherComponents/Functions";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ResponsiveBar } from "@nivo/bar";

const Dashboard = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDetailsTab, setSelectedDetailsTab] = useState(1);
  const [selectedSummaryTab, setSelectedSummaryTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pendingDispatch, setPendingDispatch] = useState(0);
  const [onTimeSchedule, setOnTimeSchedule] = useState(0);
  const [onTimePercentage, setOnTimePercentage] = useState(0);
  const [lateSchedule, setLateSchedule] = useState(0);
  const [totalSchedule, setTotalSchedule] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [clientTrips, setClientTrips] = useState([]);
  const [vehicleTrips, setVehicleTrips] = useState([]);
  const [vehicleTypeTrips, setVehicleTypeTrips] = useState([]);
  const [clientCountByEmployeeData, setClientCountByEmployeeData] = useState(
    []
  );
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [updatedTransactions, setUpdatedTransactions] = useState([]);
  const [filterValue, setFilterValue] = useState(""); // To track the filter input value
  const [sortModel, setSortModel] = useState([
    { field: "clientName", sort: "asc" },
  ]);

  const [latest8weeks, setLatest8weeks] = useState([]);

  // useCallback to memoize fetchData function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Ensure dates are formatted correctly
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(
        `${apiUrl}/api/scheduledTransaction/dashboard/${formattedStartDate}/${formattedEndDate}`,
        {
          params: {
            selectedEmployee: selectedEmployee || undefined, // Pass selectedEmployee if it's defined
          },
        }
      );

      setPendingDispatch(response.data.pending);
      setTotalSchedule(response.data.totalSchedule);
      setOnTimeSchedule(response.data.onTimeSchedule);
      setOnTimePercentage(response.data.onTimePercentage);
      setLateSchedule(response.data.lateSchedule);
      setTotalClients(response.data.totalClients);
      setClientTrips(response.data.clientTripsArray);
      setVehicleTrips(response.data.vehicleTripsArray);
      setVehicleTypeTrips(response.data.vehicleTypeTripsArray);
      setTransactions(response.data.result);
      setClientCountByEmployeeData(response.data.clientCountByEmployeeData);

      const transformedData = response.data.scheduledTransactionCounts.map(
        (item) => ({
          id: `${formatDate2(item.weekStart)} - ${formatDate2(item.weekEnd)}`,
          value: item.transactions,
        })
      );
      setLatest8weeks(transformedData);

      console.log(response.data.scheduledTransactionCounts);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [apiUrl, startDate, endDate, selectedEmployee]); // Dependencies that trigger the callback

  // Effect to fetch data when startDate, endDate, selectedEmployee, or apiUrl changes
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependencies array includes fetchData which is memoized by useCallback

  // Effect to fetch data when the selected tab changes to 1
  useEffect(() => {
    if (selectedDetailsTab === 1) {
      fetchData(); // Fetch data when tab changes to 1
    }
  }, [selectedDetailsTab, fetchData]); // Only re-run when selectedDetailsTab changes

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeDetailsTab = (event, newValue) => {
    setSelectedDetailsTab(newValue); // Change the selected tab

    setSelectedEmployee("");

    if (newValue === 1) {
      // If the tab is 1, fetch data
      fetchData();
    }
  };

  const handleChangeSummaryTab = (event, newValue) => {
    setSelectedSummaryTab(newValue);
  };

  // Handle selection change
  const handleSelectChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  // Calculate totals for the "Total" row
  const getTotalRow = (filteredTransactions) => {
    const totalInHouseLogistics = filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.inHouseLogistics,
      0
    );
    const totalOtherLogistics = filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.otherLogistics,
      0
    );
    const totalLogistics = filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.total,
      0
    );

    return {
      id: "total",
      clientName: "Total",
      inHouseLogistics: totalInHouseLogistics,
      otherLogistics: totalOtherLogistics,
      total: totalLogistics,
      createdBy: "", // You can leave this empty or use a placeholder like "Total"
    };
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value); // Update the filter value
  };

  // Handle sort changes
  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);
  };

  useEffect(() => {
    let filteredTransactions = [...transactions];

    // Step 1: Remove "Total" row (if it exists) before filtering or sorting
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.id !== "total"
    );

    // Step 2: Apply filter across all columns if filterValue is set
    if (filterValue) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        // Loop through each property of the transaction and check if it includes the filter value
        return Object.values(transaction)
          .join(" ") // Convert all values of the transaction to a single string
          .toLowerCase()
          .includes(filterValue.toLowerCase()); // Check if filter value is a part of any of the fields
      });
    }

    // Step 3: Apply sorting (if any)
    if (sortModel.length > 0) {
      const sortField = sortModel[0]?.field;
      const sortOrder = sortModel[0]?.sort;

      filteredTransactions.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    // Step 4: Add the "Total" row back at the end
    const totalRow = getTotalRow(filteredTransactions);
    setUpdatedTransactions([...filteredTransactions, totalRow]);
  }, [transactions, filterValue, sortModel]); // Depend on transactions, filterValue, and sortModel

  const summaryData =
    selectedSummaryTab === 0
      ? clientTrips
      : selectedSummaryTab === 1
      ? vehicleTrips
      : vehicleTypeTrips;
  const summaryHeader =
    selectedSummaryTab === 0
      ? "Client"
      : selectedSummaryTab === 1
      ? "Vehicle"
      : "Vehicle Type";

  const data = [
    { id: "Pending", label: "Pending", value: pendingDispatch },
    { id: "On-Time", label: "On-Time", value: onTimeSchedule },
    { id: "Late", label: "Late", value: lateSchedule },
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
      field: "inHouseLogistics",
      headerName: "FEFC Logistics",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "otherLogistics",
      headerName: "Other Logistics",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "total",
      headerName: "Total",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdBy",
      headerName: "Account Handler",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
  ];

  const columnsSummary = [
    {
      field: "header",
      headerName: summaryHeader,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "count",
      headerName: "Trips",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "income",
      headerName: "Income",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        let value = {};
        value.value = formatNumber(params.row.totalIncome) || "";

        return renderCellWithWrapText(value);
      },
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
        {/* <Button
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
        </Button> */}
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
          <Tab label="Comparison" />
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
      {selectedTab !== 3 && (
        <>
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
                          On-Time Schedules
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {onTimeSchedule}
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
                            Pending Schedules
                          </Typography>
                          <Typography variant="h4" color="textSecondary">
                            {pendingDispatch}
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
                          Late Schedules
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {lateSchedule}
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
                          Total Schedules
                        </Typography>
                        <Typography variant="h4" color="textSecondary">
                          {totalSchedule}
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
                            Total Clients
                          </Typography>
                          <Typography variant="h4" color="textSecondary">
                            {totalClients}
                          </Typography>
                        </Box>
                        <PeopleIcon
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
                              Pending Schedules
                            </Typography>
                            <Typography variant="h4" color="textSecondary">
                              {pendingDispatch}
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
                              Total Clients
                            </Typography>
                            <Typography variant="h4" color="textSecondary">
                              {totalClients}
                            </Typography>
                          </Box>
                          <PeopleIcon
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
                      alignItems: "initial",
                      justifyContent: isMobile ? "none" : "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Details:
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Box>
                        {selectedDetailsTab === 0 && (
                          <FormControl
                            sx={{ width: "200px", height: "30px", padding: 0 }}
                          >
                            <InputLabel
                              id="employee-select-label"
                              sx={{ padding: 0 }}
                              style={{
                                color: colors.grey[100],
                              }}
                              shrink={true}
                            >
                              Select Employee
                            </InputLabel>
                            <Select
                              labelId="employee-select-label"
                              id="employeeSelect"
                              value={selectedEmployee}
                              onChange={handleSelectChange}
                              label="Select Employee"
                              sx={{
                                height: "30px",
                                paddingTop: 0,
                                paddingBottom: 0,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {clientCountByEmployeeData.map((employee) => (
                                <MenuItem
                                  key={employee.employeeId}
                                  value={employee.employeeId}
                                >
                                  {employee.employeeName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Box>
                      <Tabs
                        value={selectedDetailsTab}
                        onChange={handleChangeDetailsTab}
                        sx={{
                          "& .MuiTab-root": {
                            height: 30, // Set height for each Tab
                            minHeight: 30, // Ensure minimum height of 20px for the Tab
                            paddingY: 0, // Remove vertical padding
                          },
                          "& .Mui-selected": {
                            backgroundColor: colors.greenAccent[400],
                            boxShadow: "none",
                            borderBottom: `1px solid ${colors.grey[100]}`,
                          },
                          "& .MuiTab-root > span": {
                            paddingRight: "10px",
                          },
                          height: 20,
                        }}
                      >
                        <Tab label="Individual" />
                        <Tab label="Team" />
                      </Tabs>
                    </Box>
                  </Box>
                  <CustomDataGridStyles height={"372px"} margin={"-20px 0 0 0"}>
                    <DataGrid
                      rows={updatedTransactions ? updatedTransactions : []}
                      columns={columns}
                      components={{ Toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      hideFooter
                      initialState={{
                        sorting: {
                          sortModel: [{ field: "total", sort: "asc" }],
                        },
                      }}
                      onSortModelChange={handleSortModelChange}
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
                        Summary:
                      </Typography>
                    </Box>
                    {/* <Tabs
                  value={selectedSummaryTab}
                  onChange={handleChangeSummaryTab}
                  sx={{
                    "& .MuiTab-root": {
                      height: 30, // Set height for each Tab
                      minHeight: 30, // Ensure minimum height of 20px for the Tab
                      paddingY: 0, // Remove vertical padding
                    },
                    "& .Mui-selected": {
                      backgroundColor: colors.greenAccent[400],
                      boxShadow: "none",
                      borderBottom: `1px solid ${colors.grey[100]}`,
                    },
                    "& .MuiTab-root > span": {
                      paddingRight: "10px",
                    },
                    height: 20,
                  }}
                >
                  <Tab label="Client" />
                  <Tab label="Vehicle" />
                  <Tab label="Vehicle Type" />
                </Tabs> */}
                  </Box>
                  <CustomDataGridStyles height={"372px"} margin={"-20px 0 0 0"}>
                    <DataGrid
                      rows={summaryData ? summaryData : []}
                      columns={columnsSummary}
                      components={{ Toolbar: GridToolbar }}
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
        </>
      )}
      {selectedTab === 3 && (
        <div style={{ height: "400px" }}>
          <ResponsiveBar
            data={latest8weeks}
            keys={["value"]}
            indexBy="id"
            margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
            padding={0.3}
            layout="vertical"
            colors={{ scheme: "nivo" }}
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
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Week Coverage",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Transactions",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            enableGridX={true}
            enableGridY={true}
            animate={true}
            motionConfig="gentle"
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={(bar) => {
              if (bar.id === "value") {
                return "#FFFFFF"; // White text on bars
              }
              return colors.grey[900]; // Default text color
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={(e) =>
              `${e.id}: ${e.formattedValue} in week: ${e.indexValue}`
            }
          />
        </div>
      )}
    </Box>
  );
};

export default Dashboard;
