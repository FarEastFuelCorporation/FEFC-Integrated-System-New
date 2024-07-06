import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const DispatchedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    statusId,
    dispatchedCreatedDate,
    dispatchedCreatedTime,
    dispatchedDate,
    dispatchedTime,
    vehicleType,
    dispatchedRemarks,
    dispatchedCreatedBy,
  } = row;
  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  return (
    <Box>
      {statusId === 2 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          {" "}
          <CircleLogo>
            <LocalShippingIcon
              sx={{
                fontSize: "30px",
                color: `${colors.greenAccent[400]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Dispatching
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <LocalShippingIcon
              sx={{
                fontSize: "30px",
                color: `${colors.greenAccent[400]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              Dispatched
            </Typography>
            <Typography variant="h5">
              {dispatchedCreatedDate} {dispatchedCreatedTime}
            </Typography>
          </Box>
          <Typography variant="h5">
            Dispatched Date:{" "}
            {dispatchedDate
              ? format(new Date(dispatchedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Dispatched Time:{" "}
            {dispatchedTime
              ? format(parseTimeString(dispatchedTime), "hh:mm aa")
              : "Pending"}
          </Typography>

          <Typography variant="h5">Vehicle Type: {vehicleType}</Typography>
          <Typography variant="h5">
            Plate Number: {row.Vehicle.plateNumber}
          </Typography>
          <Typography variant="h5">
            Driver:{" "}
            {`${row.EmployeeDriver.firstName} ${row.EmployeeDriver.lastName}`}
          </Typography>
          <Typography variant="h5">
            Helper(s): {row.helper ? row.helper : "No Helper"}
          </Typography>
          <Typography variant="h5">Remarks: {dispatchedRemarks}</Typography>
          <Typography variant="h5">Set By: {dispatchedCreatedBy}</Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default DispatchedTransaction;
