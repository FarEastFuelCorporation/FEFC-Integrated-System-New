import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import letterhead from "../../images/letterhead.jpg";
import QuotationHeader from "./QuotationHeader";
import QuotationFooter from "./QuotationFooter";
import QuotationContent from "./QuotationContent";
import QuotationWasteTableHead from "./QuotationWasteTableHead";
import QuotationTransportationTableHead from "./QuotationTransportationTableHead";
import { formatNumber } from "../Functions";

const calculateTotal = (row) => {
  let totalAmount = 0;
  let vatCalculation = null; // Initialize VAT calculation

  // Helper function to calculate for each item
  const calculateItemTotal = (items) => {
    items.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;

      // Set VAT calculation from the first item
      if (vatCalculation === null && item.vatCalculation) {
        vatCalculation = item.vatCalculation; // Get VAT calculation from the first item
      }

      // Check mode and adjust totalAmount accordingly
      if (item.mode === "CHARGE") {
        totalAmount += itemTotal; // Add for 'charge' mode
      } else if (item.mode === "BUYING") {
        totalAmount -= itemTotal; // Subtract for 'buying' mode
      }
    });
  };

  // Calculate totals for QuotationWaste and QuotationTransportation
  if (Array.isArray(row.QuotationWaste)) {
    calculateItemTotal(row.QuotationWaste);
  }

  if (Array.isArray(row.QuotationTransportation)) {
    calculateItemTotal(row.QuotationTransportation);
  }

  // Return totalAmount and the VAT calculation
  return { totalAmount, vatCalculation };
};

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const pageHeight = 895; // Full page height (A4 paper size in pixels)
const defaultHeaderHeight = 150; // Default approximate height for header
const defaultFooterHeight = 100; // Default approximate height for footer

