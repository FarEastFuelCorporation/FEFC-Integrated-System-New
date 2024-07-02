import React from "react";
import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";

export const CustomAccordionStyles = ({ children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      sx={{
        "& .MuiAccordion-root": {
          backgroundColor: colors.primary[400],
          boxShadow: "none",
          borderBottom: `1px solid ${colors.grey[200]}`,
          "&:before": {
            display: "none",
          },
        },
        "& .MuiAccordionSummary-root": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: `1px solid ${colors.grey[300]}`,
          "&:hover": {
            backgroundColor: colors.blueAccent[800],
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItem: "center",
          },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            "& .MuiTypography-root": {
              width: "100%",
              fontSize: theme.typography.h4.fontSize,
              fontWeight: theme.typography.fontWeightBold,
              display: "flex",
              alignItems: "center",
            },
          },
        },
        "& .MuiAccordionDetails-root": {
          backgroundColor: colors.primary[400],
          borderTop: `1px solid ${colors.grey[300]}`,
          padding: theme.spacing(2),
        },
      }}
    >
      {children}

      <Box sx={{ borderLeft: "1px solid black" }}></Box>
    </Box>
  );
};

export const CustomAccordionSummary = ({
  row,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <AccordionSummary sx={{}}>
      <Typography variant="h4">Transaction ID: {row.transactionId}</Typography>

      <div style={{ display: "flex" }}>
        <IconButton onClick={() => handleEditClick(row.id)}>
          <EditIcon sx={{ color: "#ff9800" }} />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(row.id)}>
          <DeleteIcon sx={{ color: "#f44336" }} />
        </IconButton>
      </div>
    </AccordionSummary>
  );
};

export const CustomAccordionDetails = ({ children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <AccordionDetails
      sx={{
        paddingLeft: "80px !important",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "40px",
          borderLeft: `4px solid ${colors.grey[300]}`,
          height: "calc(100% - 32px)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: "22px",
          height: "40px",
          width: "40px",
          borderRadius: "100%",
          backgroundColor: `${colors.grey[100]}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CollectionsBookmarkIcon
          sx={{
            fontSize: "30px",
            color: `${colors.greenAccent[400]}`,
          }}
        />
      </div>
      {children}
    </AccordionDetails>
  );
};
