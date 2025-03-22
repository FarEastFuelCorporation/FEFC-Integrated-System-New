import { useState, useEffect } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const MonthNavigator = ({ setStartDate, setEndDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update currentDate to previous month
  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  // Update currentDate to next month
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  // Calculate the start and end of the month
  useEffect(() => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Pass the start and end dates to the parent component
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
  }, [currentDate, setStartDate, setEndDate]);

  // Format the month and year for display
  const formatMonth = (date) => {
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Grid container alignItems="center" mb={-5}>
      <Grid item>
        <IconButton onClick={handlePreviousMonth}>
          <ArrowLeftIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={handleNextMonth}>
          <ArrowRightIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default MonthNavigator;
