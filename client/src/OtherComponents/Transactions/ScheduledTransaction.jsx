import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AlarmIcon from "@mui/icons-material/Alarm";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";

const ScheduledTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const scheduledData = row.ScheduledTransaction?.[0] || {};

  const renderStatusHeader = (title, date) => (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
        {title}
      </Typography>
      {date && <Typography variant="h5">{timestampDate(date)}</Typography>}
    </Box>
  );

  const renderDetail = (label, value) => (
    <Typography variant="h5">
      {label}: {value || "Pending"}
    </Typography>
  );

  return (
    <Box sx={{ my: 3, position: "relative" }}>
      <CircleLogo pending={row.statusId === 1}>
        <AlarmIcon
          sx={{
            fontSize: "30px",
            color: row.statusId === 1 ? colors.grey[500] : colors.grey[100],
          }}
        />
      </CircleLogo>

      {row.statusId === 1 ? (
        <>
          {renderStatusHeader("For Schedule")}
          {renderDetail("Status", "Pending")}
        </>
      ) : (
        <>
          {renderStatusHeader("Scheduled", scheduledData.createdAt)}
          {renderDetail(
            "Scheduled Date",
            scheduledData.scheduledDate &&
              format(new Date(scheduledData.scheduledDate), "MMMM dd, yyyy")
          )}
          {renderDetail(
            "Scheduled Time",
            scheduledData.scheduledTime &&
              format(parseTimeString(scheduledData.scheduledTime), "hh:mm aa")
          )}
          {renderDetail("Remarks", scheduledData.remarks || "NO REMARKS")}
          {renderDetail(
            "Scheduled By",
            `${scheduledData.Employee?.firstName} ${scheduledData.Employee?.lastName}`
          )}
        </>
      )}

      <br />
      <hr />
    </Box>
  );
};

export default ScheduledTransaction;
