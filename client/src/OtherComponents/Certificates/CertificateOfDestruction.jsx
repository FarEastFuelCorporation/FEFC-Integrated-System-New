import React, { useRef } from "react";
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
} from "@mui/material";

import letterhead from "../../images/letterhead.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateOfDestructionHeader from "./CertificateOfDestructionHeader";
import {
  CertificateOfDestructionFooter1,
  CertificateOfDestructionFooter2,
} from "./CertificateOfDestructionFooter";
import CertificateOfAcceptanceHeader from "./CertificateOfAcceptanceHeader";
import {
  CertificateOfAcceptanceFooter1,
  CertificateOfAcceptanceFooter2,
} from "./CertificateOfAcceptanceFooter";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const CertificateOfDestruction = ({ row, verify = null }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);
  const certificateRef = useRef();

  const certifiedTransaction =
    row.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
      .SortedTransaction?.[0].CertifiedTransaction?.[0];

  const typeOfCertificateArray = certifiedTransaction.typeOfCertificate
    ? certifiedTransaction.typeOfCertificate.split(", ")
    : [];

  const sortedWasteTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .SortedWasteTransaction;

  const typeOfWeight = certifiedTransaction?.typeOfWeight;

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, save the PDF
        pdf.save(
          `${certifiedTransaction?.certificateNumber.substring(3)}-${
            row.Client.clientName
          }.pdf`
        );
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  const handleViewPDF = () => {
    const input = certificateRef.current;

    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, generate the PDF
        const pdfOutput = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const formatNumber = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const qrCodeURL = `${apiUrl}/certificate/${certifiedTransaction?.id}`;

  const headerCellStyles = (isLastCell) => ({
    fontWeight: "bold",
    fontSize: "14px",
    padding: "2px",
    border: "1px solid black",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: "black",
    textAlign: "center",
  });

  const bodyCellStyles = (isLastCell) => ({
    fontSize: "12px",
    padding: "2px",
    border: "1px solid black",
    borderTop: "none",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: "black",
    textAlign: "center",
  });

  const generatePDFContent = () => (
    <Box ref={certificateRef}>
      {typeOfCertificateArray.map((typeOfCertificate) => {
        return (
          <Box
            key={`${typeOfCertificate}`}
            sx={{
              position: "absolute",
              left: verify ? "0" : "-9999px",
              padding: "123px 38px 38px 76px",
              minHeight: "1056px", // Ensure at least one page height
              width: "816px",
              backgroundColor: "white",
              color: "black",
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
              {typeOfCertificate === "CERTIFICATE OF ACCEPTANCE" ? (
                <CertificateOfAcceptanceHeader
                  row={row}
                  certifiedTransaction={certifiedTransaction}
                />
              ) : (
                <CertificateOfDestructionHeader
                  row={row}
                  certifiedTransaction={certifiedTransaction}
                />
              )}
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
                      <TableCell sx={headerCellStyles(false)}>
                        Date Hauled
                      </TableCell>
                      <TableCell sx={headerCellStyles(false)}>
                        Class and Description of Waste
                      </TableCell>

                      {typeOfCertificate === "CERTIFICATE OF ACCEPTANCE" ? (
                        <>
                          <TableCell sx={headerCellStyles(false)}>
                            Quantity
                          </TableCell>
                          <TableCell
                            sx={headerCellStyles(
                              typeOfCertificate === "CERTIFICATE OF ACCEPTANCE"
                            )}
                          >
                            Unit
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell sx={headerCellStyles(false)}>
                            Waste Code
                          </TableCell>
                          <TableCell
                            sx={headerCellStyles(
                              typeOfCertificate === "CERTIFICATE OF ACCEPTANCE"
                            )}
                          >
                            Quantity
                          </TableCell>
                          <TableCell sx={headerCellStyles(false)}>
                            Destruction Process
                          </TableCell>
                          <TableCell sx={headerCellStyles(true)}>
                            Date of Completion
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedWasteTransaction.map((waste, index) => {
                      console.log(waste.TreatedWasteTransaction);
                      return (
                        <TableRow key={index} sx={{ border: "black" }}>
                          <TableCell sx={bodyCellStyles(false)}>
                            {formatDate(row.haulingDate)}
                          </TableCell>
                          <TableCell sx={bodyCellStyles(false)}>
                            {waste.wasteName}
                          </TableCell>

                          {typeOfCertificate === "CERTIFICATE OF ACCEPTANCE" ? (
                            <>
                              <TableCell sx={bodyCellStyles(false)}>
                                {typeOfWeight === "CLIENT WEIGHT"
                                  ? formatNumber(waste.clientWeight)
                                  : formatNumber(waste.weight)}
                              </TableCell>
                              <TableCell
                                sx={bodyCellStyles(
                                  typeOfCertificate ===
                                    "CERTIFICATE OF ACCEPTANCE"
                                )}
                              >
                                {waste.QuotationWaste.unit}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={bodyCellStyles(false)}>
                                {waste.QuotationWaste.TypeOfWaste.wasteCode}
                              </TableCell>
                              <TableCell
                                sx={bodyCellStyles(
                                  typeOfCertificate ===
                                    "CERTIFICATE OF ACCEPTANCE"
                                )}
                              >
                                {typeOfWeight === "CLIENT WEIGHT"
                                  ? `${formatNumber(waste.clientWeight)} ${
                                      waste.QuotationWaste.unit
                                    }`
                                  : `${formatNumber(waste.weight)} ${
                                      waste.QuotationWaste.unit
                                    }`}
                              </TableCell>
                              <TableCell sx={bodyCellStyles(false)}>
                                {
                                  waste.TreatedWasteTransaction?.[0]
                                    ?.TreatmentMachine?.TreatmentProcess
                                    ?.treatmentProcess
                                }
                              </TableCell>
                              <TableCell sx={bodyCellStyles(true)}>
                                {waste.TreatedWasteTransaction.length !== 0
                                  ? waste.TreatedWasteTransaction.reduce(
                                      (latest, transaction) => {
                                        const treatedDate = new Date(
                                          transaction.treatedDate
                                        );
                                        return treatedDate > new Date(latest)
                                          ? formatDate(transaction.treatedDate)
                                          : formatDate(latest);
                                      },
                                      new Date(0)
                                    )
                                  : ""}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {typeOfCertificate === "CERTIFICATE OF ACCEPTANCE" ? (
                <>
                  <CertificateOfAcceptanceFooter1
                    row={row}
                    sortedWasteTransaction={sortedWasteTransaction}
                  />
                  <CertificateOfAcceptanceFooter2 qrCodeURL={qrCodeURL} />
                </>
              ) : (
                <>
                  <CertificateOfDestructionFooter1
                    row={row}
                    sortedWasteTransaction={sortedWasteTransaction}
                  />
                  <CertificateOfDestructionFooter2 qrCodeURL={qrCodeURL} />
                </>
              )}
            </Box>
          </Box>
        );
      })}
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
            Download Certificate
          </Button>
          <Button variant="contained" color="secondary" onClick={handleViewPDF}>
            View Certificate
          </Button>
        </Box>
      )}

      {generatePDFContent()}
    </Box>
  );
};

export default CertificateOfDestruction;
