import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const SortedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    statusId,
    sortedCreatedDate,
    sortedCreatedTime,
    sortedDate,
    sortedTime,
    netWeight,
    totalSortedWeight,
    discrepancyWeight,
    sortedRemarks,
    SortedWasteTransaction,
    SortedScrapTransaction,
    sortedCreatedBy,
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
      {statusId === 5 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <FactoryIcon
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
              For Treatment
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <FactoryIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
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
              Treated
            </Typography>
            <Typography variant="h5">
              {sortedCreatedDate} {sortedCreatedTime}
            </Typography>
          </Box>
          {SortedWasteTransaction && SortedWasteTransaction.length > 0 ? (
            SortedWasteTransaction.map((waste, index) => (
              <Box key={index} sx={{ my: 2 }}>
                <Typography variant="h5">Item {index + 1}</Typography>
                <Typography variant="h5">
                  Waste Name: {waste.wasteName}
                </Typography>
                <Typography variant="h5">
                  Weight: {formatWeight(waste.weight)} Kg
                </Typography>
                <Typography variant="h5">Form No: {waste.formNo}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="h5">No Sorted Waste Transactions</Typography>
          )}
          {SortedScrapTransaction && SortedScrapTransaction.length > 0 ? (
            SortedScrapTransaction.map((scrap, index) => (
              <Box key={index} sx={{ my: 2 }}>
                <Typography variant="h5">Scrap {index + 1}</Typography>
                <Typography variant="h5">
                  Waste Name: {scrap.ScrapType.typeOfScrap}
                </Typography>
                <Typography variant="h5">
                  Weight: {formatWeight(scrap.weight)} Kg
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="h5">No Sorted Waste Transactions</Typography>
          )}
          <Typography variant="h5">
            Sorted Date:{" "}
            {sortedDate
              ? format(new Date(sortedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Sorted Time:{" "}
            {sortedTime
              ? format(parseTimeString(sortedTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Net Weight: {formatWeight(netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Total Sorted Weight: {formatWeight(totalSortedWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Weight: {formatWeight(discrepancyWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Remarks: {sortedRemarks ? sortedRemarks : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">Sorted By: {sortedCreatedBy}</Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default SortedTransaction;
