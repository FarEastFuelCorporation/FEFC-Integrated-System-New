import React, { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Check if the current route is either "/signup" or "/login"
  const isAuthPage =
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/";

  const handleLogout = async () => {
    try {
      // Make a request to logout endpoint
      const response = await axios.get("http://localhost:3001/logout", {
        withCredentials: true, // send cookies if any
      });

      if (response.status === 200) {
        // Clear browser history
        window.history.pushState(null, "", "/login");
        navigate("/login", { replace: true }); // Use replace: true to replace current history entry
      } else {
        console.error("Logout failed:", response.statusText);
        // Handle error if necessary
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Handle error if necessary
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ padding: "10px" }}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <img
            alt="profile-user"
            width="40px"
            height="40px"
            src={`../../assets/logo.png`}
            style={{ cursor: "pointer" }}
          ></img>
          <Typography
            p="0 0 0 10px"
            variant="h4"
            fontFamily="Times New Roman"
            fontWeight="bold"
            color="#ffbf00"
            component={Link}
            to="/"
            style={{ textDecoration: "none" }}
          >
            FAR EAST FUEL CORPORATION
          </Typography>
        </Box>
        <Box display="flex">
          <IconButton
            onClick={colorMode.toggleColorMode}
            style={{ color: colors.greenAccent[500] }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>
        {!isAuthPage ? (
          <Box display="flex" gap={2}>
            <Button onClick={handleLogout} color="inherit">
              <Typography variant="h5">Logout</Typography>
              <Typography variant="h5" style={{ marginLeft: "10px" }}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </Typography>
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={2}>
            <Button component={Link} to="/" color="inherit">
              <Typography variant="h5">Home</Typography>
            </Button>
            <Button component={Link} to="/signup" color="inherit">
              <Typography variant="h5">Sign Up</Typography>
            </Button>
            <Button component={Link} to="/login" color="inherit">
              <Typography variant="h5">Login</Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;