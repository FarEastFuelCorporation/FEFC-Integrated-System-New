import React from "react";
import { Box, Typography } from "@mui/material";
import { formatDateFull, formatNumber } from "../Functions";

const BillingStatementHeader = ({ row, amounts, credits }) => {
  const today = new Date();
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);
  const clientData = row?.Client;

  const vat =
    amounts.vatExclusive * 0.12 +
    (amounts.vatInclusive - amounts.vatInclusive / 1.12);

  const termsChargeDays = parseInt(
    row?.QuotationWaste?.Quotation?.termsChargeDays
  );
  const termsCharge = row?.QuotationWaste?.Quotation?.termsCharge;

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
              {row?.BilledTransaction?.[0]?.billingNumber}
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
              {formatNumber(
                amounts.nonVatable +
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
            <Typography>{formatNumber(amounts.nonVatable)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>Total Vatable Sale:</Typography>
            <Typography>
              {formatNumber(amounts.vatExclusive + amounts.vatInclusive / 1.12)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>VAT (12%):</Typography>
            <Typography>{formatNumber(vat)}</Typography>
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
              {formatNumber(credits.vatInclusive)}
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
                amounts.nonVatable +
                  amounts.vatExclusive +
                  amounts.vatInclusive / 1.12 +
                  vat -
                  credits.vatInclusive
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
