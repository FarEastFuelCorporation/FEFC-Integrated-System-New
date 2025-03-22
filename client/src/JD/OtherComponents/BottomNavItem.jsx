import { BottomNavigationAction, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

const BottomNavItem = ({
  label,
  value,
  icon: Icon,
  selected,
  setSelected,
  navigate,
}) => {
  const theme = useTheme(); // Move useTheme inside the component
  const colors = tokens(theme.palette.mode); // Update colors based on current theme
  const navigateLink = useNavigate();

  return (
    <BottomNavigationAction
      label={label}
      value={value}
      icon={
        <Icon
          sx={{
            color: selected ? colors.greenAccent[400] : "inherit",
            transform: selected ? "scale(1.5)" : "scale(1)", // Scale icon when selected
            transition: "transform 0.2s", // Add a smooth transition
          }}
        />
      }
      onClick={() => {
        setSelected(value);
        navigateLink(navigate); // Correctly pass the lowercase value for navigation
      }}
      sx={{
        "& .MuiBottomNavigationAction-label": {
          color: selected ? colors.greenAccent[400] : "inherit",
          opacity: 1,
        },
        padding: 0,
      }}
    />
  );
};

export default BottomNavItem;
