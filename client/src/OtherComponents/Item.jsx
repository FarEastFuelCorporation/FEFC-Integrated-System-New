import React from "react";
import { MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import log from "loglevel";

log.setLevel("info");

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleClick = () => {
    log.info(`Navigating to ${to}`);
    setSelected(title);
    navigate(to);
  };

  return (
    <MenuItem
      active={selected === title} // Apply 'active' prop based on selected state
      style={{
        color: colors.grey[100],
        backgroundColor:
          selected === title ? colors.primary[500] : "transparent", // Apply background color based on active state
      }}
      onClick={handleClick}
      icon={icon}
    >
      <Typography
        style={{
          whiteSpace: "normal", // Allow text to wrap
          wordBreak: "break-word", // Break long words
        }}
      >
        {title}
      </Typography>
    </MenuItem>
  );
};

export default Item;
