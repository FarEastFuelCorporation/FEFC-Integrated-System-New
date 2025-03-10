import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";

const NavIcon = ({ icon, label, to }) => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <IconButton
      onClick={() => navigate(to)}
      sx={{ display: "flex", flexDirection: "column", maxWidth: "70px" }}
    >
      <Box
        sx={{
          padding: "10px",
          borderRadius: "100%",
          height: "50px",
          width: "50px",
          backgroundColor: colors.blueAccent[400],
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // Center the icon inside the Box
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: 12 }}>{label}</Typography>
    </IconButton>
  );
};

export default NavIcon;
