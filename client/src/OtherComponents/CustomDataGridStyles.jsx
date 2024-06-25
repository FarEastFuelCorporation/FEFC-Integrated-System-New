import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CustomDataGridStyles = ({ children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      m="40px 0 0 0"
      height="75vh"
      width="100% !important"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
          width: "100%",
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "normal !important",
          wordWrap: "break-word !important",
          lineHeight: "1.2 !important",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default CustomDataGridStyles;
