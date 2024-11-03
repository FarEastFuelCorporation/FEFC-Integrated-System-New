import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";
import BillingStatementForm from "../BillingStatement/BillingStatementForm";
import { timestampDate, parseTimeString } from "../Functions";

const BillingApprovalTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingApprovalTransaction =
    row.BilledTransaction[0].BillingApprovalTransaction;

  return (
    <Box>
      {row.statusId === 8 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <AssignmentTurnedInIcon
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
              For Billing Approval
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <AssignmentTurnedInIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
              }}
            />
          </CircleLogo>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color={colors.greenAccent[400]}>
                Billing Approved
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: {
                  xs: "start",
                  md: "end",
                },
              }}
            >
              <Typography variant="h5">
                {billingApprovalTransaction.createdAt
                  ? timestampDate(billingApprovalTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
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

export default BillingApprovalTransaction;
