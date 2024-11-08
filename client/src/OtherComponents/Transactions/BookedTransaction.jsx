import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";

const BookedTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box sx={{ my: 3, position: "relative" }}>
      <CircleLogo>
        <CollectionsBookmarkIcon
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
            Booked
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
            {row.createdAt ? timestampDate(row.createdAt) : ""}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h5">
        Proposed Hauling Date:{" "}
        {row.haulingDate
          ? format(new Date(row.haulingDate), "MMMM dd, yyyy")
          : ""}
      </Typography>
      <Typography variant="h5">
        Proposed Hauling Time:{" "}
        {row.haulingTime
          ? format(parseTimeString(row.haulingTime), "hh:mm aa")
          : ""}
      </Typography>
      {row.TransporterClient && (
        <Typography variant="h5">
          Client Name: {row.TransporterClient.clientName}
        </Typography>
      )}
      <Typography variant="h5">
        Waste Name:{" "}
        {row.QuotationWaste.wasteName ? row.QuotationWaste.wasteName : ""}
      </Typography>
      <Typography variant="h5">
        Vehicle Type:{" "}
        {row.QuotationTransportation
          ? row.QuotationTransportation.VehicleType.typeOfVehicle
          : "CLIENT VEHICLE"}
      </Typography>
      <Typography variant="h5">
        Remarks: {row.remarks ? row.remarks : "NO REMARKS"}
      </Typography>
      <br />
      <hr />
    </Box>
  );
};

export default BookedTransaction;
