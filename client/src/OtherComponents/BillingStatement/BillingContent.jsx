import React, { useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { formatDate2, formatNumber, formatNumber2 } from "../Functions";
import BillingTableHead from "./BillingTableHead";
import Decimal from "decimal.js";

const BillingContent = ({
  transactions,
  pageHeight,
  headerHeight,
  footerHeight,
  setPagesContent,
  setIsDoneCalculation,
  heightsReady,
  isWasteNameToBill = false,
  isPerClientToBill = false,
}) => {
  const wasteTableRef = useRef(null);

  const hasFixedRate = transactions?.[0]?.QuotationWaste?.hasFixedRate;
  const fixedWeight = transactions?.[0]?.QuotationWaste?.fixedWeight;
  const unit = transactions?.[0]?.QuotationWaste?.unit;
  const unitPrice = transactions?.[0]?.QuotationWaste?.unitPrice;
  const fixedPrice = transactions?.[0]?.QuotationWaste?.fixedPrice;
  const vatCalculation = transactions?.[0]?.QuotationWaste?.vatCalculation;
  const isMonthly = transactions?.[0]?.QuotationWaste?.isMonthly;
  const remarks = transactions?.[0]?.BilledTransaction?.[0]?.remarks;

  let totalWeight = 0;

  const firstPageHeight = pageHeight - headerHeight;
  const nextPageHeight = pageHeight - 50;

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

    // Add WASTE DETAILS header
    addElementToPage(null, wasteDetailsHeadingHeight);

    // Add Waste rows
    wasteRows.forEach((row, index) => {
      // Skip the first row (index 0)
      if (index === 0) return;

      const cells = Array.from(row.children); // Get <td> elements from the <tr>

      // Check if the first <td> content is empty
      const isFirstCellEmpty = cells[0]?.textContent.trim() === "";

      // Set rowHeight based on the first <td> content
      const rowHeight = isFirstCellEmpty ? 22 : row.offsetHeight;

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
  }, [
    heightsReady,
    calculatePageContent,
    isWasteNameToBill,
    isPerClientToBill,
  ]);

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

  let clientNames = [];

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
            .sort(
              (a, b) =>
                new Date(a.ScheduledTransaction[0].scheduledDate) -
                new Date(b.ScheduledTransaction[0].scheduledDate)
            ) // Sort transactions by haulingDate from oldest to newest
            .map((transaction, index) => {
              // Check if aggregatedWasteTransactions need to be mapped

              let aggregatedWasteTransactions;

              console.log(transaction);

              const hasDemurrage =
                transaction?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                  ?.hasDemurrage || false;
              const demurrageDays =
                transaction?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                  ?.demurrageDays || 0;

              console.log(hasDemurrage);

              if (isPerClientToBill) {
                aggregatedWasteTransactions =
                  transaction.ScheduledTransaction[0].ReceivedTransaction[0]
                    .SortedTransaction[0].SortedWasteTransaction;

                aggregatedWasteTransactions.sort((a, b) => {
                  const clientNameA = a.TransporterClient?.clientName || "";
                  const clientNameB = b.TransporterClient?.clientName || "";

                  return clientNameA.localeCompare(clientNameB); // Compare client names alphabetically
                });
              } else {
                aggregatedWasteTransactions = Object.values(
                  transaction.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0].SortedWasteTransaction.reduce(
                    (acc, current) => {
                      const { id } = current.QuotationWaste;

                      const currentWeight = new Decimal(current.weight); // Use Decimal.js
                      const currentClientWeight = new Decimal(
                        current.clientWeight
                      ); // Use Decimal.js

                      if (acc[id]) {
                        acc[id].weight = acc[id].weight.plus(currentWeight);
                        acc[id].clientWeight =
                          acc[id].clientWeight.plus(currentClientWeight);
                      } else {
                        acc[id] = {
                          ...current,
                          weight: currentWeight,
                          clientWeight: currentClientWeight,
                        };
                      }

                      return acc;
                    },
                    {}
                  )
                ).map((item) => ({
                  ...item,
                  weight: item.weight.toNumber(), // Convert Decimal back to a standard number
                }));
              }

              const invoiceNumber =
                transaction.BilledTransaction?.[0]?.serviceInvoiceNumber;
              const typeOfWeight =
                transaction.ScheduledTransaction[0].ReceivedTransaction[0]
                  .SortedTransaction?.[0]?.CertifiedTransaction?.[0]
                  ?.typeOfWeight || "SORTED WEIGHT";

              const scheduledTransaction =
                transaction.ScheduledTransaction?.[0];

              const wasteRows = Object.values(aggregatedWasteTransactions).map(
                (waste, idx) => {
                  // Determine the font color based on the mode
                  const fontColor =
                    waste.QuotationWaste.mode === "BUYING" ? "red" : "inherit";

                  const usedWeight =
                    typeOfWeight === "CLIENT WEIGHT"
                      ? waste.clientWeight
                      : waste.weight;

                  totalWeight +=
                    typeOfWeight === "CLIENT WEIGHT"
                      ? waste.clientWeight
                      : waste.weight;

                  const wasteName =
                    transaction.ScheduledTransaction?.[0]
                      ?.ReceivedTransaction?.[0]?.SortedTransaction?.[0]
                      ?.SortedWasteTransaction?.[0]?.wasteName;

                  const isWasteName =
                    transaction.BilledTransaction?.[0]?.isWasteName;

                  const clientName = waste.TransporterClient?.clientName;

                  let newClient = false;

                  if (clientName) {
                    newClient = !clientNames.includes(clientName);

                    if (newClient) {
                      clientNames.push(clientName);
                    }
                  }

                  const hasFixedRateIndividual =
                    waste.QuotationWaste?.hasFixedRate;

                  return (
                    <>
                      {newClient && isPerClientToBill && (
                        <TableRow
                          key={`wasteH-${idx}`}
                          sx={{ border: "black" }}
                        >
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 60,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 40,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 40,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                color: fontColor,
                              }),
                            }}
                          >
                            {clientName}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 60,
                                notCenter: true,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 40,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 80,
                                notCenter: true,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 80,
                                notCenter: true,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                                color: fontColor,
                              }),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                                color: fontColor,
                              }),
                            }}
                          >
                            {"CLIENT NAME"}
                          </TableCell>
                          {isWasteName && (
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 85,
                                  isLastCell: true,
                                  color: fontColor,
                                }),
                              }}
                            >
                              {wasteName}
                            </TableCell>
                          )}
                          {isWasteName && (
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 85,
                                  isLastCell: true,
                                  color: fontColor,
                                }),
                              }}
                            >
                              {isWasteName ? "true" : "false"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                      <TableRow key={`waste-${idx}`} sx={{ border: "black" }}>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({ width: 60, color: fontColor }),
                          }}
                        >
                          {formatDate2(scheduledTransaction.scheduledDate)}
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
                          {hasFixedRateIndividual && !isMonthly
                            ? isWasteNameToBill
                              ? `${waste.wasteName} (FIRST ${fixedWeight} ${unit})`
                              : `${waste.QuotationWaste.wasteName} (FIRST ${fixedWeight} ${unit})`
                            : isWasteNameToBill
                            ? waste.wasteName
                            : waste.QuotationWaste.wasteName}
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
                          {hasFixedRateIndividual &&
                          !isMonthly &&
                          usedWeight > fixedWeight
                            ? formatNumber2(fixedWeight)
                            : formatNumber2(new Decimal(usedWeight).toNumber())}
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
                          {formatNumber2(waste.QuotationWaste.unitPrice)}
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
                          {hasFixedRateIndividual && !isMonthly
                            ? formatNumber2(fixedPrice)
                            : formatNumber(
                                new Decimal(usedWeight).toNumber() *
                                  waste.QuotationWaste.unitPrice
                              )}
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
                        <TableCell
                          sx={{
                            ...bodyCellStyles({
                              width: 85,
                              isLastCell: true,
                              color: fontColor,
                            }),
                          }}
                        >
                          {waste.QuotationWaste.mode}
                        </TableCell>
                        {isWasteName && (
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                                color: fontColor,
                              }),
                            }}
                          >
                            {wasteName}
                          </TableCell>
                        )}

                        {isWasteName && (
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                                color: fontColor,
                              }),
                            }}
                          >
                            {isWasteName ? "true" : "false"}
                          </TableCell>
                        )}
                      </TableRow>
                      {hasFixedRateIndividual &&
                        !isMonthly &&
                        usedWeight > fixedWeight && (
                          <TableRow
                            key={`waste2-${idx}`}
                            sx={{ border: "black" }}
                          >
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 60,
                                  color: fontColor,
                                }),
                              }}
                            >
                              {formatDate2(scheduledTransaction.scheduledDate)}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 40,
                                  color: fontColor,
                                }),
                              }}
                            ></TableCell>
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 40,
                                  color: fontColor,
                                }),
                              }}
                            >
                              {invoiceNumber}
                            </TableCell>
                            <TableCell
                              sx={{ ...bodyCellStyles({ color: fontColor }) }}
                            >
                              {hasFixedRateIndividual && !isMonthly
                                ? isWasteNameToBill
                                  ? `${waste.wasteName} (EXCESS)`
                                  : `${waste.QuotationWaste.wasteName} (EXCESS)`
                                : isWasteNameToBill
                                ? waste.wasteName
                                : waste.QuotationWaste.wasteName}
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
                              {new Decimal(usedWeight)
                                .minus(new Decimal(fixedWeight))
                                .toNumber()}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 40,
                                  color: fontColor,
                                }),
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
                              {formatNumber2(waste.QuotationWaste.unitPrice)}
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
                              {formatNumber(
                                new Decimal(usedWeight)
                                  .minus(new Decimal(fixedWeight))
                                  .toNumber() * waste.QuotationWaste.unitPrice
                              )}
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
                            <TableCell
                              sx={{
                                ...bodyCellStyles({
                                  width: 85,
                                  isLastCell: true,
                                  color: fontColor,
                                }),
                              }}
                            >
                              {waste.QuotationWaste.mode}
                            </TableCell>
                            {isWasteName && (
                              <TableCell
                                sx={{
                                  ...bodyCellStyles({
                                    width: 85,
                                    isLastCell: true,
                                    color: fontColor,
                                  }),
                                }}
                              >
                                {wasteName}
                              </TableCell>
                            )}

                            {isWasteName && (
                              <TableCell
                                sx={{
                                  ...bodyCellStyles({
                                    width: 85,
                                    isLastCell: true,
                                    color: fontColor,
                                  }),
                                }}
                              >
                                {isWasteName ? "true" : "false"}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                    </>
                  );
                }
              );

              let isTransportation =
                transactions?.[0]?.ScheduledTransaction?.[0]
                  .DispatchedTransaction.length === 0
                  ? false
                  : true;

              const logisticsId =
                transaction.ScheduledTransaction?.[0]?.logisticsId;

              const clientVehicle = "dbbeee0a-a2ea-44c5-b17a-b21ac4bb2788";

              if (!isTransportation) {
                isTransportation = logisticsId !== clientVehicle ? true : false;
              }

              const hasTransportation =
                transaction.QuotationWaste.hasTransportation;

              // Add the transportation row if applicable
              const transpoRows = transaction?.QuotationTransportation?.mode ===
                "CHARGE" &&
                isTransportation &&
                hasTransportation && [
                  <TableRow key={`transpo-${index}`} sx={{ border: "black" }}>
                    <TableCell sx={bodyCellStyles({ width: 60 })}>
                      {formatDate2(scheduledTransaction.scheduledDate)}
                    </TableCell>
                    <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                    <TableCell sx={bodyCellStyles({ width: 40 })}>
                      {invoiceNumber}
                    </TableCell>
                    <TableCell sx={bodyCellStyles()}>
                      {`TRANS FEE ${transaction.QuotationTransportation?.VehicleType.typeOfVehicle}`}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 60,
                        notCenter: true,
                      })}
                    >
                      {`${formatNumber2(
                        transaction.QuotationTransportation?.quantity
                      )}`}
                    </TableCell>
                    <TableCell sx={bodyCellStyles({ width: 40 })}>
                      {transaction.QuotationTransportation?.unit}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 80,
                        notCenter: true,
                      })}
                    >
                      {formatNumber2(
                        transaction.QuotationTransportation?.unitPrice
                      )}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 80,
                        notCenter: true,
                      })}
                    >
                      {formatNumber(
                        transaction.QuotationTransportation?.quantity *
                          transaction.QuotationTransportation?.unitPrice
                      )}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 85,
                        isLastCell: true,
                      })}
                    >
                      {transaction.QuotationTransportation?.vatCalculation}
                    </TableCell>
                  </TableRow>,
                ];

              // Add the transportation row if applicable
              const demurrageRows = transaction?.QuotationTransportation
                ?.mode === "CHARGE" &&
                isTransportation &&
                hasTransportation &&
                hasDemurrage && [
                  <TableRow key={`demurrage-${index}`} sx={{ border: "black" }}>
                    <TableCell sx={bodyCellStyles({ width: 60 })}>
                      {formatDate2(scheduledTransaction.scheduledDate)}
                    </TableCell>
                    <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                    <TableCell sx={bodyCellStyles({ width: 40 })}>
                      {invoiceNumber}
                    </TableCell>
                    <TableCell sx={bodyCellStyles()}>
                      {`DEMURRAGE FEE ${transaction.QuotationTransportation?.VehicleType.typeOfVehicle}`}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 60,
                        notCenter: true,
                      })}
                    >
                      {`${formatNumber2(demurrageDays)}`}
                    </TableCell>
                    <TableCell sx={bodyCellStyles({ width: 40 })}>
                      {transaction.QuotationTransportation?.unit}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 80,
                        notCenter: true,
                      })}
                    >
                      {formatNumber2(
                        transaction.QuotationTransportation?.unitPrice
                      )}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 80,
                        notCenter: true,
                      })}
                    >
                      {formatNumber(
                        demurrageDays *
                          transaction.QuotationTransportation?.unitPrice
                      )}
                    </TableCell>
                    <TableCell
                      sx={bodyCellStyles({
                        width: 85,
                        isLastCell: true,
                      })}
                    >
                      {transaction.QuotationTransportation?.vatCalculation}
                    </TableCell>
                  </TableRow>,
                ];

              // Combine waste and transportation rows for alternating display
              const combinedRows = [];

              wasteRows.forEach((wasteRow, idx) => {
                combinedRows.push(wasteRow);
              });

              if (transpoRows.length > 0) {
                // Push transpo row after every waste row
                combinedRows.push(transpoRows[0]); // Only one transpo row per transaction
                if (hasDemurrage) {
                  combinedRows.push(demurrageRows[0]); // Only one transpo row per transaction
                }
              }

              if (index !== transactions.length - 1) {
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
              }

              return combinedRows;
            })}
          {hasFixedRate && isMonthly && (
            <TableRow key={`add-${1}`} sx={{ border: "black" }}>
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
          {hasFixedRate && isMonthly && (
            <TableRow key={`add-${2}`} sx={{ border: "black" }}>
              <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({})}>TOTAL</TableCell>
              <TableCell sx={bodyCellStyles({ width: 60 })}>
                {formatNumber2(totalWeight)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}>{unit}</TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
              <TableCell
                sx={bodyCellStyles({ width: 85, isLastCell: true })}
              ></TableCell>
            </TableRow>
          )}

          {hasFixedRate && isMonthly && (
            <TableRow key={`add-${3}`} sx={{ border: "black" }}>
              <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({})}>
                {fixedWeight === 0 ? "" : `FIRST ${formatNumber2(fixedWeight)}`}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 60 })}>
                {fixedWeight === 0
                  ? formatNumber2(1)
                  : formatNumber2(fixedWeight)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}>
                {fixedWeight === 0 ? "LOT" : unit}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 80 })}>
                {formatNumber2(fixedPrice)}
              </TableCell>
              <TableCell sx={bodyCellStyles({ width: 85, isLastCell: true })}>
                {vatCalculation}
              </TableCell>
            </TableRow>
          )}
          {hasFixedRate &&
            isMonthly &&
            fixedWeight !== 0 &&
            totalWeight > fixedWeight && (
              <TableRow key={`add-${4}`} sx={{ border: "black" }}>
                <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                <TableCell sx={bodyCellStyles({})}>EXCESS QUANTITY:</TableCell>
                <TableCell sx={bodyCellStyles({ width: 60 })}>
                  {formatNumber2(totalWeight - fixedWeight)}
                </TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}>{unit}</TableCell>
                <TableCell sx={bodyCellStyles({ width: 80 })}>
                  {unitPrice}
                </TableCell>
                <TableCell sx={bodyCellStyles({ width: 80 })}>
                  {formatNumber2((totalWeight - fixedWeight) * unitPrice)}
                </TableCell>
                <TableCell sx={bodyCellStyles({ width: 85, isLastCell: true })}>
                  {vatCalculation}
                </TableCell>
              </TableRow>
            )}
          {remarks && (
            <TableRow key={`add-${5}`} sx={{ border: "black" }}>
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
          {remarks && (
            <TableRow key={`add-${6}`} sx={{ border: "black" }}>
              <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
              <TableCell sx={bodyCellStyles({})}>{remarks}</TableCell>
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
