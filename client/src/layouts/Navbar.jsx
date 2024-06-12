import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Check if the current route is either "/signup" or "/login"
  const isAuthPage =
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/";
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
        {!isAuthPage ? null : (
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
