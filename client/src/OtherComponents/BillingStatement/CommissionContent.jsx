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

const CommissionContent = ({
  transactions,
  pageHeight,
  headerHeight,
  footerHeight,
  setPagesContent,
  setIsDoneCalculation,
  heightsReady,
  isWasteNameToBill = false,
  isPerClientToBill = false,
  isIndividualBillingToBill = false,
  isIndividualWasteToProcess,
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
  let hasDemurrage = false;

  let totalWeight = new Decimal(0);

  const firstPageHeight = pageHeight - headerHeight;
  const nextPageHeight = pageHeight;

  const groupedTransactions = Object.entries(
    // First, sort the transactions by the earliest scheduledDate
    transactions
      .sort((a, b) => {
        // Extract the earliest scheduledDate from the ScheduledTransaction array
        const dateA = new Date(
          a.ScheduledTransaction?.[0]?.scheduledDate || "1970-01-01"
        ).getTime();
        const dateB = new Date(
          b.ScheduledTransaction?.[0]?.scheduledDate || "1970-01-01"
        ).getTime();

        return dateA - dateB;
      })
      .reduce((acc, transaction) => {
        // Extract invoiceNumber from BilledTransaction
        const transpoFee =
          parseFloat(transaction.QuotationTransportation?.unitPrice) || 0;
        const transpoVatCalculation =
          transaction.QuotationTransportation?.vatCalculation;
        const transpoMode = transaction.QuotationTransportation?.mode;
        let isTransportation =
          transaction.ScheduledTransaction?.[0]?.DispatchedTransaction
            .length === 0
            ? false
            : true;

        const typeOfVehicle =
          transaction.QuotationTransportation?.VehicleType.typeOfVehicle;

        const invoiceNumber =
          transaction.BilledTransaction?.[0]?.serviceInvoiceNumber || null;

        const typeOfWeight =
          transaction.CertifiedTransaction?.[0]?.typeOfWeight;

        transaction.ScheduledTransaction.forEach((scheduled) => {
          const { scheduledDate, scheduledTime } = scheduled; // Extract date and time

          scheduled.ReceivedTransaction.forEach((received) => {
            received.SortedTransaction.forEach((sorted) => {
              sorted.SortedWasteTransaction.forEach((waste) => {
                const clientId = waste.transporterClientId;

                if (!acc[clientId]) {
                  acc[clientId] = []; // Initialize an array for this clientId
                }

                // Add the waste transaction to the group and include scheduledDate, scheduledTime, and invoiceNumber
                acc[clientId].push({
                  ...waste,
                  scheduledDate,
                  scheduledTime,
                  invoiceNumber,
                  typeOfWeight,
                  transpoFee,
                  transpoVatCalculation,
                  isTransportation,
                  typeOfVehicle,
                });
              });
            });
          });
        });

        return acc;
      }, {})
  ).map(([transporterClientId, transactions]) => ({
    transporterClientId,
    transactions,
  }));

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

    const clientArray = [];

    // Helper function to add a page to the pages array
    const addPage = () => {
      pages.push([...currentPage]);
      currentPage = [];
      currentPageHeight = 0;
      availableHeight = nextPageHeight; // Subsequent pages' available height
    };

    // Helper function to add an element to the current page or move to next page
    const addElementToPage = (element, elementHeight, cellContent = false) => {
      if (canFitOnPage(elementHeight)) {
        if (isIndividualBillingToBill) {
          if (cellContent) {
            if (clientArray.length === 0) {
              clientArray.push(cellContent);
            }
            if (!clientArray.includes(cellContent)) {
              addPage();
              clientArray.push(cellContent);
            }
          }
        }

        if (element !== null) {
          currentPage.push(element); // Push the element only if it's not null
        }

        currentPageHeight += cellContent.length > 35 ? elementHeight : 22;
        availableHeight -= cellContent.length > 35 ? elementHeight : 22;
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

      const cellContent = cells[3].textContent;

      // Check if the first <td> content is empty
      const isFirstCellEmpty = cells[0]?.textContent.trim() === "";

      // Set rowHeight based on the first <td> content
      const rowHeight = isFirstCellEmpty ? 22 : row.offsetHeight;

      const cellContents = cells.map((cell) => cell.textContent.trim()); // Extract content from each <td>
      addElementToPage(cellContents, rowHeight, cellContent); // Push the contents of the row
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
    isIndividualBillingToBill,
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
    isIndividualBillingToBill,
    isIndividualWasteToProcess,
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
        {!isIndividualBillingToBill && (
          <TableBody>
            {transactions
              .sort(
                (a, b) =>
                  new Date(a.ScheduledTransaction[0].scheduledDate) -
                  new Date(b.ScheduledTransaction[0].scheduledDate)
              ) // Sort transactions by haulingDate from oldest to newest
              .map((transaction, index) => {
                // Check if aggregatedWasteTransactions need to be mapped
                let clientNames = [];
                let aggregatedWasteTransactions;

                hasDemurrage =
                  transaction?.ScheduledTransaction?.[0]
                    ?.ReceivedTransaction?.[0]?.hasDemurrage || false;
                const demurrageDays =
                  transaction?.ScheduledTransaction?.[0]
                    ?.ReceivedTransaction?.[0]?.demurrageDays || 0;
                const submitTo =
                  transaction?.ScheduledTransaction?.[0]
                    ?.ReceivedTransaction?.[0]?.submitTo;

                if (isPerClientToBill) {
                  aggregatedWasteTransactions =
                    submitTo === "WAREHOUSE"
                      ? transaction.ScheduledTransaction[0]
                          .ReceivedTransaction[0].WarehousedTransaction[0]
                          .WarehousedTransactionItem
                      : transaction.ScheduledTransaction[0]
                          .ReceivedTransaction[0].SortedTransaction[0]
                          .SortedWasteTransaction;

                  aggregatedWasteTransactions.sort((a, b) => {
                    const clientNameA = a.TransporterClient?.clientName || "";
                    const clientNameB = b.TransporterClient?.clientName || "";

                    return clientNameA.localeCompare(clientNameB); // Compare client names alphabetically
                  });
                } else {
                  aggregatedWasteTransactions = Object.values(
                    submitTo === "WAREHOUSE"
                      ? transaction.ScheduledTransaction[0].ReceivedTransaction[0].WarehousedTransaction[0].WarehousedTransactionItem.reduce(
                          (acc, current) => {
                            const { id } = current.QuotationWaste;

                            const currentWeight = new Decimal(current.weight); // Use Decimal.js
                            const currentClientWeight = new Decimal(
                              current.clientWeight
                            ); // Use Decimal.js

                            if (isIndividualWasteToProcess) {
                              // If isIndividualWasteToProcess is true, each entry is added separately
                              acc[`${id}-${Math.random()}`] = {
                                ...current,
                                weight: currentWeight,
                                clientWeight: currentClientWeight,
                              };
                            } else if (acc[id]) {
                              acc[id].weight =
                                acc[id].weight.plus(currentWeight);
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
                      : transaction.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0].SortedWasteTransaction.reduce(
                          (acc, current) => {
                            const { id } = current.QuotationWaste;

                            const currentWeight = new Decimal(current.weight); // Use Decimal.js
                            const currentClientWeight = new Decimal(
                              current.clientWeight
                            ); // Use Decimal.js

                            if (isIndividualWasteToProcess) {
                              // If isIndividualWasteToProcess is true, each entry is added separately
                              acc[`${id}-${Math.random()}`] = {
                                ...current,
                                weight: currentWeight,
                                clientWeight: currentClientWeight,
                              };
                            } else if (acc[id]) {
                              acc[id].weight =
                                acc[id].weight.plus(currentWeight);
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
                    clientWeight: item.clientWeight.toNumber(), // Convert Decimal back to a standard number
                  }));
                }

                const invoiceNumber =
                  transaction.BilledTransaction?.[0]?.serviceInvoiceNumber;

                const typeOfWeight =
                  transaction.CertifiedTransaction?.[0]?.typeOfWeight ||
                  "SORTED WEIGHT";

                const scheduledTransaction =
                  transaction.ScheduledTransaction?.[0];

                const wasteRows = Object.values(
                  aggregatedWasteTransactions
                ).map((waste, idx) => {
                  // Determine the font color based on the mode
                  const fontColor =
                    waste.QuotationWaste.mode === "BUYING" ? "red" : "inherit";

                  const usedWeight =
                    typeOfWeight === "CLIENT WEIGHT"
                      ? waste.clientWeight
                      : waste.weight;

                  totalWeight = totalWeight.plus(usedWeight);

                  const wasteName =
                    submitTo === "WAREHOUSE"
                      ? transaction.ScheduledTransaction?.[0]
                          ?.ReceivedTransaction?.[0]?.WarehousedTransaction?.[0]
                          ?.WarehousedTransactionItem?.[0]?.description
                      : transaction.ScheduledTransaction?.[0]
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
                  const amount =
                    waste.QuotationWaste?.CommissionWaste?.[0]?.amount;

                  return (
                    <Box>
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
                      {
                        <TableRow key={`waste-${idx}`} sx={{ border: "black" }}>
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
                            {hasFixedRateIndividual && !isMonthly && fixedWeight
                              ? isWasteNameToBill
                                ? `${
                                    waste.wasteName || waste.description
                                  } (FIRST ${fixedWeight} ${unit})`
                                : `${waste.QuotationWaste.wasteName} (FIRST ${fixedWeight} ${unit})`
                              : isWasteNameToBill
                              ? waste.wasteName || waste.description
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
                              ? fixedWeight
                                ? formatNumber2(fixedWeight)
                                : formatNumber2(1)
                              : formatNumber2(
                                  new Decimal(usedWeight).toNumber()
                                )}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellStyles({
                                width: 40,
                                color: fontColor,
                              }),
                            }}
                          >
                            {hasFixedRateIndividual && !fixedWeight
                              ? "LOT"
                              : waste.QuotationWaste.unit}
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
                            {hasFixedRateIndividual && !fixedWeight
                              ? formatNumber2(amount)
                              : formatNumber2(amount)}
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
                                  waste.duration
                                    ? waste.duration *
                                        new Decimal(usedWeight).toNumber() *
                                        amount
                                    : new Decimal(usedWeight).toNumber() *
                                        amount
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
                      }
                      {/* {hasFixedRateIndividual &&
                        !isMonthly &&
                        fixedWeight &&
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
                                  ? `${
                                      waste.wasteName || waste.description
                                    } (EXCESS)`
                                  : `${waste.QuotationWaste.wasteName} (EXCESS)`
                                : isWasteNameToBill
                                ? waste.wasteName || waste.description
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
                              {formatNumber2(
                                new Decimal(usedWeight)
                                  .minus(new Decimal(fixedWeight))
                                  .toNumber()
                              )}
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
                                waste.duration
                                  ? waste.duration *
                                      new Decimal(usedWeight)
                                        .minus(new Decimal(fixedWeight))
                                        .toNumber() *
                                      waste.QuotationWaste.unitPrice
                                  : new Decimal(usedWeight)
                                      .minus(new Decimal(fixedWeight))
                                      .toNumber() *
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
                        )} */}
                    </Box>
                  );
                });

                let isTransportation =
                  transactions?.[0]?.ScheduledTransaction?.[0]
                    .DispatchedTransaction.length === 0
                    ? false
                    : true;

                const logisticsId =
                  transaction.ScheduledTransaction?.[0]?.logisticsId;

                const clientVehicle = "dbbeee0a-a2ea-44c5-b17a-b21ac4bb2788";

                if (!isTransportation) {
                  isTransportation =
                    logisticsId !== clientVehicle ? true : false;
                }

                // Combine waste and transportation rows for alternating display
                const combinedRows = [];

                wasteRows.forEach((wasteRow, idx) => {
                  combinedRows.push(wasteRow);
                });

                return combinedRows;
              })}
            {/* {!hasDemurrage && hasFixedRate && isMonthly && (
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
            {!hasDemurrage && hasFixedRate && isMonthly && (
              <TableRow key={`add-${2}`} sx={{ border: "black" }}>
                <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                <TableCell sx={bodyCellStyles({})}>TOTAL</TableCell>
                <TableCell sx={bodyCellStyles({ width: 60 })}>
                  {formatNumber2(totalWeight.toNumber())}
                </TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}>{unit}</TableCell>
                <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 80 })}></TableCell>
                <TableCell
                  sx={bodyCellStyles({ width: 85, isLastCell: true })}
                ></TableCell>
              </TableRow>
            )}

            {!hasDemurrage && hasFixedRate && isMonthly && (
              <TableRow key={`add-${3}`} sx={{ border: "black" }}>
                <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                <TableCell sx={bodyCellStyles({})}>
                  {fixedWeight === 0
                    ? ""
                    : `FIRST ${formatNumber2(fixedWeight)}`}
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
            {!hasDemurrage &&
              hasFixedRate &&
              isMonthly &&
              fixedWeight !== 0 &&
              totalWeight.toNumber() > fixedWeight && (
                <TableRow key={`add-${4}`} sx={{ border: "black" }}>
                  <TableCell sx={bodyCellStyles({ width: 60 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                  <TableCell sx={bodyCellStyles({ width: 40 })}></TableCell>
                  <TableCell sx={bodyCellStyles({})}>
                    EXCESS QUANTITY:
                  </TableCell>
                  <TableCell sx={bodyCellStyles({ width: 60 })}>
                    {formatNumber2(totalWeight.minus(fixedWeight))}
                  </TableCell>
                  <TableCell sx={bodyCellStyles({ width: 40 })}>
                    {unit}
                  </TableCell>
                  <TableCell sx={bodyCellStyles({ width: 80 })}>
                    {unitPrice}
                  </TableCell>
                  <TableCell sx={bodyCellStyles({ width: 80 })}>
                    {formatNumber2(totalWeight.minus(fixedWeight) * unitPrice)}
                  </TableCell>
                  <TableCell
                    sx={bodyCellStyles({ width: 85, isLastCell: true })}
                  >
                    {vatCalculation}
                  </TableCell>
                </TableRow>
              )} */}
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
        )}
        {isIndividualBillingToBill && (
          <TableBody>
            {groupedTransactions
              // Sort transactions by haulingDate from oldest to newest
              .flatMap((transaction, index) => {
                // const remarks =
                //   transaction.BilledTransaction?.[0]?.remarks || null;

                const wasteRows = transaction.transactions.flatMap(
                  (waste, idx, wasteArray) => {
                    const fontColor =
                      waste.QuotationWaste.mode === "BUYING"
                        ? "red"
                        : "inherit";

                    const transpoFee = parseFloat(waste.transpoFee) || 0;
                    const transpoVatCalculation = waste?.transpoVatCalculation;
                    const transpoMode =
                      transaction.QuotationTransportation?.mode;
                    let isTransportation =
                      transaction.ScheduledTransaction?.[0]
                        ?.DispatchedTransaction.length === 0
                        ? false
                        : true;

                    const isLastWaste = idx === wasteArray.length - 1;

                    return [
                      <TableRow key={`waste-${idx}`} sx={{ border: "black" }}>
                        <TableCell
                          sx={{
                            ...bodyCellStyles({
                              width: 60,
                              color: fontColor,
                            }),
                          }}
                        >
                          {formatDate2(waste.scheduledDate)}
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
                          {waste.invoiceNumber
                            ? Number(waste.invoiceNumber) + index
                            : ""}
                        </TableCell>
                        <TableCell
                          sx={{ ...bodyCellStyles({ color: fontColor }) }}
                        >
                          {isWasteNameToBill
                            ? waste.wasteName || waste.description
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
                          {waste.typeOfWeight === "CLIENT WEIGHT"
                            ? formatNumber2(waste.clientWeight)
                            : formatNumber2(waste.weight)}
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
                          {waste.typeOfWeight === "CLIENT WEIGHT"
                            ? formatNumber2(
                                waste.clientWeight *
                                  waste.QuotationWaste.unitPrice
                              )
                            : formatNumber2(
                                waste.weight * waste.QuotationWaste.unitPrice
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
                        {isLastWaste && (
                          <>
                            <TableCell sx={bodyCellStyles({ width: 60 })}>
                              {formatDate2(waste.scheduledDate)}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({ width: 40 })}
                            ></TableCell>
                            <TableCell sx={bodyCellStyles({ width: 40 })}>
                              {waste.invoiceNumber
                                ? Number(waste.invoiceNumber) + index
                                : ""}
                            </TableCell>
                            <TableCell sx={bodyCellStyles()}>
                              {`TRANS FEE ${waste.typeOfVehicle}`}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 60,
                                notCenter: true,
                              })}
                            >
                              {`${formatNumber2(1)}`}
                            </TableCell>
                            <TableCell sx={bodyCellStyles({ width: 40 })}>
                              {"TRIP"}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 80,
                                notCenter: true,
                              })}
                            >
                              {formatNumber2(transpoFee)}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 80,
                                notCenter: true,
                              })}
                            >
                              {formatNumber(transpoFee)}
                            </TableCell>
                            <TableCell
                              sx={bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                              })}
                            >
                              {transpoVatCalculation}
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
                            <TableCell
                              sx={bodyCellStyles({
                                width: 85,
                                isLastCell: true,
                              })}
                            >
                              {isTransportation}
                            </TableCell>
                          </>
                        )}
                      </TableRow>,
                    ];
                  }
                );

                // Combine waste and transportation rows for alternating display
                const combinedRows = [];

                wasteRows.forEach((wasteRow, idx) => {
                  combinedRows.push(wasteRow);
                });

                return combinedRows;
              })}
          </TableBody>
        )}
      </Table>
    </Box>
  );
};

export default CommissionContent;
