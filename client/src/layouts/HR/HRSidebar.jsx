import React, { useEffect, useState, useMemo } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
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
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const HRSidebar = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathToTitleMap = useMemo(
    () => ({
      "/hrDashboard/dashboard": "Dashboard",
      "/hrDashboard/team": "Manage Team",
      "/hrDashboard/contacts": "Contacts Information",
      "/hrDashboard/invoices": "Invoice Balances",
      "/hrDashboard/form": "Profile Form",
      "/hrDashboard/calendar": "Calendar",
      "/hrDashboard/faq": "FAQ Page",
      "/hrDashboard/bar": "Bar Chart",
      "/hrDashboard/pie": "Pie Chart",
      "/hrDashboard/line": "Line Chart",
      "/hrDashboard/geography": "Geography Chart",
    }),
    []
  ); // No dependencies, as this is a static object

  const initialSelected = pathToTitleMap[location.pathname] || "Dashboard";
  const [selected, setSelected] = useState(initialSelected);
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);

  useEffect(() => {
    console.log("Location changed to:", location.pathname);
    const currentTitle = pathToTitleMap[location.pathname] || "Dashboard";
    console.log("Current selected:", currentTitle);
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

  return (
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
                  HUMAN RESOURCES
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
              to="/hrDashboard/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected === "Dashboard"}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              to="/hrDashboard/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected === "Manage Team"}
              setSelected={setSelected}
            />
            <Item
              title="Employee Records"
              to="/hrDashboard/employee"
              icon={<ContactsOutlinedIcon />}
              selected={selected === "Contacts Information"}
              setSelected={setSelected}
            />
            <Item
              title="Invoice Balances"
              to="/hrDashboard/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected === "Invoice Balances"}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/hrDashboard/form"
              icon={<PersonOutlinedIcon />}
              selected={selected === "Profile Form"}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/hrDashboard/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected === "Calendar"}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/hrDashboard/faq"
              icon={<HelpOutlinedIcon />}
              selected={selected === "FAQ Page"}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/hrDashboard/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected === "Bar Chart"}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/hrDashboard/pie"
              icon={<PieChartOutlinedIcon />}
              selected={selected === "Pie Chart"}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/hrDashboard/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected === "Line Chart"}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default HRSidebar;