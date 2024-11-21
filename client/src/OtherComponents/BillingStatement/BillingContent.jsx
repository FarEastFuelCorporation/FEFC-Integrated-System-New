import React, { useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { formatDate2, formatNumber } from "../Functions";
import BillingTableHead from "./BillingTableHead";

const BillingContent = ({
  transactions,
  pageHeight,
  headerHeight,
  footerHeight,
  setPagesContent,
  setIsDoneCalculation,
  heightsReady,
}) => {
  const wasteTableRef = useRef(null);

  console.log(transactions);

  const hasFixedRate = transactions?.[0]?.QuotationWaste?.hasFixedRate;
  const fixedWeight = transactions?.[0]?.QuotationWaste?.fixedWeight;
  const unit = transactions?.[0]?.QuotationWaste?.unit;
  const unitPrice = transactions?.[0]?.QuotationWaste?.unitPrice;
  const fixedPrice = transactions?.[0]?.QuotationWaste?.fixedPrice;
  const vatCalculation = transactions?.[0]?.QuotationWaste?.vatCalculation;

  let totalWeight = 0;

  console.log(hasFixedRate);
  console.log(fixedPrice);
  console.log(vatCalculation);

  const firstPageHeight = pageHeight - headerHeight;
  const nextPageHeight = pageHeight;

  // Helper function to calculate total height of rows and divide into pages
  const calculatePageContent = useCallback(() => {
    const pages = [];
    let currentPage = [];
    let currentPageHeight = 0;
    let availableHeight = firstPageHeight; // First page's available height (excludes header)

    // Helper function to check if an element can fit on the current page
    const canFitOnPage = (elementHeight) => {
      return availableHeight >= elementHeight; // Ensure it's greater than or equal
    };

    // Helper function to add a page to the pages array
    const addPage = () => {
      pages.push([...currentPage]);
      currentPage = [];
      currentPageHeight = 0;
      availableHeight = nextPageHeight; // Subsequent pages' available height
    };

    // Helper function to add an element to the current page or move to next page
    const addElementToPage = (element, elementHeight) => {
      if (canFitOnPage(elementHeight)) {
        if (element !== null) {
          currentPage.push(element); // Push the element only if it's not null
        }
        currentPageHeight += elementHeight;
        availableHeight -= elementHeight;
      } else {
        addPage(); // Save current page and start a new one
        if (element !== null) {
          currentPage.push(element);
        }
        currentPageHeight += elementHeight;
        availableHeight = nextPageHeight - elementHeight;
      }
    };

    // Get the height of the Typography elements
    const wasteDetailsHeadingHeight =
      wasteTableRef.current?.previousSibling?.offsetHeight || 30; // Assume 30px if not found

    // Combine rows from both tables
    const wasteRows = wasteTableRef.current?.querySelectorAll("tr") || [];

    console.log(wasteRows);

    // Add WASTE DETAILS header
    addElementToPage(null, wasteDetailsHeadingHeight);

    // Add Waste rows
    wasteRows.forEach((row, index) => {
      // Skip the first row (index 0)
      if (index === 0) return;
      const rowHeight = row.offsetHeight; // Measure the actual row height
      const cells = Array.from(row.children); // Get <td> elements from the <tr>
      const cellContents = cells.map((cell) => cell.textContent.trim()); // Extract content from each <td>
      addElementToPage(cellContents, rowHeight); // Push the contents of the row
    });

    // Add footer only on the last page
    if (canFitOnPage(footerHeight)) {
      // If footer fits on the current page
    } else {
      // If footer doesn't fit, move it to a new page
      addPage(); // Push the current page
      currentPage.push([]); // Start a new page with the footer
    }

    // Ensure the last page is added
    if (currentPage.length > 0) {
      addPage();
    }

    console.log(pages); // Store the pages content in state
    setPagesContent(pages); // Store the pages content in state
    setIsDoneCalculation(true); // Indicate that the calculation is done
  }, [
    firstPageHeight,
    footerHeight,
    nextPageHeight,
    setIsDoneCalculation,
    setPagesContent,
  ]);

  useEffect(() => {
    if (heightsReady) {
      if (wasteTableRef.current) {
        calculatePageContent();
      }
    }
  }, [heightsReady, calculatePageContent]);

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

  return (
    <Box>
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
      <Table ref={wasteTableRef}>
        <BillingTableHead />
        <TableBody>
          {transactions
            .sort((a, b) => new Date(a.haulingDate) - new Date(b.haulingDate)) // Sort transactions by haulingDate from oldest to newest
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
                  .SortedTransaction[0].CertifiedTransaction[0].typeOfWeight;

              const wasteRows = Object.values(aggregatedWasteTransactions).map(
                (waste, idx) => {
                  // Determine the font color based on the mode
                  const fontColor =
                    waste.QuotationWaste.mode === "BUYING" ? "red" : "inherit";

                  totalWeight +=
                    typeOfWeight === "CLIENT WEIGHT"
                      ? waste.clientWeight
                      : waste.weight;
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
                }
              );

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
                          {transaction.QuotationTransportation.vatCalculation}
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
                combinedRows.push(
                  <TableRow key={`space-${index}`} sx={{ border: "black" }}>
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
                );
              });
              return combinedRows;
            })}
          {hasFixedRate && (
            <TableRow key={`add-${1}`} sx={{ border: "black" }}>
              <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({})}>TOTAL</TableCell>
              <TableCell sx={bodyCellStyles({ width: 60 })}>
                {formatNumber(totalWeight)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}>{unit}</TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
              <TableCell
                sx={bodyCellStyles({ width: 85, isLastCell: true })}
              ></TableCell>
            </TableRow>
          )}

          {hasFixedRate && (
            <TableRow key={`add-${2}`} sx={{ border: "black" }}>
              <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({})}>
                FIRST {`${formatNumber(fixedWeight)}`}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 60 })}>
                {formatNumber(fixedWeight)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}>{unit}</TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}>
                {formatNumber(fixedPrice)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 85, isLastCell: true })}>
                {vatCalculation}
              </TableCell>
            </TableRow>
          )}
          {hasFixedRate && totalWeight > fixedWeight && (
            <TableRow key={`add-${2}`} sx={{ border: "black" }}>
              <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({})}>EXCESS QUANTITY:</TableCell>
              <TableCell sx={bodyCellStyles({ width: 60 })}>
                {formatNumber(totalWeight - fixedWeight)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}>{unit}</TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}>
                {unitPrice}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}>
                {formatNumber((totalWeight - fixedWeight) * unitPrice)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 85, isLastCell: true })}>
                {vatCalculation}
              </TableCell>
            </TableRow>
          )}
          {hasFixedRate && (
            <TableRow key={`add-${3}`} sx={{ border: "black" }}>
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
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default BillingContent;
