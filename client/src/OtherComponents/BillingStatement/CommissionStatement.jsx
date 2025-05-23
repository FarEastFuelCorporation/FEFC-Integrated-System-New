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
import CommissionStatementFooter from "./CommissionStatementFooter";
import financeStaffSignature from "../../images/FLORES_FRANK.png";
import axios from "axios";
import BillingTableHead from "./BillingTableHead";
import Decimal from "decimal.js";
import { formatNumber } from "../Functions";
import SignatureComponent from "../SignatureComponent ";
import CommissionStatementHeader from "./CommissionStatementHeader";
import CommissionContent from "./CommissionContent";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const pageHeight = 800; // Full page height (A4 paper size in pixels)
const defaultHeaderHeight = 300; // Default approximate height for header
const defaultFooterHeight = 120; // Default approximate height for footer

const CommissionStatement = ({
  user,
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
  const [signature, setSignature] = useState([]);

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
  const commissionedTransaction = row?.CommissionedTransaction?.[0] || "";

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

      if (user?.id) {
        const signatureResponse = await axios.get(
          `${REACT_APP_API_URL}/api/employeeRecord/signature/${user?.id}`
        );

        setSignature(signatureResponse.data.signature.signature);
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
    user?.id,
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

    aggregatedWasteTransactions.forEach((item) => {
      const { weight, clientWeight, QuotationWaste } = item;

      const selectedWeight =
        typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

      const totalWeightPrice = item.duration
        ? item.duration *
          selectedWeight *
          QuotationWaste?.CommissionWaste?.[0]?.amount
        : selectedWeight * QuotationWaste?.CommissionWaste?.[0]?.amount; // Total weight multiplied by unit price

      const target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

      hasTransportation = QuotationWaste.hasTransportation;

      // Collect transportation flags
      transportation.push(QuotationWaste.hasTransportation);

      switch ("NON VATABLE") {
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
                    (QuotationWaste?.CommissionWaste?.[0]?.amount || 0) *
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

  const qrCodeURL = `${apiUrl}/commissionVerify/${commissionedTransaction.id}`;

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

  return (
    <>
      {isFetched && (
        <Box>
          <Box sx={{ position: "absolute", left: "-9999px", zIndex: 9999 }}>
            {/* Header */}
            <Box ref={headerRef} sx={{ zIndex: 1 }}>
              <CommissionStatementHeader
                row={row}
                amounts={amounts}
                credits={credits}
                discount={discount}
                isChargeToProcess={isChargeToProcess}
              />
            </Box>

            {/* Content */}
            <Box ref={contentRef} sx={{ zIndex: 1 }}>
              <CommissionContent
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
              <CommissionStatementFooter
                user={user}
                signature={signature}
                row={row}
                qrCodeURL={qrCodeURL}
              />
            </Box>
          </Box>

          {isDoneCalculation && (
            <Box ref={statementRef}>
              {pagesContent.map((tableData, index, wasteArray) => {
                if (!tableData || tableData.length === 0) {
                  return null; // Return null if there's no data
                }

                const isLastWaste = index === wasteArray.length - 1;

                const bodyRows = {
                  BillingTableHead: {
                    header: null,
                    content: [],
                  },
                };

                // Process each item in the tableData
                tableData.forEach((item, index) => {
                  if (tableData[index].length === 0) {
                    return null; // Return null if there's no data
                  }

                  bodyRows.BillingTableHead.header = <BillingTableHead />;

                  const waste = item; // Assuming item contains waste details

                  // Check if we should include this row
                  const shouldIncludeRow =
                    !isChargeToProcess || waste[9] !== "BUYING";

                  bodyRows.BillingTableHead.content.push(
                    <TableBody key={`waste-body-${index}`}>
                      {shouldIncludeRow && (
                        <>
                          <TableRow key={index} sx={{ border: "black" }}>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[0],
                                false,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {waste[0]}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[1],
                                false,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {waste[1]}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[2],

                                false,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {waste[2]}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[3],
                                false,
                                waste[9] === "BUYING" ? "red" : "black",
                                waste[9] === "CLIENT NAME" ? "bold" : "normal"
                              )}
                            >
                              {waste[3]}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[4],
                                true,
                                waste[4]
                                  ? waste[9] === "BUYING"
                                    ? "red"
                                    : "black"
                                  : "white"
                              )}
                            >
                              {waste[4] ? waste[4] : 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[5],
                                false,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {waste[5] ? waste[5] : ""}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[6],
                                true,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {waste[6]}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                false,
                                columnWidths.waste[7],
                                true,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {waste[7]}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={getCellStyle(
                                true,
                                columnWidths.waste[8],
                                false,
                                waste[9] === "BUYING" ? "red" : "black"
                              )}
                            >
                              {!hasDemurrage &&
                              hasFixedRate &&
                              isMonthly &&
                              waste[0] !== ""
                                ? ""
                                : waste[8]}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  );
                });

                return (
                  <Box
                    key={`PageBox${index}`}
                    sx={{
                      position: "relative",
                      minHeight: "1056px",
                      width: "816px",
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    {/* Background Image */}
                    <Box
                      sx={{
                        position: "absolute",
                        zIndex: 0,
                        top: 0,
                        left: 0,
                        width: "816px",
                        height: "1056px",
                        backgroundImage: `url(${letterhead})`,
                        backgroundSize: "cover",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Content */}
                    <Box
                      className="pdf_container"
                      sx={{
                        position: "absolute",
                        zIndex: 1,
                        padding: "123px 38px 38px 76px",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {/* Render Header only on the first page */}
                      {index === 0 && !isIndividualBillingToProcess && (
                        <Box>
                          <CommissionStatementHeader
                            row={row}
                            amounts={amounts}
                            credits={credits}
                            isIndividualBillingToBill={
                              isIndividualBillingToProcess
                            }
                            groupedTransactions={groupedTransactions[index]}
                            index={index}
                            discount={discount}
                            isChargeToProcess={isChargeToProcess}
                          />
                        </Box>
                      )}

                      {isIndividualBillingToProcess && (
                        <Box>
                          <CommissionStatementHeader
                            row={row}
                            amounts={amounts}
                            credits={credits}
                            isIndividualBillingToBill={
                              isIndividualBillingToProcess
                            }
                            groupedTransactions={groupedTransactions[index]}
                            index={index}
                            discount={discount}
                            isChargeToProcess={isChargeToProcess}
                          />
                        </Box>
                      )}

                      {bodyRows.BillingTableHead.content.length >= 1 && (
                        <>
                          {bodyRows.BillingTableHead.header && (
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              textAlign="center"
                              sx={{
                                borderTop: "1px solid black",
                                borderLeft: "1px solid black",
                                borderRight: "1px solid black",
                                backgroundColor: "lightgray",
                              }}
                            >
                              DETAILS
                            </Typography>
                          )}

                          {/* Render Waste Table */}
                          <Table>
                            {bodyRows.BillingTableHead.header}

                            {bodyRows.BillingTableHead.content}
                          </Table>
                        </>
                      )}

                      {index === pagesContent.length - 1 &&
                        !isIndividualBillingToProcess && (
                          <Box>
                            <CommissionStatementFooter
                              user={user}
                              signature={signature}
                              row={row}
                              qrCodeURL={qrCodeURL}
                            />
                          </Box>
                        )}

                      {isIndividualBillingToProcess && (
                        <Box>
                          <CommissionStatementFooter
                            user={user}
                            signature={signature}
                            row={row}
                            qrCodeURL={qrCodeURL}
                          />
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "20px",
                        right: "40px",
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {isIndividualBillingToProcess
                          ? `Page 1 / 1`
                          : `Page ${index + 1} / ${pagesContent.length}`}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default CommissionStatement;
