import React, { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../theme";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Check if the current route is either "/signup" or "/login"
  const isAuthPage =
    location.pathname === "/client" ||
    location.pathname === "/employee" ||
    location.pathname === "/";

  const handleLogout = async () => {
    try {
      // Make a request to logout endpoint
      const response = await axios.get(`${apiUrl}/api/logout`, {
        withCredentials: true, // send cookies if any
      });

      let route;

      if (Number.isInteger(user?.userType)) {
        route = "/employee";
      } else if (!Number.isInteger(user?.userType)) {
        route = "/client";
      } else {
        route = "/";
      }

      if (response.status === 200) {
        // Prevent navigation back to the session by clearing history
        window.history.replaceState(null, "", route); // Replace history entry
        navigate(route, { replace: true }); // Navigate to login or appropriate route
        window.location.reload(); // Ensure all in-memory data is cleared      } else {
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Handle error if necessary
    }
  };

  // Function to get the current time in "08:05:25 PM" format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    // Set initial time
    setCurrentTime(getCurrentTime());

    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="fixed">
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
            style={{ textDecoration: "none" }}
          >
            FAR EAST FUEL CORPORATION
          </Typography>
        </Box>
        {location.pathname === "/attendance" && !isMobile && (
          <Box display="flex" alignItems="center" mr={2}>
            <Typography variant="h6" sx={{ fontSize: "40px" }}>
              {currentTime}
            </Typography>
          </Box>
        )}
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
        {!isAuthPage && location.pathname !== "/attendance" && (
          <Box display="flex" gap={2}>
            <Button onClick={handleLogout} color="inherit">
              <Typography variant="h5" style={{ marginLeft: "10px" }}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </Typography>
            </Button>
          </Box>
        )}
        {isAuthPage && (
          <>
            <Box sx={{ display: { xs: "none", md: "flex" } }} gap={2}>
              <Button component={Link} to="/" color="inherit">
                <Typography variant="h5">Home</Typography>
              </Button>
              <Button component={Link} to="/client" color="inherit">
                <Typography variant="h5">Client</Typography>
              </Button>
              <Button component={Link} to="/employee" color="inherit">
                <Typography variant="h5">Employee</Typography>
              </Button>
            </Box>
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <List>
                <ListItem
                  button
                  component={Link}
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/client"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Client" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/employee"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Employee" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
