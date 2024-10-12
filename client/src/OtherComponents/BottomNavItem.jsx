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
            color: selected === value ? colors.greenAccent[400] : "inherit",
          }}
        />
      }
      onClick={() => {
        setSelected(value);
        navigateLink(navigate); // Correctly pass the lowercase value for navigation
      }}
    />
  );
};

export default BottomNavItem;
