import { useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const WeekNavigator = ({ setStartDate, setEndDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7);
      return newDate;
    });
  };

  // Compute the start and end of the week whenever currentDate changes
  useEffect(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day; // Adjust if Sunday (0) to get Monday
    startOfWeek.setDate(currentDate.getDate() + diffToMonday); // Start on Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday

    // Pass the start and end dates to the parent component
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
  }, [currentDate, setStartDate, setEndDate]);

  const formatWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day; // Adjust if Sunday (0) to get Monday
    startOfWeek.setDate(date.getDate() + diffToMonday); // Start on Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday

    const options = { month: "short", day: "numeric", year: "numeric" };
    return `${startOfWeek.toLocaleDateString(
      undefined,
      options
    )} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
  };

  return (
    <Grid container alignItems="center" mb={-5}>
      <Grid item>
        <IconButton onClick={handlePreviousWeek}>
          <ArrowLeftIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Grid>
      <Grid item>
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
