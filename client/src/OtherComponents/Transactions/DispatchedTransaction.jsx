import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { format } from "date-fns";
import axios from "axios";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";

const DispatchedTransaction = ({ row }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [employeeData, setEmployeeData] = useState([]);
  const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/employee`);
        setEmployeeData(data.employees);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Extract dispatched transaction data
  const dispatchedTransaction =
    row?.ScheduledTransaction?.[0].DispatchedTransaction?.[0] || {};

  // Helper extraction
  const helperIdsArray =
    dispatchedTransaction.helperId?.split(",").map((id) => id.trim()) || [];

  const helper =
    helperIdsArray
      .map((helperId) => {
        const employee = employeeData.find(
          (emp) => emp.employeeId === helperId
        );
        return employee ? `${employee.firstName} ${employee.lastName}` : null;
      })
      .filter(Boolean)
      .join(", ") || "No Helper";

  return (
    <>
      {row.ScheduledTransaction[0].logisticsId === matchingLogisticsId && (
        <Box>
          {row.statusId === 2 ? (
            <Box sx={{ my: 3, position: "relative" }}>
              <CircleLogo pending>
                <LocalShippingIcon
                  sx={{ fontSize: "30px", color: colors.grey[500] }}
                />
              </CircleLogo>
              <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
                For Dispatching
              </Typography>
              <Typography variant="h5">Pending</Typography>
              <br />
              <hr />
            </Box>
          ) : (
            <Box sx={{ my: 3, position: "relative" }}>
              <CircleLogo>
                <LocalShippingIcon
                  sx={{ fontSize: "30px", color: colors.grey[100] }}
                />
              </CircleLogo>

              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" color={colors.greenAccent[400]}>
                    Dispatched
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: {
                      xs: "start",
                      md: "end",
                    },
                  }}
                >
                  <Typography variant="h5">
                    {dispatchedTransaction.createdAt
                      ? timestampDate(dispatchedTransaction.createdAt)
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h5">
                Dispatched Date:{" "}
                {dispatchedTransaction.dispatchedDate
                  ? format(
                      new Date(dispatchedTransaction.dispatchedDate),
                      "MMMM dd, yyyy"
                    )
                  : "Pending"}
              </Typography>
              <Typography variant="h5">
                Dispatched Time:{" "}
                {dispatchedTransaction.dispatchedTime
                  ? format(
                      parseTimeString(dispatchedTransaction.dispatchedTime),
                      "hh:mm aa"
                    )
                  : "Pending"}
              </Typography>
              <Typography variant="h5">
                Vehicle Type:{" "}
                {dispatchedTransaction.Vehicle.VehicleType?.typeOfVehicle ||
                  "N/A"}
              </Typography>
              <Typography variant="h5">
                Plate Number:{" "}
                {dispatchedTransaction.Vehicle.plateNumber || "N/A"}
              </Typography>
              <Typography variant="h5">
                Driver:{" "}
                {`${dispatchedTransaction.EmployeeDriver.firstName || ""} ${
                  dispatchedTransaction.EmployeeDriver.lastName || ""
                }`}
              </Typography>
              <Typography variant="h5">Helper(s): {helper}</Typography>
              <Typography variant="h5">
                Remarks: {dispatchedTransaction.remarks || "NO REMARKS"}
              </Typography>
              <Typography variant="h5">
                Dispatched By:{" "}
                {`${dispatchedTransaction.Employee.firstName || ""} ${
                  dispatchedTransaction.Employee.lastName || ""
                }`}
              </Typography>
              <br />
              <hr />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default DispatchedTransaction;
