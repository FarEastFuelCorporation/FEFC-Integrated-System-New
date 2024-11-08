import React, { useState } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const DayNavigator = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format the current date
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle previous and next day navigation
  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <Grid container alignItems="center" mb={-5}>
      <Grid item>
        <IconButton onClick={handlePreviousDay}>
          <ArrowLeftIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography variant="h5">{formatDate(currentDate)}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={handleNextDay}>
          <ArrowRightIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default DayNavigator;
