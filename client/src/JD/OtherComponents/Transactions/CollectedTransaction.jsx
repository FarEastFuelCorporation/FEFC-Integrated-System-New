import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import { CircleLogo } from "../CustomAccordionStyles";
import axios from "axios";
import { format } from "date-fns";
import { tokens } from "../../theme";

import { timestampDate, parseTimeString, formatNumber } from "../Functions";
import Decimal from "decimal.js";

const CollectedTransaction = ({ row, user }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [transactions, setTransactions] = useState([]);

  const billedTransaction = row?.BilledTransaction[0] || "";
  const billingNumber = billedTransaction?.billingNumber;
  const hasFixedRate = row?.QuotationWaste?.hasFixedRate;

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      // setLoading(true);
      const billingStatementResponse = await axios.get(
        `${REACT_APP_API_URL}/api/billedTransaction/multiple/${billedTransaction.billingNumber}`
      );

      // For pending transactions
      setTransactions(billingStatementResponse.data.bookedTransactions);

      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [REACT_APP_API_URL, billedTransaction.billingNumber]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const haulingDate = row.haulingDate;
  // Add the terms to the distributedDate
  const termsChargeDays = parseInt(
    row.QuotationWaste.Quotation.termsChargeDays
  );
  const termsBuyingDays = parseInt(
    row.QuotationWaste.Quotation.termsBuyingDays
  );
  const termsCharge = row.QuotationWaste.Quotation.termsCharge;
  const termsBuying = row.QuotationWaste.Quotation.termsBuying;
  const termsRemarks = termsCharge !== "N/A" ? termsCharge : termsBuying;
  const terms = termsCharge !== "N/A" ? termsChargeDays : termsBuyingDays;

  let dueDate = "Pending"; // Default value if no condition is met

  // Helper function to add days to a date
  const addDaysToDate = (dateStr, daysToAdd) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
  };

  if (termsRemarks === "UPON RECEIVING OF DOCUMENTS" && distributedDate) {
    // Add the terms to the distributedDate
    dueDate = addDaysToDate(distributedDate, terms);
  } else if (
    termsRemarks === "UPON HAULING" ||
    termsRemarks === "ON PICKUP" ||
    termsRemarks === "ON DELIVERY"
  ) {
    // Add the terms to the haulingDate
    dueDate = addDaysToDate(haulingDate, terms);
  }

  let remarks;

  // If no due date is available, return "Pending"
  if (dueDate === "Pending") {
    remarks = "Pending";
  }

  // Get the current date
  const currentDate = new Date();

  // Parse the dueDate string into a Date object
  const dueDateObj = new Date(dueDate);

  // Calculate the difference in time (milliseconds)
  const timeDifference = dueDateObj - currentDate;

  // If the due date is in the future, calculate the remaining days
  if (timeDifference > 0) {
    const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
    if (remainingDays > 1) {
      remarks = `${remainingDays} Days Before Due Date`;
    } else if (remainingDays === 1) {
      remarks = "1 Day Before Due Date";
    } else {
      remarks = "Due Date Today"; // If remainingDays is 0, show "Due Date"
    }
  } else {
    // If the due date is in the past, calculate how overdue it is
    const overdueDays = Math.floor(
      Math.abs(timeDifference) / (1000 * 3600 * 24)
    ); // Convert milliseconds to days
    if (overdueDays === 1) {
      remarks = "1 Day Overdue";
    } else if (overdueDays === 0) {
      remarks = `Due Today`;
    } else {
      remarks = `${overdueDays} Days Overdue`;
    }
  }

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

  let totalWeight = new Decimal(0);
  let isWasteName = false;
  let isPerClient = false;
  let isIndividualBilling = false;

  transactions.forEach((transaction) => {
    const hasFixedRate = transaction?.QuotationWaste?.hasFixedRate;
    const isMonthly = transaction?.QuotationWaste?.isMonthly;

    const receivedTransaction =
      transaction?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0];

    const submitTo = receivedTransaction?.submitTo;

    const certifiedTransaction = transaction.CertifiedTransaction?.[0];

    const typeOfWeight = certifiedTransaction?.typeOfWeight
      ? certifiedTransaction.typeOfWeight
      : "SORTED WEIGHT";

    const sortedWasteTransaction =
      submitTo === "WAREHOUSE"
        ? transaction.ScheduledTransaction[0].ReceivedTransaction[0]
            .WarehousedTransaction[0].WarehousedTransactionItem
        : transaction.ScheduledTransaction[0].ReceivedTransaction[0]
            .SortedTransaction[0].SortedWasteTransaction;

    isWasteName = transaction?.BilledTransaction?.[0]?.isWasteName;
    isPerClient = transaction?.BilledTransaction?.[0]?.isPerClient;
    isIndividualBilling =
      transaction?.BilledTransaction?.[0]?.isIndividualBilling;

    const hasDemurrage =
      transaction?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
        ?.hasDemurrage || false;
    const demurrageDays =
      transaction?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
        ?.demurrageDays || 0;

    // Create a new array by aggregating the `weight` for duplicate `QuotationWaste.id`
    const aggregatedWasteTransactions = Object.values(
      sortedWasteTransaction.reduce((acc, current) => {
        const { id } = current.QuotationWaste;

        const currentWeight = new Decimal(current.weight); // Use Decimal.js
        const currentClientWeight = new Decimal(current.clientWeight); // Use Decimal.js

        // If the `QuotationWaste.id` is already in the accumulator, add the weight
        if (acc[id]) {
          acc[id].weight = acc[id].weight.plus(currentWeight);
          acc[id].clientWeight = acc[id].clientWeight.plus(currentClientWeight);
        } else {
          // Otherwise, set the initial object in the accumulator
          acc[id] = {
            ...current,
            weight: currentWeight,
            clientWeight: currentClientWeight,
          };
        }

        return acc;
      }, {})
    ).map((item) => ({
      ...item,
      weight: item.weight.toNumber(), // Convert Decimal back to a standard number
    }));

    let hasTransportation;

    // SMB
    if (hasFixedRate && isMonthly) {
      let vatCalculation;
      let fixedWeight;
      let fixedPrice;
      let unitPrice;

      let target;

      aggregatedWasteTransactions.forEach((item) => {
        const { weight, clientWeight, QuotationWaste } = item;

        const selectedWeight =
          typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

        totalWeight = totalWeight.plus(selectedWeight); // Total weight multiplied by unit price

        target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

        vatCalculation = QuotationWaste.vatCalculation;
        fixedWeight = QuotationWaste.fixedWeight;
        fixedPrice = QuotationWaste.fixedPrice;
        unitPrice = QuotationWaste.unitPrice;
        hasTransportation = QuotationWaste.hasTransportation;
      });

      switch (vatCalculation) {
        case "VAT EXCLUSIVE":
          target.vatExclusive = fixedPrice;
          break;
        case "VAT INCLUSIVE":
          target.vatInclusive = fixedPrice;
          break;
        case "NON VATABLE":
          target.nonVatable = fixedPrice;
          break;
        default:
          break;
      }

      if (fixedWeight !== 0) {
        if (totalWeight.toNumber() > fixedWeight) {
          const excessWeight = totalWeight.minus(fixedWeight);

          const excessPrice = excessWeight * unitPrice;

          switch (vatCalculation) {
            case "VAT EXCLUSIVE":
              target.vatExclusive += excessPrice;
              break;
            case "VAT INCLUSIVE":
              target.vatInclusive += excessPrice;
              break;
            case "NON VATABLE":
              target.nonVatable += excessPrice;
              break;
            default:
              break;
          }
        }
      }
    }
    // LOREAL, RED CROSS
    else if (hasFixedRate && !isMonthly) {
      let hasFixedRateIndividual;
      let vatCalculation;
      let fixedWeight;
      let fixedPrice;
      let unitPrice;

      let target;

      let usedWeight = 0;

      aggregatedWasteTransactions.forEach((item) => {
        const { weight, clientWeight, QuotationWaste } = item;

        const selectedWeight =
          typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

        usedWeight = selectedWeight;

        const totalWeightPrice = selectedWeight * QuotationWaste.unitPrice; // Total weight multiplied by unit price

        target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

        hasFixedRateIndividual = QuotationWaste.hasFixedRate;
        if (hasFixedRateIndividual) {
          vatCalculation = QuotationWaste.vatCalculation;
          fixedWeight = QuotationWaste.fixedWeight;
          fixedPrice = QuotationWaste.fixedPrice;
          unitPrice = QuotationWaste.unitPrice;
          hasTransportation = QuotationWaste.hasTransportation;
        }

        if (!hasFixedRateIndividual) {
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
        } else {
          if (usedWeight > fixedWeight) {
            const excessWeight = new Decimal(usedWeight)
              .minus(new Decimal(fixedWeight))
              .toNumber();

            const excessPrice = excessWeight * unitPrice;

            switch (vatCalculation) {
              case "VAT EXCLUSIVE":
                target.vatExclusive += excessPrice;
                break;
              case "VAT INCLUSIVE":
                target.vatInclusive += excessPrice;
                break;
              case "NON VATABLE":
                target.nonVatable += excessPrice;
                break;
              default:
                break;
            }
          }
        }
      });

      switch (vatCalculation) {
        case "VAT EXCLUSIVE":
          target.vatExclusive += fixedPrice;
          break;
        case "VAT INCLUSIVE":
          target.vatInclusive += fixedPrice;
          break;
        case "NON VATABLE":
          target.nonVatable += fixedPrice;
          break;
        default:
          break;
      }
    } else {
      // Calculate amounts and credits based on vatCalculation and mode
      aggregatedWasteTransactions.forEach((item) => {
        const { weight, clientWeight, QuotationWaste } = item;

        const selectedWeight =
          typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

        const totalWeightPrice = selectedWeight * QuotationWaste.unitPrice; // Total weight multiplied by unit price

        const target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

        hasTransportation = QuotationWaste.hasTransportation;

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
    }

    const transpoFee = transaction.QuotationTransportation?.unitPrice || 0;
    const transpoVatCalculation =
      transaction.QuotationTransportation?.vatCalculation;
    const transpoMode = transaction.QuotationTransportation?.mode;
    let isTransportation =
      transaction.ScheduledTransaction?.[0]?.DispatchedTransaction.length === 0
        ? false
        : true;

    const logisticsId = transaction.ScheduledTransaction?.[0]?.logisticsId;

    const clientVehicle = "dbbeee0a-a2ea-44c5-b17a-b21ac4bb2788";

    if (!isTransportation) {
      isTransportation = logisticsId !== clientVehicle ? true : false;
    }

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

    const addDemurrageFee = (
      transpoFee,
      demurrageDays,
      transpoVatCalculation,
      transpoMode
    ) => {
      // Check if the mode is "CHARGE"
      if (transpoMode === "CHARGE") {
        // Add the transportation fee based on VAT calculation
        switch (transpoVatCalculation) {
          case "VAT EXCLUSIVE":
            amounts.vatExclusive += transpoFee * demurrageDays;
            break;
          case "VAT INCLUSIVE":
            amounts.vatInclusive += transpoFee * demurrageDays;
            break;
          case "NON VATABLE":
            amounts.nonVatable += transpoFee * demurrageDays;
            break;
          default:
            break;
        }
      }
    };

    // Call the function to add transportation fee
    if (isTransportation && hasTransportation) {
      addTranspoFee(transpoFee, transpoVatCalculation, transpoMode);
    }

    if (hasDemurrage) {
      addDemurrageFee(
        transpoFee,
        demurrageDays,
        transpoVatCalculation,
        transpoMode
      );
    }
  });

  const isIndividualBillingToProcess = isIndividualBilling;

  const groupedTransactions = Object.entries(
    transactions.reduce((acc, transaction) => {
      // Extract invoiceNumber from BilledTransaction

      const invoiceNumber =
        transaction.BilledTransaction?.[0]?.serviceInvoiceNumber || null;

      const typeOfWeight = transaction.CertifiedTransaction?.[0]?.typeOfWeight;

      transaction.ScheduledTransaction.forEach((scheduled) => {
        const { scheduledDate, scheduledTime } = scheduled;

        scheduled.ReceivedTransaction.forEach((received) => {
          received.SortedTransaction.forEach((sorted) => {
            sorted.SortedWasteTransaction.forEach((waste) => {
              const clientId = waste.transporterClientId;

              // Initialize client group if it doesn't exist
              if (!acc[clientId]) {
                acc[clientId] = {
                  transactions: [],
                  totals: {
                    amounts: {
                      vatExclusive: 0,
                      vatInclusive: 0,
                      nonVatable: 0,
                    },
                    credits: {
                      vatExclusive: 0,
                      vatInclusive: 0,
                      nonVatable: 0,
                    },
                  },
                };
              }

              // Create the groupedWaste object
              const groupedWaste = {
                ...waste,
                scheduledDate,
                scheduledTime,
                invoiceNumber,
                typeOfWeight,
              };

              // Add the groupedWaste to the transactions array
              acc[clientId].transactions.push(groupedWaste);

              // Process QuotationWaste.mode and vatCalculation
              const { QuotationWaste } = waste;
              if (QuotationWaste) {
                const { vatCalculation } = QuotationWaste;

                const target =
                  QuotationWaste.mode === "CHARGE" ? "amounts" : "credits";

                // Add the waste amount to the correct vatCalculation total
                const amount =
                  (QuotationWaste.unitPrice || 0) *
                  (typeOfWeight === "CLIENT WEIGHT"
                    ? waste.clientWeight || 0
                    : waste.weight || 0);

                switch (vatCalculation) {
                  case "VAT EXCLUSIVE":
                    acc[clientId].totals[target].vatExclusive += amount;
                    break;
                  case "VAT INCLUSIVE":
                    acc[clientId].totals[target].vatInclusive += amount;
                    break;
                  case "NON VATABLE":
                    acc[clientId].totals[target].nonVatable += amount;
                    break;
                  default:
                    break;
                }
              }
            });
          });
        });
      });

      return acc;
    }, {})
  ).map(([transporterClientId, data]) => ({
    transporterClientId,
    transactions: data.transactions,
    totals: data.totals,
  }));

  const vat = isIndividualBillingToProcess
    ? groupedTransactions?.totals?.amounts.vatExclusive * 0.12 +
      groupedTransactions?.totals?.amounts.vatInclusive -
      groupedTransactions?.totals?.amounts.vatInclusive / 1.12
    : amounts.vatExclusive * 0.12 +
      (amounts.vatInclusive - amounts.vatInclusive / 1.12);

  const totalAmountDue = formatNumber(
    isIndividualBillingToProcess
      ? groupedTransactions?.totals?.amounts.nonVatable +
          groupedTransactions?.totals?.amounts.vatExclusive +
          groupedTransactions?.totals?.amounts.vatInclusive / 1.12 +
          vat
      : amounts.nonVatable +
          amounts.vatExclusive +
          amounts.vatInclusive / 1.12 +
          vat
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
            Billing Number: {billingNumber ? billingNumber : ""}
          </Typography>
          <Typography variant="h5">
            Total Amount Due: {totalAmountDue}
          </Typography>
          <Typography variant="h5">
            Terms:{" "}
            {termsRemarks
              ? `${
                  terms === 0
                    ? terms === 1
                      ? `${terms} DAY`
                      : "CASH"
                    : `${terms} DAYS`
                } ${termsRemarks}`
              : ""}
          </Typography>
          <Typography variant="h5">
            Due Date:{" "}
            {dueDate ? format(new Date(dueDate), "MMMM dd, yyyy") : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks: {remarks ? remarks : "NO REMARKS"}
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
