import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const BookedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    bookedCreatedDate,
    bookedCreatedTime,
    haulingDate,
    haulingTime,
    wasteName,
    vehicleType,
    bookedRemarks,
  } = row;
  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  };
  return (
    <Box sx={{ my: 3, position: "relative" }}>
      <CircleLogo>
        <CollectionsBookmarkIcon
          sx={{
            fontSize: "30px",
            color: `${colors.greenAccent[400]}`,
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
        <Typography variant="h5">
          {bookedCreatedDate} {bookedCreatedTime}
        </Typography>
      </Box>
      <Typography variant="h5">
        Hauling Date: {format(new Date(haulingDate), "MMMM dd, yyyy")}
      </Typography>
      <Typography variant="h5">
        Hauling Time:{" "}
        {haulingTime ? format(parseTimeString(haulingTime), "hh:mm aa") : ""}
      </Typography>
      <Typography variant="h5">Waste Name: {wasteName}</Typography>
      <Typography variant="h5">Vehicle Type: {vehicleType}</Typography>
      <Typography variant="h5">
        Remarks: {bookedRemarks ? bookedRemarks : "NO REMARKS"}
      </Typography>
      <br />
      <hr />
    </Box>
  );
};

export default BookedTransaction;
