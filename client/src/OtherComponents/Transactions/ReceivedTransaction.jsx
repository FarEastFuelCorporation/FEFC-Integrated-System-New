import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const ReceivedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    statusId,
    receivedCreatedDate,
    receivedCreatedTime,
    receivedDate,
    receivedTime,
    pttNo,
    manifestNo,
    pullOutFormNo,
    manifestWeight,
    clientWeight,
    grossWeight,
    tareWeight,
    netWeight,
    receivedRemarks,
    receivedCreatedBy,
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

  const formatWeight = (weight) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(weight);
  };

  return (
    <Box>
      {statusId === 3 ? (
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
              For Receiving
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
              Received
            </Typography>
            <Typography variant="h5">
              {receivedCreatedDate} {receivedCreatedTime}
            </Typography>
          </Box>
          <Typography variant="h5">
            Received Date:{" "}
            {receivedDate
              ? format(new Date(receivedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Received Time:{" "}
            {receivedTime
              ? format(parseTimeString(receivedTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Permit To Transport No: {pttNo ? pttNo : "N/A"}
          </Typography>
          <Typography variant="h5">
            PTT No: {manifestNo ? manifestNo : "N/A"}
          </Typography>
          <Typography variant="h5">
            Pull Out Form No: {pullOutFormNo ? pullOutFormNo : "N/A"}
          </Typography>
          <Typography variant="h5">
            Manifest Weight:{" "}
            {manifestWeight ? `${formatWeight(manifestWeight)} Kg` : "N/A"}
          </Typography>
          <Typography variant="h5">
            Client Weight:{" "}
            {clientWeight ? `${formatWeight(clientWeight)} Kg` : "N/A"}
          </Typography>
          <Typography variant="h5">
            Gross Weight: {formatWeight(grossWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Tare Weight: {formatWeight(tareWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Net Weight: {formatWeight(netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Remarks: {receivedRemarks ? receivedRemarks : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">Received By: {receivedCreatedBy}</Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default ReceivedTransaction;
