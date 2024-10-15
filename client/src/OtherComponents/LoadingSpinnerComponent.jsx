import React from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const LoadingSpinnerComponent = ({ isLoading, size = 40 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  if (!isLoading) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100px" // Adjust the height as per your layout needs
    >
      <CircularProgress size={size} sx={{ color: colors.greenAccent[500] }} />
    </Box>
  );
};

export default LoadingSpinnerComponent;
