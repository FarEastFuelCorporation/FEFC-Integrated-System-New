import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";
import BillingStatementForm from "../BillingStatement/BillingStatementForm";
import { timestampDate, parseTimeString } from "../Functions";

const CollectedTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingApprovalTransaction =
    row.ScheduledTransaction[0].DispatchedTransaction[0].ReceivedTransaction[0]
      .SortedTransaction[0].CertifiedTransaction[0].BilledTransaction[0]
      .BillingApprovalTransaction;
  console.log(row);

  // Assuming approvedDate is in a valid Date format (either Date object or string)
  const approvedDate = new Date(billingApprovalTransaction.approvedDate);

  // Add the terms to the approvedDate
  const terms = parseInt(row.QuotationWaste.Quotation.termsCharge);

  // Create a new Date instance for dueDate by adding terms to approvedDate
  const dueDate = new Date(approvedDate);
  dueDate.setDate(dueDate.getDate() + terms);

  return (
    <Box>
      {row.statusId === 9 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <PaidIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[500]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Collection
            </Typography>
          </Box>
          <Typography variant="h5">
            Due Date:{" "}
            {dueDate ? format(new Date(dueDate), "MMMM dd, yyyy") : "Pending"}
          </Typography>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <PaidIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              Billing Approved
            </Typography>
            <Typography variant="h5">
              {billingApprovalTransaction.createdAt
                ? timestampDate(billingApprovalTransaction.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Approved Date:{" "}
            {billingApprovalTransaction.approvedDate
              ? format(
                  new Date(billingApprovalTransaction.approvedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Approved Time:{" "}
            {billingApprovalTransaction.approvedTime
              ? format(
                  parseTimeString(billingApprovalTransaction.approvedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {billingApprovalTransaction.remarks
              ? billingApprovalTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${billingApprovalTransaction.Employee.firstName || ""} ${
              billingApprovalTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <BillingStatementForm row={row} />
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default CollectedTransaction;
