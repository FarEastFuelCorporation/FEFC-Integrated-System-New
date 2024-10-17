import React, { useEffect, useState, useMemo } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  BottomNavigation,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import Item from "../../../OtherComponents/Item";
import useMediaQuery from "@mui/material/useMediaQuery";
import BottomNavItem from "../../../OtherComponents/BottomNavItem";

const LeaderSideBar = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathToTitleMap = useMemo(
    () => ({
      "/dashboard": "Home",
      "/dashboard/transactions": "Transactions",
      "/dashboard/profile": "Profile",
    }),
    []
  );

  const initialSelected = pathToTitleMap[location.pathname] || "Dashboard";
  const [selected, setSelected] = useState(initialSelected);
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);

  useEffect(() => {
    const currentTitle = pathToTitleMap[location.pathname] || "Dashboard";
    setSelected(currentTitle);
  }, [location, pathToTitleMap]);

  useEffect(() => {
    const convertUint8ArrayToBlob = () => {
      if (
        !user ||
        !user.employeePicture ||
        !user.employeePicture.profile_picture
      ) {
        return;
      }

      const uint8Array = new Uint8Array(
        user.employeePicture.profile_picture.data
      );
      const blob = new Blob([uint8Array], { type: "image/jpeg" });

      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureSrc(reader.result);
      };
      reader.readAsDataURL(blob);
    };

    convertUint8ArrayToBlob();
  }, [user]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={selected}
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        sx={{
          position: "fixed",
          bottom: 0,
          zIndex: 99999,
          backgroundColor: colors.primary[400],
          display: "inline-flex", // Align items in a single row
          flexDirection: "row",
          "& .Mui-selected": {
            color: colors.greenAccent[400], // Apply custom color to selected action
          },
          width: "100%",
        }}
      >
        <BottomNavItem
          label="Home"
          value="Home"
          icon={HomeOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={""}
        />
        <BottomNavItem
          label="Transactions"
          value="Transactions"
          icon={PointOfSaleIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"transactions"}
        />
        <BottomNavItem
          label="Profile"
          value="Profile"
          icon={PeopleOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"profile"}
        />
        {user.role === "employee" && (
          <BottomNavItem
            label="Switch User"
            value="switchUser"
            icon={AccountCircleIcon}
            selected={selected}
            setSelected={setSelected}
            navigate={"switchUser"}
          />
        )}
      </BottomNavigation>
    </Paper>
  ) : (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        display: "flex",
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square" style={{ height: "calc(100vh - 64px)" }}>
          <MenuItem
            onClick={handleCollapse}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "0 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h4" color={colors.grey[100]}>
                  EMPLOYEE
                </Typography>
                <IconButton onClick={handleCollapse}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && user && profilePictureSrc && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={profilePictureSrc}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.employeeDetails.firstName}{" "}
                  {user.employeeDetails.lastName}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user.employeeDetails.designation}
                </Typography>
              </Box>
            </Box>
          )}

          {isCollapsed && user && profilePictureSrc && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="50px"
                  height="50px"
                  src={profilePictureSrc}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to=""
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Transactions"
              to="transactions"
              icon={<PointOfSaleIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Profile"
              to="profile"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            {user.role === "employee" && (
              <Item
                title="Switch User"
                to="switchUser"
                icon={<AccountCircleIcon />}
                selected={selected}
                setSelected={setSelected}
                collapsed={isCollapsed}
              />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default LeaderSideBar;
