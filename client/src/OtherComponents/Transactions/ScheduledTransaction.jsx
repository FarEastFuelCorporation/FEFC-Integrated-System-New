import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AlarmIcon from "@mui/icons-material/Alarm";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const ScheduledTransaction = ({ row }) => {
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

  return (
    <Box>
      {statusId === 1 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          {" "}
          <CircleLogo>
            <AlarmIcon
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
              Scheduled
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <AlarmIcon
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
              Scheduled
            </Typography>
            <Typography variant="h5">
              {scheduledCreatedDate} {scheduledCreatedTime}
            </Typography>
          </Box>
          <Typography variant="h5">
            Scheduled Date:
            {scheduledDate && format(new Date(scheduledDate), "MMMM dd, yyyy")}
          </Typography>
          <Typography variant="h5">
            Scheduled Time:{" "}
            {scheduledTime
              ? format(parseTimeString(scheduledTime), "hh:mm aa")
              : ""}
          </Typography>

          <Typography variant="h5">
            Remarks: {scheduledRemarks ? scheduledRemarks : "NO REMARKS"}
          </Typography>
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

export default ScheduledTransaction;
