import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import moment from "moment-timezone";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const BookedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  };

  const formatDate = (timestamp) => {
    return moment(timestamp).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss");
  };

  const formattedDate = row.createdAt ? formatDate(row.createdAt) : "";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
          Booked
        </Typography>
        <Typography variant="h5">{formattedDate}</Typography>
      </Box>
      <Typography variant="h5">
        Hauling Date: {format(new Date(row.haulingDate), "MMMM dd, yyyy")}
      </Typography>
      <Typography variant="h5">
        Hauling Time:{" "}
        {row.haulingTime
          ? format(parseTimeString(row.haulingTime), "hh:mm aa")
          : ""}
      </Typography>
      <Typography variant="h5">
        Waste Name: {row.QuotationWaste.wasteName}
      </Typography>
      <Typography variant="h5">
        Vehicle Type: {row.QuotationTransportation.vehicleType}
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
