import React from "react";
import { Box, Typography } from "@mui/material";
import { formatDateFull, formatNumber } from "../Functions";

const CommissionStatementHeader = ({
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
  const commissionNumber = row?.CommissionedTransaction?.[0]?.commissionNumber;

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
            AGENT'S COPY
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            COMMISSION STATEMENT
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
              Commission Statement Number
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              sx={{ height: "16px" }}
            >
              {commissionNumber}
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
              {row?.CommissionedTransaction?.[0]
                ? formatDateFull(
                    row?.CommissionedTransaction?.[0]?.commissionedDate
                  )
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
          AGENT
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
          <Typography fontWeight="bold">
            {row.Client?.Commission?.[0]?.Agent?.firstName}{" "}
            {row.Client?.Commission?.[0]?.Agent?.lastName}
            {row.Client?.Commission?.[0]?.Agent?.affix
              ? row.Client?.Commission?.[0]?.Agent?.affix
              : ""}
          </Typography>
          <Typography fontSize="12px">
            Contact Number: {row.Client?.Commission?.[0]?.Agent?.mobileNo}
          </Typography>
          <Typography fontSize="12px">
            Email Address: {row.Client?.Commission?.[0]?.Agent?.emailAddress}
          </Typography>
          <Typography fontSize="12px">
            BIlling Number: {billingNumber}
          </Typography>
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
            <Typography>{formatNumber(0)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>Total Vatable Sale:</Typography>
            <Typography>{formatNumber(0)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>VAT (12%):</Typography>
            <Typography>{formatNumber(0)}</Typography>
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
            <Typography sx={{ fontWeight: "bold" }}>LESS: 10% Tax</Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {formatNumber(
                parseFloat(
                  hasDemurrage
                    ? vatCalculation === "VAT EXCLUSIVE"
                      ? demurrageDays * demurrageFee +
                        demurrageDays * demurrageFee * 0.12
                      : demurrageDays * demurrageFee
                    : isIndividualBillingToBill
                    ? groupedTransactions?.totals?.amounts.nonVatable +
                      groupedTransactions?.totals?.amounts.vatExclusive +
                      groupedTransactions?.totals?.amounts.vatInclusive / 1.12 +
                      vat
                    : amounts.nonVatable +
                      amounts.vatExclusive +
                      amounts.vatInclusive / 1.12 +
                      vat
                ) * 0.1
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
              {formatNumber(
                parseFloat(
                  hasDemurrage
                    ? vatCalculation === "VAT EXCLUSIVE"
                      ? demurrageDays * demurrageFee +
                        demurrageDays * demurrageFee * 0.12
                      : demurrageDays * demurrageFee
                    : isIndividualBillingToBill
                    ? groupedTransactions?.totals?.amounts.nonVatable +
                      groupedTransactions?.totals?.amounts.vatExclusive +
                      groupedTransactions?.totals?.amounts.vatInclusive / 1.12 +
                      vat
                    : amounts.nonVatable +
                      amounts.vatExclusive +
                      amounts.vatInclusive / 1.12 +
                      vat
                ) -
                  parseFloat(
                    hasDemurrage
                      ? vatCalculation === "VAT EXCLUSIVE"
                        ? demurrageDays * demurrageFee +
                          demurrageDays * demurrageFee * 0.12
                        : demurrageDays * demurrageFee
                      : isIndividualBillingToBill
                      ? groupedTransactions?.totals?.amounts.nonVatable +
                        groupedTransactions?.totals?.amounts.vatExclusive +
                        groupedTransactions?.totals?.amounts.vatInclusive /
                          1.12 +
                        vat
                      : amounts.nonVatable +
                        amounts.vatExclusive +
                        amounts.vatInclusive / 1.12 +
                        vat
                  ) *
                    0.1
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
            <Typography sx={{ fontWeight: "bold" }}>UPON COLLECTION</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommissionStatementHeader;
