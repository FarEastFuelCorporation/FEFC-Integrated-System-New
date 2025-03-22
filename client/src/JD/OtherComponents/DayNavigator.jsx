import React, { useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const DayNavigator = ({ setStartDate, setEndDate }) => {
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

  // Update parent dates whenever currentDate changes
  useEffect(() => {
    setStartDate(currentDate);
    setEndDate(currentDate); // or any logic to set different end date if needed
  }, [currentDate, setStartDate, setEndDate]);

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
        <Typography variant="h6">{formatDate(currentDate)}</Typography>
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
