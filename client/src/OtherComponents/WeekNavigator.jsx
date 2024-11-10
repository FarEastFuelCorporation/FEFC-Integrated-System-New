import { useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const WeekNavigator = ({ setStartDate, setEndDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7); // Go back 7 days
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7); // Go forward 7 days
      return newDate;
    });
  };

  // Compute the start and end of the week whenever currentDate changes
  useEffect(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diffToSaturday = day === 0 ? -1 : 6 - day; // Adjust to get Saturday as the start
    startOfWeek.setDate(currentDate.getDate() + diffToSaturday); // Start on Saturday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Friday (6 days after Saturday)

    // Pass the start and end dates to the parent component
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
  }, [currentDate, setStartDate, setEndDate]);

  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7); // Week number calculation
  };

  const formatWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diffToSaturday = day === 0 ? -1 : 6 - day; // Adjust to get Saturday as the start
    startOfWeek.setDate(date.getDate() + diffToSaturday); // Start on Saturday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Friday (6 days after Saturday)

    const options = { month: "short", day: "numeric" };
    const weekNumber = getWeekNumber(startOfWeek);
    const year = startOfWeek.getFullYear(); // Extract the year

    // Format the week with the year at the end
    return `Week ${weekNumber}: ${startOfWeek.toLocaleDateString(
      undefined,
      options
    )} - ${endOfWeek.toLocaleDateString(undefined, options)}, ${year}`;
  };

  return (
    <Grid container alignItems="center" mb={-5}>
      <Grid item>
        <IconButton onClick={handlePreviousWeek}>
          <ArrowLeftIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
      <Grid item mx={-1}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={handleNextWeek}>
          <ArrowRightIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default WeekNavigator;
