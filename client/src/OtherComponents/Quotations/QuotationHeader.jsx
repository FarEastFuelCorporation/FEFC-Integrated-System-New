import React from "react";
import { Box, Typography } from "@mui/material";
import { formatDateFull } from "../Functions";

const QuotationHeader = ({ quotationData }) => {
  const today = new Date();
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);
  const clientData = quotationData.Client;

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
            QUOTATION
          </Typography>
        </Box>
        <Box display="flex" gap="20px">
          <Box>
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              Quotation Number
            </Typography>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              {quotationData.quotationCode}
            </Typography>
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              Date
            </Typography>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              {formatDateFull(
                quotationData.dateCreated
                  ? quotationData.dateCreated
                  : quotationData.createdAt
              )}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              Revision Number
            </Typography>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              {quotationData.revisionNumber}
            </Typography>
            <Typography variant="h6" fontStyle="italic" textAlign="center">
              Valid Until
            </Typography>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              {formatDateFull(quotationData.validity)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Customer Summary */}
      <Box mt={2} display="grid" gridTemplateColumns="50% 50%">
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          CLIENT INFORMATION
        </Typography>
        {clientData?.billerName && (
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            BILLING INFORMATION
          </Typography>
        )}
      </Box>
      <Box display="grid" gridTemplateColumns="50% 50%">
        <Box sx={{ height: "100%", border: "1px solid black", padding: 1 }}>
          <Typography fontWeight="bold">
            Attention to: {quotationData.contactPerson}
          </Typography>
          <Typography fontWeight="bold">{clientData?.clientName}</Typography>
          <Typography fontSize="12px">{clientData?.address}</Typography>
          <Typography fontSize="12px"></Typography>
          <Box display="flex" fontSize="10px">
            <Typography>
              {clientData?.contactNumber
                ? "Contact #: " + clientData?.contactNumber
                : ""}
            </Typography>
          </Box>
        </Box>

        {clientData?.billerName && (
          <Box
            sx={{
              height: "100%",
              border: "1px solid black",
              borderLeft: "none",
              padding: 1,
            }}
          >
            <Typography fontWeight="bold">{clientData?.billerName}</Typography>
            <Typography fontWeight="bold">
              {clientData?.billerContactPerson}
            </Typography>
            <Typography fontSize="12px">{clientData?.billerAddress}</Typography>
            <Typography fontSize="12px"></Typography>
            <Box display="flex" fontSize="10px">
              <Typography>
                {clientData?.billerContactNumber
                  ? "Contact #: " + clientData?.billerContactNumber
                  : ""}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Scope of Work */}
      <Typography mt={1} variant="h5" fontWeight="bold" textAlign="center">
        SCOPE OF WORK
      </Typography>
      <Box sx={{ border: "1px solid black", padding: 0.5 }}>
        <Typography>{quotationData.scopeOfWork}</Typography>
      </Box>
    </Box>
  );
};

export default QuotationHeader;
