import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import letterhead from "../../images/letterhead.jpg";
import invoice from "../../images/INVOICE.jpg";
import BillingStatementFooter from "./BillingStatementFooter";
import BillingStatementHeader from "./BillingStatementHeader";
import financeStaffSignature from "../../images/FLORES_FRANK.png";
import axios from "axios";
import BillingContent from "./BillingContent";
import BillingTableHead from "./BillingTableHead";
import Decimal from "decimal.js";
import {
  formatDate,
  formatDate2,
  formatDate3,
  formatNumber,
} from "../Functions";
import SignatureComponent from "../SignatureComponent ";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const pageHeight = 850; // Full page height (A4 paper size in pixels)
const defaultHeaderHeight = 320; // Default approximate height for header
const defaultFooterHeight = 120; // Default approximate height for footer

const BillingInvoice = ({
  row,
  verify = null,
  statementRef,
  review = false,
  bookedTransactionIds,
  isWasteNameToBill = false,
  isPerClientToBill = false,
  isIndividualBillingToBill = false,
  isIndividualWasteToBill = false,
  isChargeToBill = false,
  discount,
}) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);

  const [transactions, setTransactions] = useState([]);

  const [pagesContent, setPagesContent] = useState([]);
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [heightsReady, setHeightsReady] = useState(false);
  const [isDoneCalculation, setIsDoneCalculation] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const billedTransaction = row?.BilledTransaction?.[0] || "";

  const hasFixedRate = row?.QuotationWaste?.hasFixedRate;
  const isMonthly = row?.QuotationWaste?.isMonthly;

  // Calculate header and footer heights
  const calculateRemainingHeight = useCallback(() => {
    const headerH = headerRef.current?.offsetHeight || defaultHeaderHeight;
    const footerH = footerRef.current?.offsetHeight || defaultFooterHeight;
    setHeaderHeight(headerH);
    setFooterHeight(footerH);
    setHeightsReady(true);
  }, []);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      // setLoading(true);

      let billingStatementResponse;

      if (!review) {
        billingStatementResponse = await axios.get(
          `${REACT_APP_API_URL}/api/billedTransaction/multiple/${billedTransaction.billingNumber}`
        );
      } else {
        billingStatementResponse = await axios.get(
          `${REACT_APP_API_URL}/api/billedTransaction/review/${bookedTransactionIds}`
        );
      }

      // For pending transactions
      setTransactions(billingStatementResponse.data.bookedTransactions);
      setIsFetched(true);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [
    REACT_APP_API_URL,
    billedTransaction.billingNumber,
    review,
    bookedTransactionIds,
  ]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  let isIndividualWaste = false;
  let isChargeOnly = false;
  let hasDemurrage = false;

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
    isIndividualWaste = transaction?.BilledTransaction?.[0]?.isIndividualWaste;
    isChargeOnly = transaction?.BilledTransaction?.[0]?.isChargeOnly;

    hasDemurrage =
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

    let hasTransportation = false;
    let transportation = [];

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

        const totalWeightPrice = item.duration
          ? item.duration * selectedWeight * QuotationWaste.unitPrice
          : selectedWeight * QuotationWaste.unitPrice; // Total weight multiplied by unit price

        const target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

        hasTransportation = QuotationWaste.hasTransportation;

        // Collect transportation flags
        transportation.push(QuotationWaste.hasTransportation);

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

    // Check if any entry in transportation is false
    hasTransportation = transportation.every(Boolean);

    const transpoFee =
      parseFloat(transaction.QuotationTransportation?.unitPrice) || 0;
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

  const isIndividualBillingToProcess = isIndividualBilling
    ? isIndividualBilling
    : isIndividualBillingToBill;

  const isIndividualWasteToProcess = isIndividualWaste
    ? isIndividualWaste
    : isIndividualWasteToBill;

  const isChargeToProcess = isChargeOnly ? isChargeOnly : isChargeToBill;

  const groupedTransactions = Object.entries(
    transactions.reduce((acc, transaction) => {
      // Extract invoiceNumber from BilledTransaction

      const transpoFee =
        parseFloat(transaction.QuotationTransportation?.unitPrice) || 0;
      const transpoVatCalculation =
        transaction.QuotationTransportation?.vatCalculation;
      const transpoMode = transaction.QuotationTransportation?.mode;
      let isTransportation =
        transaction.ScheduledTransaction?.[0]?.DispatchedTransaction.length ===
        0
          ? false
          : true;

      const invoiceNumber =
        transaction.BilledTransaction?.[0]?.serviceInvoiceNumber || null;

      const typeOfWeight = transaction.CertifiedTransaction?.[0]?.typeOfWeight;

      transaction.ScheduledTransaction.forEach((scheduled) => {
        const { scheduledDate, scheduledTime } = scheduled;

        scheduled.ReceivedTransaction.forEach((received) => {
          received.SortedTransaction.forEach((sorted) => {
            sorted.SortedWasteTransaction.forEach(
              (waste, wasteIndex, wasteArray) => {
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

                const groupedWaste = {
                  ...waste,
                  scheduledDate,
                  scheduledTime,
                  invoiceNumber,
                  typeOfWeight,
                };

                acc[clientId].transactions.push(groupedWaste);

                // ==== TRANSPORTATION LOGIC HERE ====
                const isLastWaste = wasteIndex === wasteArray.length - 1;

                if (isLastWaste) {
                  const logisticsId =
                    transaction.ScheduledTransaction?.[0]?.logisticsId;
                  const clientVehicle = "dbbeee0a-a2ea-44c5-b17a-b21ac4bb2788";

                  if (!isTransportation) {
                    isTransportation = logisticsId !== clientVehicle;
                  }

                  // Get totals reference
                  const { amounts } = acc[clientId].totals;

                  const addTranspoFee = (
                    transpoFee,
                    transpoVatCalculation,
                    transpoMode
                  ) => {
                    if (transpoMode === "CHARGE") {
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

                  // Dummy sample values — replace with actual from waste/transaction
                  // const transpoFee = waste.transpoFee || 0;
                  // const transpoVatCalculation =
                  //   waste.transpoVatCalculation || "VAT EXCLUSIVE";
                  // const transpoMode = waste.transpoMode || "CHARGE";

                  if (isTransportation) {
                    addTranspoFee(
                      transpoFee,
                      transpoVatCalculation,
                      transpoMode
                    );
                  }
                }
                // ==== END TRANSPORTATION LOGIC ====

                // Process QuotationWaste.mode and vatCalculation
                const { QuotationWaste } = waste;
                if (QuotationWaste) {
                  const { vatCalculation } = QuotationWaste;

                  const target =
                    QuotationWaste.mode === "CHARGE" ? "amounts" : "credits";

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
              }
            );
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

  const qrCodeURL = `${apiUrl}/billing/${billedTransaction.id}`;

  // Recalculate height and generate content whenever row or heights change
  useEffect(() => {
    // Reset states when the row changes
    setPagesContent([]);
    setHeightsReady(false);
    setIsDoneCalculation(false);

    calculateRemainingHeight();
  }, [row, calculateRemainingHeight]);

  // Define column widths here
  const columnWidths = {
    waste: [
      "60px",
      "40px",
      "40px",
      "auto",
      "60px",
      "50px",
      "70px",
      "70px",
      "90px",
    ],
  };

  const getCellStyle = (
    isLastCell,
    width,
    alignRight = false,
    black,
    fontWeight = "normal"
  ) => ({
    padding: "2px",
    border: "1px solid black",
    borderTop: "none",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: black,
    width: width, // Apply the width
    textAlign: alignRight ? "end" : "center",
    minHeight: "22.26px",
    height: "100%",
    fontWeight: fontWeight,
  });

  const vat = isIndividualBillingToBill
    ? groupedTransactions?.totals?.amounts.vatExclusive * 0.12 +
      groupedTransactions?.totals?.amounts.vatInclusive -
      groupedTransactions?.totals?.amounts.vatInclusive / 1.12
    : amounts.vatExclusive * 0.12 +
      (amounts.vatInclusive - amounts.vatInclusive / 1.12);

  hasDemurrage =
    row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.hasDemurrage;
  const demurrageDays =
    row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.demurrageDays;

  const demurrageFee = parseFloat(row?.QuotationTransportation?.unitPrice);
  const vatCalculation = row?.QuotationTransportation?.vatCalculation;

  const discountAmount = row?.BilledTransaction?.[0]?.discountAmount || 0;

  const toBeDiscount = discountAmount ? discountAmount : discount || 0;

  const totalAmountPayable = hasDemurrage
    ? vatCalculation === "VAT EXCLUSIVE"
      ? formatNumber(
          demurrageDays * demurrageFee + demurrageDays * demurrageFee * 0.12
        )
      : formatNumber(demurrageDays * demurrageFee)
    : formatNumber(
        isIndividualBillingToBill
          ? groupedTransactions?.totals?.amounts.nonVatable +
              groupedTransactions?.totals?.amounts.vatExclusive +
              groupedTransactions?.totals?.amounts.vatInclusive / 1.12 +
              vat
          : amounts.nonVatable +
              amounts.vatExclusive +
              amounts.vatInclusive / 1.12 +
              vat
      );

  const nonVatableSales = hasDemurrage
    ? vatCalculation === "NON VATABLE"
      ? formatNumber(demurrageDays * demurrageFee)
      : 0
    : formatNumber(
        isIndividualBillingToBill
          ? groupedTransactions?.totals?.amounts.nonVatable
          : amounts.nonVatable
      );

  const vatableSales = hasDemurrage
    ? vatCalculation === "VAT EXCLUSIVE"
      ? formatNumber(demurrageDays * demurrageFee)
      : vatCalculation === "VAT INCLUSIVE"
      ? formatNumber((demurrageDays * demurrageFee) / 1.12)
      : 0
    : formatNumber(
        isIndividualBillingToBill
          ? groupedTransactions?.totals?.amounts.vatExclusive +
              groupedTransactions?.totals?.amounts.vatInclusive / 1.12
          : amounts.vatExclusive + amounts.vatInclusive / 1.12
      );

  const vatSales = hasDemurrage
    ? vatCalculation === "VAT EXCLUSIVE"
      ? formatNumber(demurrageDays * demurrageFee * 0.12)
      : vatCalculation === "VAT INCLUSIVE"
      ? formatNumber(
          demurrageDays * demurrageFee - (demurrageDays * demurrageFee) / 1.12
        )
      : 0
    : formatNumber(vat);

  const less = isChargeToProcess
    ? formatNumber(0)
    : formatNumber(
        isIndividualBillingToBill
          ? groupedTransactions?.totals?.credits.vatInclusive - toBeDiscount
          : credits.vatInclusive + credits.nonVatable + toBeDiscount
      );

  const totalAmountDue = hasDemurrage
    ? vatCalculation === "VAT EXCLUSIVE"
      ? formatNumber(
          demurrageDays * demurrageFee +
            demurrageDays * demurrageFee * 0.12 -
            toBeDiscount
        )
      : formatNumber(demurrageDays * demurrageFee + toBeDiscount)
    : formatNumber(
        isIndividualBillingToBill
          ? groupedTransactions?.totals?.amounts.nonVatable +
              groupedTransactions?.totals?.amounts.vatExclusive +
              groupedTransactions?.totals?.amounts.vatInclusive / 1.12 +
              vat -
              (isChargeToProcess
                ? 0
                : groupedTransactions?.totals?.credits.vatInclusive +
                  groupedTransactions?.totals?.credits.nonVatable) -
              toBeDiscount
          : amounts.nonVatable +
              amounts.vatExclusive +
              amounts.vatInclusive / 1.12 +
              vat -
              (isChargeToProcess
                ? 0
                : credits.vatInclusive + credits.nonVatable) -
              toBeDiscount
      );

  return (
    <>
      {isFetched && (
        <Box>
          <Box sx={{ position: "absolute", left: "-9999px", zIndex: 9999 }}>
            {/* Header */}
            <Box ref={headerRef} sx={{ zIndex: 1 }}>
              <BillingStatementHeader
                row={row}
                amounts={amounts}
                credits={credits}
                discount={discount}
                isChargeToProcess={isChargeToProcess}
              />
            </Box>

            {/* Content */}
            <Box ref={contentRef} sx={{ zIndex: 1 }}>
              <BillingContent
                transactions={transactions}
                pageHeight={pageHeight}
                headerHeight={headerHeight}
                footerHeight={footerHeight}
                setPagesContent={setPagesContent}
                setIsDoneCalculation={setIsDoneCalculation}
                heightsReady={heightsReady}
                isWasteNameToBill={
                  isWasteName ? isWasteName : isWasteNameToBill
                }
                isPerClientToBill={
                  isPerClient ? isPerClient : isPerClientToBill
                }
                isIndividualBillingToBill={
                  isIndividualBilling
                    ? isIndividualBilling
                    : isIndividualBillingToBill
                }
                isIndividualWasteToProcess={isIndividualWasteToProcess}
              />
            </Box>

            {/* Footer */}
            <Box ref={footerRef} sx={{ zIndex: 1 }}>
              <BillingStatementFooter row={row} qrCodeURL={qrCodeURL} />
            </Box>
          </Box>

          {isDoneCalculation && (
            <Box ref={statementRef}>
              <Box
                key={`PageBox${1}`}
                sx={{
                  position: "relative",
                  width: "816px",
                  height: "1056px",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                {/* Background Image */}
                {/* <Box
                  sx={{
                    position: "absolute",
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    width: "8.3in",
                    height: "10.3in",
                    backgroundImage: `url(${invoice})`,
                    backgroundSize: "cover",
                    pointerEvents: "none",
                  }}
                /> */}

                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    position: "absolute",
                    zIndex: 0,
                    top: "90px",
                    left: "120px",
                    width: "480px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.Client?.billerName}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    position: "absolute",
                    zIndex: 0,
                    top: "110px",
                    left: "120px",
                    width: "480px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.Client?.billerAddress}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    position: "absolute",
                    zIndex: 0,
                    top: "150px",
                    right: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.BilledTransaction?.[0]?.billedDate
                    ? formatDate3(row.BilledTransaction?.[0]?.billedDate)
                    : ""}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    position: "absolute",
                    zIndex: 0,
                    top: "130px",
                    left: "120px",
                  }}
                >
                  {row.Client?.billerTinNumber}
                  {row.Client?.natureOfBusiness
                    ? ` / ${row.Client?.natureOfBusiness}`
                    : ""}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "260px",
                    left: "250px",
                    fontWeight: "bold",
                  }}
                >
                  Billing Statement -{" "}
                  {row.BilledTransaction?.[0]?.billingNumber}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "281px",
                    left: "270px",
                  }}
                >
                  Total Non-Vatable Sales
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "281px",
                    right: "20px",
                  }}
                >
                  {nonVatableSales}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "302px",
                    left: "270px",
                  }}
                >
                  Total Vatable Sales
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "302px",
                    right: "20px",
                  }}
                >
                  {vatableSales}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "323px",
                    left: "270px",
                  }}
                >
                  Vat (12%)
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "323px",
                    right: "20px",
                  }}
                >
                  {vatSales}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "344px",
                    left: "250px",
                    fontWeight: "bold",
                  }}
                >
                  Total Amount Payable
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "344px",
                    right: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {totalAmountPayable}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "365px",
                    left: "270px",
                    fontWeight: "bold",
                  }}
                >
                  Less: Credits
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "365px",
                    right: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {less}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "386px",
                    left: "250px",
                    fontWeight: "bold",
                  }}
                >
                  Total Amount Due
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "386px",
                    right: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {totalAmountDue}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "680px",
                    right: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  {totalAmountDue}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "710px",
                    right: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  {vatableSales}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "785px",
                    right: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  {vatSales}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "810px",
                    right: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  {totalAmountDue}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    fontSize: "15px",
                    position: "absolute",
                    zIndex: 0,
                    top: "840px",
                    left: "60px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.BilledTransaction?.[0]?.Employee?.firstName}{" "}
                  {row.BilledTransaction?.[0]?.Employee?.lastName}
                </Typography>
                <SignatureComponent
                  signature={financeStaffSignature}
                  style={{ top: "758px", left: "80px" }}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default BillingInvoice;