const QuotationForm = forwardRef(({ row, setIsContentReady }, ref) => {
  const REACT_APP_API_URL = useMemo(() => process.env.REACT_APP_API_URL, []);
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);

  const [pagesContent, setPagesContent] = useState([]);
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [heightsReady, setHeightsReady] = useState(false);
  const [isDoneCalculation, setIsDoneCalculation] = useState(false);

  const qrCodeURL = `${apiUrl}/quotationForm/${row.id}`;

  // Calculate header and footer heights
  const calculateRemainingHeight = useCallback(() => {
    const headerH = headerRef.current?.offsetHeight || defaultHeaderHeight;
    const footerH = footerRef.current?.offsetHeight || defaultFooterHeight;
    setHeaderHeight(headerH);
    setFooterHeight(footerH);
    setHeightsReady(true);
  }, []);

  // This function will be responsible for creating the PDF content
  const generatePDFContent = useCallback(() => {
    setIsContentReady(true);

    // You can now set the pagesContent array once it is processed
  }, [setIsContentReady]);

  // Recalculate height and generate content whenever row or heights change
  useEffect(() => {
    // Reset states when the row changes
    setPagesContent([]);
    setHeightsReady(false);
    setIsDoneCalculation(false);

    calculateRemainingHeight();
  }, [row, calculateRemainingHeight]);

  useEffect(() => {
    if (isDoneCalculation) {
      generatePDFContent();
    }
  }, [isDoneCalculation, generatePDFContent]);

  return (
    <Box>
      <Box sx={{ position: "absolute", left: "-9999px", zIndex: 9999 }}>
        {/* Header */}
        <Box ref={headerRef} sx={{ zIndex: 1 }}>
          <QuotationHeader quotationData={row} />
        </Box>

        {/* Content */}
        <Box ref={contentRef} sx={{ zIndex: 1 }}>
          <QuotationContent
            quotationData={row}
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
          <QuotationFooter quotationData={row} qrCodeURL={qrCodeURL} />
        </Box>
      </Box>

      {isDoneCalculation && (
        <Box ref={ref}>
          {pagesContent.map((tableData, index) => {
            if (!tableData || tableData.length === 0) {
              return null; // Return null if there's no data
            }

            const bodyRows = {
              QuotationWasteTableHead: {
                header: null,
                content: [],
              },
              QuotationTransportationTableHead: {
                header: null,
                content: [],
              },
            };

            // Define column widths here
            const columnWidths = {
              waste: [
                "40px",
                "auto",
                row.isOneTime && "50px",
                "40px",
                "70px",
                row.isOneTime && "70px",
                "100px",
                "100px",
              ],
              transportation: [
                "40px",
                "auto",
                "auto",
                row.isOneTime && "50px",
                "40px",
                "70px",
                row.isOneTime && "70px",
                "100px",
                "100px",
              ],
            };

            const getCellStyle = (isLastCell, width) => ({
              padding: "2px",
              border: "1px solid black",
              borderTop: "none",
              borderRight: isLastCell ? "1px solid black" : "none",
              color: "black",
              width: width, // Apply the width
            });

            // Process each item in the tableData
            tableData.forEach((item, index) => {
              if (item[0] === "Item" && item[1] === "Description of Waste") {
                bodyRows.QuotationWasteTableHead.header = (
                  <QuotationWasteTableHead row={row} />
                );
              } else if (item[0] === "Item" && item[1] === "Vehicle Type") {
                bodyRows.QuotationTransportationTableHead.header = (
                  <QuotationTransportationTableHead row={row} />
                );
              } else if (
                item[0] &&
                !isNaN(parseInt(item[0])) &&
                item.length === 8
              ) {
                const waste = item; // Assuming item contains waste details
                bodyRows.QuotationWasteTableHead.content.push(
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
                      {row.isOneTime && (
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[2])}
                        >
                          {waste[2]}
                        </TableCell>
                      )}
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.waste[3])}
                      >
                        {waste[3]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.waste[4])}
                      >
                        {formatNumber(waste[4])}
                      </TableCell>
                      {row.isOneTime && (
                        <TableCell
                          align="center"
                          sx={getCellStyle(false, columnWidths.waste[5])}
                        >
                          {formatNumber(waste[5])}
                        </TableCell>
                      )}
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.waste[6])}
                      >
                        {waste[6]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={getCellStyle(true, columnWidths.waste[7])}
                      >
                        {waste[7]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              } else if (
                item[0] &&
                !isNaN(parseInt(item[0])) &&
                item.length === 9
              ) {
                const transportation = item; // Assuming item contains transportation details
                bodyRows.QuotationTransportationTableHead.content.push(
                  <TableBody key={`transport-body-${index}`}>
                    <TableRow key={index} sx={{ border: "black" }}>
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.transportation[0])}
                      >
                        {transportation[0]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.transportation[1])}
                      >
                        {transportation[1]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.transportation[2])}
                      >
                        {transportation[2]}
                      </TableCell>
                      {row.isOneTime && (
                        <TableCell
                          align="center"
                          sx={getCellStyle(
                            false,
                            columnWidths.transportation[3]
                          )}
                        >
                          {transportation[3]}
                        </TableCell>
                      )}
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.transportation[4])}
                      >
                        {transportation[4]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.transportation[5])}
                      >
                        {formatNumber(transportation[5])}
                      </TableCell>
                      {row.isOneTime && (
                        <TableCell
                          align="center"
                          sx={getCellStyle(
                            false,
                            columnWidths.transportation[6]
                          )}
                        >
                          {formatNumber(transportation[6])}
                        </TableCell>
                      )}
                      <TableCell
                        align="center"
                        sx={getCellStyle(false, columnWidths.transportation[7])}
                      >
                        {transportation[7]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={getCellStyle(true, columnWidths.transportation[8])}
                      >
                        {transportation[8]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              }
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
                      <QuotationHeader quotationData={row} />
                    </Box>
                  )}

                  {bodyRows.QuotationWasteTableHead.header && (
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      WASTE CLASSIFICATION
                    </Typography>
                  )}
                  {/* Render Waste Table */}
                  <Table>
                    {bodyRows.QuotationWasteTableHead.header}

                    {bodyRows.QuotationWasteTableHead.content}
                  </Table>

                  {bodyRows.QuotationTransportationTableHead.header && (
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      TRANSPORTATION DETAILS
                    </Typography>
                  )}
                  {/* Render Transportation Table */}
                  <Table>
                    {bodyRows.QuotationTransportationTableHead.header}

                    {bodyRows.QuotationTransportationTableHead.content}
                  </Table>
                  {row.isOneTime && (
                    <>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        SUMMARY
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          border: "1px solid black",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: "calc(100% - 270px)",
                            borderRight: "1px solid black",
                            textAlign: "end",
                            paddingX: "10px",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          Total Amount:
                        </Box>
                        <Box
                          sx={{
                            width: "70px",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {formatNumber(calculateTotal(row).totalAmount)}
                        </Box>
                        <Box
                          sx={{
                            width: "100px",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          Vat Calculation:
                        </Box>
                        <Box
                          sx={{
                            width: "100px",
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {calculateTotal(row).vatCalculation}
                        </Box>
                      </Box>
                    </>
                  )}
                  {index === pagesContent.length - 1 && (
                    <Box>
                      <QuotationFooter
                        quotationData={row}
                        qrCodeURL={qrCodeURL}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
});

export default QuotationForm;
