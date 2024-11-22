import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

import { timestampDate, parseTimeString, formatNumber } from "../Functions";

const CollectedTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingDistributionTransaction =
    row.BilledTransaction[0].BillingApprovalTransaction
      .BillingDistributionTransaction;

  const collectedTransaction =
    row.BilledTransaction[0].BillingApprovalTransaction
      .BillingDistributionTransaction?.CollectedTransaction;

  // Assuming distributedDate is in a valid Date format (either Date object or string)
  const distributedDate = new Date(
    billingDistributionTransaction?.distributedDate
  );

  // Add the terms to the distributedDate
  const termsChargeDays = parseInt(
    row.QuotationWaste.Quotation.termsChargeDays
  );
  const termsCharge = row.QuotationWaste.Quotation.termsCharge;

  let dueDate;

  // Create a new Date instance for dueDate by adding terms to distributedDate
  if (distributedDate) {
    dueDate = new Date(distributedDate);
    dueDate.setDate(dueDate.getDate() + termsChargeDays);
  }

  const sortedWasteTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .SortedWasteTransaction;

  // Create a new array by aggregating the `weight` for duplicate `QuotationWaste.id`
  const aggregatedWasteTransactions = Object.values(
    sortedWasteTransaction.reduce((acc, current) => {
      const { id } = current.QuotationWaste;

      // If the `QuotationWaste.id` is already in the accumulator, add the weight
      if (acc[id]) {
        acc[id].weight += current.weight;
      } else {
        // Otherwise, set the initial object in the accumulator
        acc[id] = { ...current, weight: current.weight };
      }

      return acc;
    }, {})
  );

  const amounts = {
    vatExclusive: 0,
    vatInclusive: 0,
    nonVatable: 0,
  };

  const credits = {
    vatExclusive: 0,
    vatInclusive: 0,
    nonVatable: 0,
  };

  // Calculate amounts and credits based on vatCalculation and mode
  aggregatedWasteTransactions.forEach((item) => {
    const { weight, QuotationWaste } = item;
    const totalWeightPrice = weight * QuotationWaste.unitPrice; // Total weight multiplied by unit price

    const target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

    switch (QuotationWaste.vatCalculation) {
      case "VAT EXCLUSIVE":
        target.vatExclusive += totalWeightPrice;
        break;
      case "VAT INCLUSIVE":
        target.vatInclusive += totalWeightPrice;
        break;
      case "NON VATABLE":
        target.nonVatable += totalWeightPrice;
        break;
      default:
        break;
    }
  });

  const transpoFee = row.QuotationTransportation.unitPrice;
  const transpoVatCalculation = row.QuotationTransportation.vatCalculation;
  const transpoMode = row.QuotationTransportation.mode;

  const addTranspoFee = (transpoFee, transpoVatCalculation, transpoMode) => {
    // Check if the mode is "CHARGE"
    if (transpoMode === "CHARGE") {
      // Add the transportation fee based on VAT calculation
      switch (transpoVatCalculation) {
        case "VAT EXCLUSIVE":
          amounts.vatExclusive += transpoFee;
          break;
        case "VAT INCLUSIVE":
          amounts.vatInclusive += transpoFee;
          break;
        case "NON VATABLE":
          amounts.nonVatable += transpoFee;
          break;
        default:
          break;
      }
    }
  };

  // Call the function to add transportation fee
  addTranspoFee(transpoFee, transpoVatCalculation, transpoMode);

  const vat = amounts.vatExclusive * 0.12;

  const totalAmountDue = formatNumber(
    amounts.vatInclusive + amounts.vatExclusive + vat - credits.vatInclusive
  );

  return (
    <Box>
      {row.statusId === 12 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <PaidIcon
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
              For Collection
            </Typography>
          </Box>
          <Typography mb={3} variant="h5">
            Pending
          </Typography>
          <Typography variant="h5">
            Total Amount Due: {totalAmountDue}
          </Typography>
          <Typography variant="h5">
            Terms:{" "}
            {termsChargeDays
              ? `${termsChargeDays} DAYS ${termsCharge}`
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Due Date:{" "}
            {dueDate ? format(new Date(dueDate), "MMMM dd, yyyy") : "Pending"}
          </Typography>

          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <PaidIcon
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
                Collected
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
                {collectedTransaction.createdAt
                  ? timestampDate(collectedTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h5">
            Collected Date:{" "}
            {collectedTransaction.collectedDate
              ? format(
                  new Date(collectedTransaction.collectedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Collected Time:{" "}
            {collectedTransaction.collectedTime
              ? format(
                  parseTimeString(collectedTransaction.collectedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Collected Amount:{" "}
            {collectedTransaction.collectedAmount
              ? formatNumber(collectedTransaction.collectedAmount)
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {collectedTransaction.remarks
              ? collectedTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${collectedTransaction.Employee.firstName || ""} ${
              collectedTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default CollectedTransaction;
