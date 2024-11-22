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
import BillingStatementFooter from "./BillingStatementFooter";
import BillingStatementHeader from "./BillingStatementHeader";
import axios from "axios";
import BillingContent from "./BillingContent";
import BillingTableHead from "./BillingTableHead";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const pageHeight = 795; // Full page height (A4 paper size in pixels)
const defaultHeaderHeight = 350; // Default approximate height for header
const defaultFooterHeight = 120; // Default approximate height for footer

const BillingStatementForm = ({ row, verify = null, statementRef }) => {
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

  const billedTransaction = row.BilledTransaction[0];

  console.log(row);

  const hasFixedRate = row.QuotationWaste?.hasFixedRate;

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
      const billingStatementResponse = await axios.get(
        `${REACT_APP_API_URL}/api/billedTransaction/multiple/${billedTransaction.billingNumber}`
      );

      // For pending transactions
      setTransactions(billingStatementResponse.data.bookedTransactions);
      setIsFetched(true);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [REACT_APP_API_URL, billedTransaction.billingNumber]);

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

  transactions.forEach((transaction) => {
    const certifiedTransaction =
      transaction.ScheduledTransaction[0].ReceivedTransaction[0]
        .SortedTransaction[0].CertifiedTransaction[0];

    const typeOfWeight = certifiedTransaction.typeOfWeight;

    const sortedWasteTransaction =
      transaction.ScheduledTransaction[0].ReceivedTransaction[0]
        .SortedTransaction[0].SortedWasteTransaction;

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

    if (hasFixedRate) {
      let totalWeight = 0;
      let vatCalculation;
      let fixedWeight;
      let fixedPrice;
      let unitPrice;
      let target;

      aggregatedWasteTransactions.forEach((item) => {
        const { weight, clientWeight, QuotationWaste } = item;

        const selectedWeight =
          typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

        totalWeight += selectedWeight; // Total weight multiplied by unit price

        target = QuotationWaste.mode === "BUYING" ? credits : amounts; // Determine if it should go to credits or amounts

        vatCalculation = QuotationWaste.vatCalculation;
        fixedWeight = QuotationWaste.fixedWeight;
        fixedPrice = QuotationWaste.fixedPrice;
        unitPrice = QuotationWaste.unitPrice;

        // switch (QuotationWaste.vatCalculation) {
        //   case "VAT EXCLUSIVE":
        //     target.vatExclusive += totalWeightPrice;
        //     break;
        //   case "VAT INCLUSIVE":
        //     target.vatInclusive += totalWeightPrice;
        //     break;
        //   case "NON VATABLE":
        //     target.nonVatable += totalWeightPrice;
        //     break;
        //   default:
        //     break;
        // }
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

      if (totalWeight > fixedWeight) {
        const excessWeight = totalWeight - fixedWeight;

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
    } else {
      // Calculate amounts and credits based on vatCalculation and mode
      aggregatedWasteTransactions.forEach((item) => {
        const { weight, clientWeight, QuotationWaste } = item;

        const selectedWeight =
          typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

        const totalWeightPrice = selectedWeight * QuotationWaste.unitPrice; // Total weight multiplied by unit price

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
    }

    const transpoFee = transaction.QuotationTransportation?.unitPrice || 0;
    const transpoVatCalculation =
      transaction.QuotationTransportation?.vatCalculation;
    const transpoMode = transaction.QuotationTransportation?.mode;

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
  });

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
    black = true
  ) => ({
    padding: "2px",
    border: "1px solid black",
    borderTop: "none",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: black ? "black" : "white",
    width: width, // Apply the width
    textAlign: alignRight ? "end" : "center",
    minHeight: "22.26px",
    height: "100%",
  });

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
              />
            </Box>

            {/* Footer */}
            <Box ref={footerRef} sx={{ zIndex: 1 }}>
              <BillingStatementFooter row={row} qrCodeURL={qrCodeURL} />
            </Box>
          </Box>

          {isDoneCalculation && (
            <Box ref={statementRef}>
              {pagesContent.map((tableData, index) => {
                if (!tableData || tableData.length === 0) {
                  return null; // Return null if there's no data
                }

                const bodyRows = {
                  BillingTableHead: {
                    header: null,
                    content: [],
                  },
                  QuotationTransportationTableHead: {
                    header: null,
                    content: [],
                  },
                };

                // Process each item in the tableData
                tableData.forEach((item, index) => {
                  bodyRows.BillingTableHead.header = <BillingTableHead />;

                  const waste = item; // Assuming item contains waste details
                  bodyRows.BillingTableHead.content.push(
                    <TableBody key={`waste-body-${index}`}>
                      <TableRow key={index} sx={{ border: "black" }}>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[0])}
                        >
                          {waste[0]}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[1])}
                        >
                          {waste[1]}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[2])}
                        >
                          {waste[2]}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[3])}
                        >
                          {waste[3]}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(
                            false,
                            columnWidths.waste[4],
                            true,
                            waste[4] ? true : false
                          )}
                        >
                          {waste[4] ? waste[4] : 0}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[5])}
                        >
                          {waste[5] ? waste[5] : ""}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[6], true)}
                        >
                          {hasFixedRate && waste[0] !== "" ? "" : waste[6]}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[7], true)}
                        >
                          {hasFixedRate && waste[0] !== "" ? "" : waste[7]}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getCellStyle(true, columnWidths.waste[8])}
                        >
                          {hasFixedRate && waste[0] !== "" ? "" : waste[8]}
                        </TableCell>
                      </TableRow>
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
                      {index === 0 && (
                        <Box>
                          <BillingStatementHeader
                            row={row}
                            amounts={amounts}
                            credits={credits}
                          />
                        </Box>
                      )}

                      {bodyRows.BillingTableHead.content.length > 1 && (
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

                      {index === pagesContent.length - 1 && (
                        <Box>
                          <BillingStatementFooter
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
                        Page {index + 1} / {pagesContent.length}
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

export default BillingStatementForm;
