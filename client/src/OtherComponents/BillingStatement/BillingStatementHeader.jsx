import React from "react";
import { Box, Typography } from "@mui/material";
import { formatDateFull, formatNumber } from "../Functions";

const BillingStatementHeader = ({
  row,
  amounts,
  credits,
  isIndividualBillingToBill = false,
  groupedTransactions,
  index,
  discount,
  isChargeToProcess,
}) => {
  const today = new Date();
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);
  const clientData = row?.Client;

  const vat = isIndividualBillingToBill
    ? groupedTransactions?.totals?.amounts.vatExclusive * 0.12 +
      groupedTransactions?.totals?.amounts.vatInclusive -
      groupedTransactions?.totals?.amounts.vatInclusive / 1.12
    : amounts.vatExclusive * 0.12 +
      (amounts.vatInclusive - amounts.vatInclusive / 1.12);

  const discountAmount = row?.BilledTransaction?.[0]?.discountAmount || 0;

  const toBeDiscount = discountAmount ? discountAmount : discount || 0;

  const hasDemurrage =
    row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.hasDemurrage;
  const demurrageDays =
    row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.demurrageDays;

  const demurrageFee = parseFloat(row?.QuotationTransportation?.unitPrice);
  const vatCalculation = row?.QuotationTransportation?.vatCalculation;
  // const vatCalculation = "VAT INCLUSIVE";

  const termsChargeDays = parseInt(
    row?.QuotationWaste?.Quotation?.termsChargeDays
  );
  const termsCharge = row?.QuotationWaste?.Quotation?.termsCharge;

  function incrementLastThreeDigits(transactionId, incrementBy = 1) {
    if (transactionId) {
      // Split the string by '-'
      const parts = transactionId.split("-");

      // Extract the last part and convert it to a number
      let lastThreeDigits = parseInt(parts[2], 10);

      // Increment the number by the specified amount
      lastThreeDigits += incrementBy;

      // Pad with leading zeros to maintain the format
      const incrementedPart = String(lastThreeDigits).padStart(3, "0");

      // Reconstruct the string
      return `${parts[0]}-${parts[1]}-${incrementedPart}`;
    } else return "";
  }

  const billingNumber = isIndividualBillingToBill
    ? incrementLastThreeDigits(
        row?.BilledTransaction?.[0]?.billingNumber,
        index
      )
    : row?.BilledTransaction?.[0]?.billingNumber;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            border: "1px solid black",
            width: "230px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            CLIENT'S COPY
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            BILLING STATEMENT
          </Typography>
        </Box>
        <Box display="flex" gap="20px">
          <Box>
            <Typography
              variant="h6"
              fontStyle="italic"
              textAlign="center"
              sx={{ height: "16px" }}
            >
              Billing Number
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              sx={{ height: "16px" }}
            >
              {billingNumber}
            </Typography>
            <Typography
              mt={1}
              variant="h6"
              fontStyle="italic"
              textAlign="center"
              sx={{ height: "16px" }}
            >
              Date
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              sx={{ height: "16px" }}
            >
              {row?.BilledTransaction?.[0]
                ? formatDateFull(row?.BilledTransaction?.[0]?.billedDate)
                : ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Customer Summary */}
      <Box mt={2} display="grid" gridTemplateColumns="50% 50%">
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
          CLIENT
        </Typography>
        <Typography
          sx={{
            variant: "h5",
            fontWeight: "bold",
            textAlign: "center",
            border: "1px solid black",
            borderBottom: "none",
            borderLeft: "none",
            backgroundColor: "lightgray",
          }}
        >
          ACCOUNT SUMMARY
        </Typography>
      </Box>
      <Box display="grid" gridTemplateColumns="50% 50%">
        <Box
          sx={{
            height: "100%",
            border: "1px solid black",
            borderBottom: "none",
            padding: 1,
          }}
        >
          <Typography fontWeight="bold">{clientData?.billerName}</Typography>
          <Typography fontSize="12px">{clientData?.billerAddress}</Typography>
          {clientData?.billerTinNumber && (
            <Typography fontSize="12px">
              TIN NUMBER: {clientData?.billerTinNumber}
            </Typography>
          )}
          {clientData?.natureOfBusiness && (
            <Typography fontSize="12px">
              {" "}
              BUSINESS STYLE: {clientData?.natureOfBusiness}
            </Typography>
          )}
          {clientData?.billerContactNumber && (
            <Typography fontSize="12px">
              {" "}
              Contact Number: {clientData?.billerContactNumber}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            height: "100%",
            border: "1px solid black",
            borderBottom: "none",
            borderLeft: "none",
            padding: "5px 10px",
          }}
        >
          <Box
            sx={{
              borderBottom: "2px solid black",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Total Amount Payable:
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {hasDemurrage
                ? vatCalculation === "VAT EXCLUSIVE"
                  ? formatNumber(
                      demurrageDays * demurrageFee +
                        demurrageDays * demurrageFee * 0.12
                    )
                  : formatNumber(demurrageDays * demurrageFee)
                : formatNumber(
                    isIndividualBillingToBill
                      ? groupedTransactions?.totals?.amounts.nonVatable +
                          groupedTransactions?.totals?.amounts.vatExclusive +
                          groupedTransactions?.totals?.amounts.vatInclusive /
                            1.12 +
                          vat
                      : amounts.nonVatable +
                          amounts.vatExclusive +
                          amounts.vatInclusive / 1.12 +
                          vat
                  )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>Total Non-Vatable Sale:</Typography>
            <Typography>
              {hasDemurrage
                ? vatCalculation === "NON VATABLE"
                  ? formatNumber(demurrageDays * demurrageFee)
                  : 0
                : formatNumber(
                    isIndividualBillingToBill
                      ? groupedTransactions?.totals?.amounts.nonVatable
                      : amounts.nonVatable
                  )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>Total Vatable Sale:</Typography>
            <Typography>
              {hasDemurrage
                ? vatCalculation === "VAT EXCLUSIVE"
                  ? formatNumber(demurrageDays * demurrageFee)
                  : vatCalculation === "VAT INCLUSIVE"
                  ? formatNumber((demurrageDays * demurrageFee) / 1.12)
                  : 0
                : formatNumber(
                    isIndividualBillingToBill
                      ? groupedTransactions?.totals?.amounts.vatExclusive +
                          groupedTransactions?.totals?.amounts.vatInclusive /
                            1.12
                      : amounts.vatExclusive + amounts.vatInclusive / 1.12
                  )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>VAT (12%):</Typography>
            <Typography>
              {hasDemurrage
                ? vatCalculation === "VAT EXCLUSIVE"
                  ? formatNumber(demurrageDays * demurrageFee * 0.12)
                  : vatCalculation === "VAT INCLUSIVE"
                  ? formatNumber(
                      demurrageDays * demurrageFee -
                        (demurrageDays * demurrageFee) / 1.12
                    )
                  : 0
                : formatNumber(vat)}
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 2,
              borderBottom: "2px solid black",
              display: "flex",
              justifyContent: "space-between",
              color: "red",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>LESS:</Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {isChargeToProcess
                ? formatNumber(0)
                : formatNumber(
                    isIndividualBillingToBill
                      ? groupedTransactions?.totals?.credits.vatInclusive -
                          toBeDiscount
                      : credits.vatInclusive + credits.nonVatable + toBeDiscount
                  )}
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 2,
              borderBottom: "2px solid black",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Total Amount Due:
            </Typography>
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              {hasDemurrage
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
                          groupedTransactions?.totals?.amounts.vatInclusive /
                            1.12 +
                          vat -
                          (isChargeToProcess
                            ? 0
                            : groupedTransactions?.totals?.credits
                                .vatInclusive +
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
                  )}
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Due Date:
            </Typography>
            <Box>
              {termsChargeDays === 0 ? (
                <Typography sx={{ fontWeight: "bold" }}>{`CASH`}</Typography>
              ) : (
                <Typography sx={{ fontWeight: "bold" }}>{`${termsChargeDays} ${
                  termsChargeDays === 1 ? "DAY" : "DAYS"
                }`}</Typography>
              )}
              <Typography sx={{ fontWeight: "bold" }}>
                {`${termsCharge}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingStatementHeader;
