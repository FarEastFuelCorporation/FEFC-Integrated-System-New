import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

import letterhead from "../../images/letterhead.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BillingStatementFooter from "./BillingStatementFooter";
import BillingStatementHeader from "./BillingStatementHeader";
import { formatDate2, formatNumber } from "../Functions";
import axios from "axios";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const pageHeight = 895; // Full page height (A4 paper size in pixels)
const defaultHeaderHeight = 350; // Default approximate height for header
const defaultHeaderHeight2 = 90; // Default approximate height for header
const defaultFooterHeight = 120; // Default approximate height for footer

const BillingStatementForm = ({ row, verify = null }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);
  const certificateRef = useRef();

  const [transactions, setTransactions] = useState([]);

  const billedTransaction = row.BilledTransaction[0];

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

  const totalRows = 17;
  let hasChargeRow = 0;
  let transactionRows = 0;
  let blankRowsNeeded = 0;

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

    transactionRows += aggregatedWasteTransactions.length;

    const transpoFee = transaction.QuotationTransportation.unitPrice;
    const transpoVatCalculation =
      transaction.QuotationTransportation.vatCalculation;
    const transpoMode = transaction.QuotationTransportation.mode;

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

    hasChargeRow +=
      transaction.QuotationTransportation.mode === "CHARGE" ? 1 : 0;
  });

  blankRowsNeeded = totalRows - (transactionRows + hasChargeRow);

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, pageHeight], // Page size in px
      });

      // Add the captured image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      // Save the generated PDF
      pdf.save(`${"B24-09-001"}-${row.Client.clientName}.pdf`);
    });
  };

  const handleOpenPDFInNewTab = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, pageHeight], // Page size in px
      });

      // Add the captured image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      // Generate the PDF and open it in a new tab
      const pdfUrl = pdf.output("bloburl");
      window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
    });
  };

  const qrCodeURL = `${apiUrl}/billing/${billedTransaction.id}`;

  const headerCellStyles = (isLastCell) => ({
    fontWeight: "bold",
    fontSize: "12px",
    padding: "2px",
    border: "1px solid black",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: "black",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  });

  const bodyCellStyles = ({
    isLastCell = false,
    notCenter = false,
    width = "auto",
  } = {}) => ({
    fontSize: "10px",
    padding: "2px",
    border: "1px solid black",
    borderTop: "none",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: "black",
    textAlign: notCenter ? "right" : "center",
    width: typeof width === "number" ? `${width}px` : width, // Apply width as px if it's a number, otherwise use as-is
    fontFamily: "'Poppins', sans-serif",
    height: "20px",
  });

  const generatePDFContent = () => (
    <Box
      ref={certificateRef}
      sx={{
        position: "absolute",
        // left: verify ? "0" : "-9999px",
        padding: "123px 38px 38px 76px",
        minHeight: "1056px", // Ensure at least one page height
        width: "816px",
        backgroundColor: "white",
        color: "black",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "816px",
          height: "1056px",
          zIndex: 0,
          backgroundImage: `url(${letterhead})`,
          backgroundSize: "cover",
          pointerEvents: "none", // Ensure the background image is not clickable
        }}
      />
      <Box sx={{ zIndex: 1, position: "relative" }}>
        <BillingStatementHeader row={row} amounts={amounts} credits={credits} />

        <Box>
          {" "}
          <Typography
            sx={{
              variant: "h5",
              fontWeight: "bold",
              textAlign: "center",
              border: "1px solid black",
              borderBottom: "none",
              backgroundColor: "lightgray",
            }}
          >
            DETAILS
          </Typography>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "white",
              color: "black !important",
            },
            "& .MuiTableContainer-root": {
              backgroundColor: "white",
              color: "black !important",
            },
            fontFamily: "Times New Roman",
            backgroundColor: "white",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ border: "black" }}>
                <TableCell sx={headerCellStyles(false)}>Date</TableCell>
                <TableCell sx={headerCellStyles(false)}>D.R.#</TableCell>
                <TableCell sx={headerCellStyles(false)}>S.I.#</TableCell>
                <TableCell sx={headerCellStyles(false)}>Description</TableCell>
                <TableCell sx={headerCellStyles(false)}>Qty</TableCell>
                <TableCell sx={headerCellStyles(false)}>Unit</TableCell>
                <TableCell sx={headerCellStyles(false)}>Unit Price</TableCell>
                <TableCell sx={headerCellStyles(false)}>Amount</TableCell>
                <TableCell sx={headerCellStyles(true)}>
                  Vat Calculation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .sort(
                  (a, b) => new Date(a.haulingDate) - new Date(b.haulingDate)
                ) // Sort transactions by haulingDate from oldest to newest
                .map((transaction, index) => {
                  // Check if aggregatedWasteTransactions need to be mapped
                  const aggregatedWasteTransactions =
                    transaction.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0].SortedWasteTransaction.reduce(
                      (acc, current) => {
                        const { id } = current.QuotationWaste;

                        if (acc[id]) {
                          acc[id].weight += current.weight;
                        } else {
                          acc[id] = { ...current, weight: current.weight };
                        }

                        return acc;
                      },
                      {}
                    );

                  const invoiceNumber =
                    transaction.BilledTransaction[0].serviceInvoiceNumber;
                  const typeOfWeight =
                    transaction.ScheduledTransaction[0].ReceivedTransaction[0]
                      .SortedTransaction[0].CertifiedTransaction[0]
                      .typeOfWeight;

                  const wasteRows = Object.values(
                    aggregatedWasteTransactions
                  ).map((waste, idx) => {
                    // Determine the font color based on the mode
                    const fontColor =
                      waste.QuotationWaste.mode === "BUYING"
                        ? "red"
                        : "inherit";

                    return (
                      <TableRow key={`waste-${idx}`} sx={{ border: "black" }}>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({ width: 60, color: fontColor }),
                          }}
                        >
                          {formatDate2(transaction.haulingDate)}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({ width: 40, color: fontColor }),
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({ width: 40, color: fontColor }),
                          }}
                        >
                          {invoiceNumber}
                        </TableCell>
                        <TableCell
                          sx={{ ...bodyCellStyles({ color: fontColor }) }}
                        >
                          {waste.QuotationWaste.wasteName}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({
                              width: 60,
                              notCenter: true,
                              color: fontColor,
                            }),
                          }}
                        >
                          {typeOfWeight === "CLIENT WEIGHT"
                            ? `${formatNumber(waste.clientWeight)}`
                            : `${formatNumber(waste.weight)}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({ width: 40, color: fontColor }),
                          }}
                        >
                          {waste.QuotationWaste.unit}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({
                              width: 80,
                              notCenter: true,
                              color: fontColor,
                            }),
                          }}
                        >
                          {formatNumber(waste.QuotationWaste.unitPrice)}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({
                              width: 80,
                              notCenter: true,
                              color: fontColor,
                            }),
                          }}
                        >
                          {typeOfWeight === "CLIENT WEIGHT"
                            ? `${formatNumber(
                                waste.clientWeight *
                                  waste.QuotationWaste.unitPrice
                              )}`
                            : `${formatNumber(
                                waste.weight * waste.QuotationWaste.unitPrice
                              )}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({
                              width: 85,
                              isLastCell: true,
                              color: fontColor,
                            }),
                          }}
                        >
                          {waste.QuotationWaste.vatCalculation}
                        </TableCell>
                      </TableRow>
                    );
                  });

                  // Add the transportation row if applicable
                  const transpoRows =
                    transaction.QuotationTransportation.mode === "CHARGE"
                      ? [
                          <TableRow
                            key={`transpo-${index}`}
                            sx={{ border: "black" }}
                          >
                            <TableCell sx={bodyCellStyles({ width: 60 })}>
                              {formatDate2(transaction.haulingDate)}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({ width: 40 })}
                            ></TableCell>
                            <TableCell sx={bodyCellStyles({ width: 40 })}>
                              {invoiceNumber}
                            </TableCell>
                            <TableCell sx={bodyCellStyles()}>
                              {`TRANS FEE ${transaction.QuotationTransportation.VehicleType.typeOfVehicle}`}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 60,
                                notCenter: true,
                              })}
                            >
                              {`${formatNumber(1)}`}
                            </TableCell>
                            <TableCell sx={bodyCellStyles({ width: 40 })}>
                              {transaction.QuotationTransportation.unit}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 80,
                                notCenter: true,
                              })}
                            >
                              {formatNumber(
                                transaction.QuotationTransportation.unitPrice
                              )}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 80,
                                notCenter: true,
                              })}
                            >
                              {formatNumber(
                                transaction.QuotationTransportation.unitPrice
                              )}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                              })}
                            >
                              {
                                transaction.QuotationTransportation
                                  .vatCalculation
                              }
                            </TableCell>
                          </TableRow>,
                        ]
                      : [];

                  // Combine waste and transportation rows for alternating display
                  const combinedRows = [];

                  wasteRows.forEach((wasteRow, idx) => {
                    combinedRows.push(wasteRow);
                    if (transpoRows.length > 0) {
                      // Push transpo row after every waste row
                      combinedRows.push(transpoRows[0]); // Only one transpo row per transaction
                    }
                  });

                  return combinedRows;
                })}

              {Array.from({ length: blankRowsNeeded }, (_, index) => (
                <TableRow key={index + 1} sx={{ border: "black" }}>
                  <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                  <TableCell sx={bodyCellStyles({})}>{""}</TableCell>
                  <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
                  <TableCell
                    sx={bodyCellStyles({ width: 85, isLastCell: true })}
                  ></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <BillingStatementFooter row={row} qrCodeURL={qrCodeURL} />
    </Box>
  );

  return (
    <Box>
      {verify ? (
        ""
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownloadPDF}
          >
            Download Billing Statement
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenPDFInNewTab}
          >
            View Billing Statement
          </Button>
        </Box>
      )}

      {generatePDFContent()}
    </Box>
  );
};

export default BillingStatementForm;
