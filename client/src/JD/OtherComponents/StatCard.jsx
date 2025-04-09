import React from "react";
import { Box, Typography } from "@mui/material";

const StatCard = ({ title, value, Icon, iconColor = "secondary" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color="textSecondary">
          {value}
        </Typography>
      </Box>
      {Icon && <Icon sx={{ fontSize: 40, marginRight: 2 }} color={iconColor} />}
    </Box>
  );
};

export default StatCard;
