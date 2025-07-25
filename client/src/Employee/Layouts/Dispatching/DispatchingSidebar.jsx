import React, { useEffect, useState, useMemo } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  BottomNavigation,
  Box,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BuildIcon from "@mui/icons-material/Build";
import TopicIcon from "@mui/icons-material/Topic";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Item from "../../../OtherComponents/Item";
import useMediaQuery from "@mui/material/useMediaQuery";
import BottomNavItem from "../../../OtherComponents/BottomNavItem";

const DispatchingSidebar = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathToTitleMap = useMemo(
    () => ({
      "/dashboard/dashboard": "Dashboard",
      "/dashboard/transactions": "Transactions",
      "/dashboard/vehicleLocation": "Vehicle Location",
      "/dashboard/vehicleTypes": "Type Of Vehicles",
      "/dashboard/vehicles": "Vehicles",
      "/dashboard/vehicleMaintenanceRequests": "Vehicle Maintenance Request",
      "/dashboard/clients": "Clients",
      "/dashboard/documents": "Documents",
      "/dashboard/calendar": "Calendar",
      "/dashboard/switchUser": "Switch User",
    }),
    []
  ); // No dependencies, as this is a static object

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
    <Box
      sx={{
        width: "100%",
        overflowX: "auto", // Enable horizontal scrolling
        whiteSpace: "nowrap", // Prevent items from wrapping to the next line
        position: "fixed",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
        bottom: 0,
        zIndex: 1300,
        backgroundColor: colors.primary[400],
      }}
    >
      <BottomNavigation
        value={selected}
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        sx={{
          width: "100%",
          display: "inline-flex", // Align items in a single row
          flexDirection: "row",
          "& .Mui-selected": {
            color: colors.greenAccent[400], // Apply custom color to selected action
          },
        }}
      >
        <BottomNavItem
          label="Dashboard"
          value="Dashboard"
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
          label="Vehicle Location"
          value="Vehicle Location"
          icon={LocationOnIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"vehicleLocation"}
        />
        <BottomNavItem
          label="Type Of Vehicles"
          value="Type Of Vehicles"
          icon={FormatListBulletedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"vehicleTypes"}
        />
        <BottomNavItem
          label="Vehicles"
          value="Vehicles"
          icon={LocalShippingIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"vehicles"}
        />
        <BottomNavItem
          label="Vehicle Maintenance Request"
          value="Vehicle Maintenance Request"
          icon={BuildIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"vehicleMaintenanceRequests"}
        />
        <BottomNavItem
          label="Clients"
          value="Clients"
          icon={PeopleOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"clients"}
        />
        <BottomNavItem
          label="Documents"
          value="Documents"
          icon={TopicIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"documents"}
        />
        <BottomNavItem
          label="Calendar"
          value="Calendar"
          icon={CalendarTodayOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"calendar"}
        />
        <BottomNavItem
          label="Switch User"
          value="Switch User"
          icon={AccountCircleIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"switchUser"}
        />
      </BottomNavigation>
    </Box>
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
                  DISPATCHING
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
              title="Dashboard"
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
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Vehicle Location"
              to="vehicleLocation"
              icon={<LocationOnIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Type Of Vehicles"
              to="vehicleTypes"
              icon={<FormatListBulletedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Vehicles"
              to="vehicles"
              icon={<LocalShippingIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Vehicle Maintenance Request"
              to="vehicleMaintenanceRequests"
              icon={<BuildIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Clients"
              to="clients"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Documents"
              to="documents"
              icon={<TopicIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Calendar"
              to="calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            <Item
              title="Switch User"
              to="switchUser"
              icon={<AccountCircleIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default DispatchingSidebar;
