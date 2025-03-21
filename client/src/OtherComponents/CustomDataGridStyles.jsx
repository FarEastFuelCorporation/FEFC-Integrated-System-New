import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CustomDataGridStyles = ({ children, height, margin = "40px 0 0 0" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      m={margin}
      height={height ? height : "75vh"}
      width="100%"
      sx={{
        "& .MuiDataGrid-checkboxInput.Mui-checked": {
          color: "secondary.main", // Use the secondary color from the theme
        },
        "& .MuiDataGrid-root": {
          border: "none",
          width: "100%",
          color: colors.grey[100],
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-root .MuiDataGrid-container--top [role=row]": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
          overflowX: "auto",
          overflowY: "auto", // Ensure scrolling works
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colors.grey[500],
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: colors.grey[700],
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: colors.grey[300],
          },
        },

        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
        "& .MuiDataGrid-columnHeader": {
          whiteSpace: "normal",
          wordWrap: "break-word",
          lineHeight: "1.2 !important", // Adjust line height as needed
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "normal",
          wordWrap: "break-word",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        "& .MuiDataGrid-overlayWrapper": {
          minHeight: "30px",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default CustomDataGridStyles;
