import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import AlarmIcon from "@mui/icons-material/Alarm";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";

const ScheduledTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const scheduledData = row.ScheduledTransaction?.[0] || {};

  console.log(user);
  console.log(user?.userType);

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
          <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
            For Schedule
          </Typography>
          <Typography variant="h5">Pending</Typography>
        </>
      ) : (
        <>
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
                Scheduled
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
                {scheduledData?.createdAt
                  ? timestampDate(scheduledData.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h5">
            Scheduled Date:{" "}
            {scheduledData?.scheduledDate
              ? format(new Date(scheduledData.scheduledDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Scheduled Time:{" "}
            {scheduledData?.scheduledTime
              ? format(parseTimeString(scheduledData.scheduledTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          {Number.isInteger(user?.userType) && (
            <Typography variant="h5">
              Logistics:{" "}
              {scheduledData?.Logistics
                ? scheduledData.Logistics.logisticsName
                : "CLIENT VEHICLE"}
            </Typography>
          )}
          <Typography variant="h5">
            Remarks:{" "}
            {scheduledData?.remarks ? scheduledData.remarks : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Scheduled By:{" "}
            {`${scheduledData?.Employee?.firstName || ""} ${
              scheduledData?.Employee?.lastName || ""
            }`}
          </Typography>
        </>
      )}

      <br />
      <hr />
    </Box>
  );
};

export default ScheduledTransaction;
