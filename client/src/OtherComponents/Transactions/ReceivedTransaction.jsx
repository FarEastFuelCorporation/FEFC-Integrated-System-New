import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString, formatWeight } from "../Functions";

const ReceivedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

  // Extract received transaction data
  const receivedTransaction =
    row?.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};

  return (
    <Box>
      {(row.statusId === 2 &&
        row.ScheduledTransaction[0].logisticsId !== matchingLogisticsId) ||
      row.statusId === 3 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <LocalShippingIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[500]}`,
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
              For Receiving
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        row.statusId >= 4 && (
          <Box sx={{ my: 3, position: "relative" }}>
            <CircleLogo>
              <LocalShippingIcon
                sx={{
                  fontSize: "30px",
                  color: `${colors.grey[100]}`,
                }}
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
                  Received
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
                  {receivedTransaction.createdAt
                    ? timestampDate(receivedTransaction.createdAt)
                    : ""}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="h5">
              Received Date:{" "}
              {receivedTransaction.receivedDate
                ? format(
                    new Date(receivedTransaction.receivedDate),
                    "MMMM dd, yyyy"
                  )
                : "Pending"}
            </Typography>
            <Typography variant="h5">
              Received Time:{" "}
              {receivedTransaction.receivedTime
                ? format(
                    parseTimeString(receivedTransaction.receivedTime),
                    "hh:mm aa"
                  )
                : "Pending"}
            </Typography>
            {!receivedTransaction.dispatchedTransactionId && (
              <Box>
                <Typography variant="h5">
                  Plate Number:{" "}
                  {receivedTransaction.vehicle
                    ? receivedTransaction.vehicle
                    : "N/A"}
                </Typography>
                <Typography variant="h5">
                  Driver:{" "}
                  {receivedTransaction.driver
                    ? receivedTransaction.driver
                    : "N/A"}
                </Typography>
              </Box>
            )}
            <Typography variant="h5">
              Permit To Transport No:{" "}
              {receivedTransaction.pttNo ? receivedTransaction.pttNo : "N/A"}
            </Typography>
            <Typography variant="h5">
              Manifest No:{" "}
              {receivedTransaction.manifestNo
                ? receivedTransaction.manifestNo
                : "N/A"}
            </Typography>
            <Typography variant="h5">
              Pull Out Form No:{" "}
              {receivedTransaction.pullOutFormNo
                ? receivedTransaction.pullOutFormNo
                : "N/A"}
            </Typography>
            <Typography variant="h5">
              Manifest Weight:{" "}
              {receivedTransaction.manifestWeight
                ? `${formatWeight(receivedTransaction.manifestWeight)} Kg`
                : "N/A"}
            </Typography>
            <Typography variant="h5">
              Client Weight:{" "}
              {receivedTransaction.clientWeight
                ? `${formatWeight(receivedTransaction.clientWeight)} Kg`
                : "N/A"}
            </Typography>
            <Typography variant="h5">
              Gross Weight: {formatWeight(receivedTransaction.grossWeight)} Kg
            </Typography>
            <Typography variant="h5">
              Tare Weight: {formatWeight(receivedTransaction.tareWeight)} Kg
            </Typography>
            <Typography variant="h5">
              Net Weight: {formatWeight(receivedTransaction.netWeight)} Kg
            </Typography>
            <Typography variant="h5">
              Remarks:{" "}
              {receivedTransaction.receivedRemarks
                ? receivedTransaction.receivedRemarks
                : "NO REMARKS"}
            </Typography>
            <Typography variant="h5">
              Received By:{" "}
              {receivedTransaction.Employee
                ? `${receivedTransaction.Employee.firstName || ""} ${
                    receivedTransaction.Employee.lastName || ""
                  }`
                : ""}
            </Typography>
            <br />
            <hr />
          </Box>
        )
      )}
    </Box>
  );
};

export default ReceivedTransaction;
