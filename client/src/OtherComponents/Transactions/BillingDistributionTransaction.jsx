import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

import { timestampDate, parseTimeString } from "../Functions";

const BillingDistributionTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingDistributionTransaction =
    row.BilledTransaction[0].BillingApprovalTransaction
      .BillingDistributionTransaction;

  return (
    <Box>
      {row.statusId === 9 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <TwoWheelerIcon
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
              For Billing Distribution
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <TwoWheelerIcon
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
                Billing Distributed
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
                {billingDistributionTransaction.createdAt
                  ? timestampDate(billingDistributionTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h5">
            Distributed Date:{" "}
            {billingDistributionTransaction.distributedDate
              ? format(
                  new Date(billingDistributionTransaction.distributedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Distributed Time:{" "}
            {billingDistributionTransaction.distributedTime
              ? format(
                  parseTimeString(
                    billingDistributionTransaction.distributedTime
                  ),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {billingDistributionTransaction.remarks
              ? billingDistributionTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${billingDistributionTransaction.Employee.firstName || ""} ${
              billingDistributionTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default BillingDistributionTransaction;
