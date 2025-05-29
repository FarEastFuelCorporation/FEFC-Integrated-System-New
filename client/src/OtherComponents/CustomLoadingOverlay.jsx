// CustomLoadingOverlay.jsx
import React from "react";
import { GridOverlay } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const CustomLoadingOverlay = () => {
  return (
    <GridOverlay>
      <Box
        height="100%"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress color="secondary" />
      </Box>
    </GridOverlay>
  );
};

export default CustomLoadingOverlay;
