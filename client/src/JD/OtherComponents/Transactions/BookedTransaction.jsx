import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";
import axios from "axios";

const BookedTransaction = ({ row, user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [transporterClient, setTransporterClientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transporterClientResponse = await axios.get(
          `${apiUrl}/api/transporterClient`
        );

        setTransporterClientData(
          transporterClientResponse.data.transporterClients
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);

  // Step 1: Split the transporterClientId into individual IDs
  const ids = row.transporterClientId?.split(". ");

  // Step 2: Search the transporterClientData for each ID and get the clientNames
  let result;

  if (ids) {
    const clientNames = ids
      .map((id) => {
        const client = transporterClient.find((client) => client.id === id);
        return client ? client.clientName : null; // Return clientName or null if not found
      })
      .filter((name) => name !== null); // Filter out null values (in case some IDs do not match)

    // Step 3: Join the clientNames with ' / ' separator
    result = clientNames.join(" / ");
  }

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
        {row.createdBy.substring(0, 3) === "CUS"
          ? "Proposed Deliver Date:"
          : "Proposed Hauling Date:"}{" "}
        {row.haulingDate
          ? format(new Date(row.haulingDate), "MMMM dd, yyyy")
          : ""}
      </Typography>
      <Typography variant="h5">
        {row.createdBy.substring(0, 3) === "CUS"
          ? "Proposed Deliver Time:"
          : "Proposed Hauling Time:"}{" "}
        {row.haulingTime
          ? format(parseTimeString(row.haulingTime), "hh:mm aa")
          : ""}
      </Typography>
      {result && <Typography variant="h5">Client Name: {result}</Typography>}
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
