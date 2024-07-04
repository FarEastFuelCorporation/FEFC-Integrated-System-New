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
    scheduledCreatedDate,
    scheduledCreatedTime,
    scheduledDate,
    scheduledTime,
    scheduledRemarks,
    scheduledCreatedBy,
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
  console.log("pass");
  console.log(statusId);
  return (
    <Box>
      {statusId === 3 ? (
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
              {scheduledCreatedDate} {scheduledCreatedTime}
            </Typography>
          </Box>
          {scheduledDate && (
            <Typography variant="h5">
              Scheduled Date: {format(new Date(scheduledDate), "MMMM dd, yyyy")}
            </Typography>
          )}
          <Typography variant="h5">
            Scheduled Time:{" "}
            {scheduledTime
              ? format(parseTimeString(scheduledTime), "hh:mm aa")
              : ""}
          </Typography>

          <Typography variant="h5">Remarks: {scheduledRemarks}</Typography>
          <Typography variant="h5">
            Scheduled By: {scheduledCreatedBy}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default DispatchedTransaction;
