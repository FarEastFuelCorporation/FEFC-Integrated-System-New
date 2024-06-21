import React, { useEffect, useState, useMemo } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
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
import axios from "axios";
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

const GeneratorSidebar = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathToTitleMap = useMemo(
    () => ({
      "/dashboard/dashboard": "Dashboard",
      "/dashboard/clients": "Clients",
      "/dashboard/typeOfWastes": "Type Of Wastes",
      "/dashboard/quotations": "Quotations",
      "/dashboard/commissions": "Commissions",
      "/dashboard/form": "Profile Form",
      "/dashboard/calendar": "Calendar",
      "/dashboard/faq": "FAQ Page",
      "/dashboard/bar": "Bar Chart",
      "/dashboard/pie": "Pie Chart",
      "/dashboard/line": "Line Chart",
    }),
    []
  ); // No dependencies, as this is a static object

  const initialSelected = pathToTitleMap[location.pathname] || "Dashboard";
  const [selected, setSelected] = useState(initialSelected);
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [clientDetails, setClientDetails] = useState({
    clientId: user?.clientDetails?.clientId || "",
    clientName: user?.clientDetails?.clientName || "",
    address: user?.clientDetails?.address || "",
    natureOfBusiness: user?.clientDetails?.natureOfBusiness || "",
    contactNumber: user?.clientDetails?.contactNumber || "",
    clientType: user?.clientDetails?.clientType || "",
    billerName: user?.clientDetails?.billerName || "",
    billerAddress: user?.clientDetails?.billerAddress || "",
    billerContactPerson: user?.clientDetails?.billerContactPerson || "",
    billerContactNumber: user?.clientDetails?.billerContactNumber || "",
    clientPicture: user?.clientDetails?.clientPicture || "",
  });

  useEffect(() => {
    const currentTitle = pathToTitleMap[location.pathname] || "Dashboard";
    setSelected(currentTitle);
  }, [location, pathToTitleMap]);

  useEffect(() => {
    const convertUint8ArrayToBlob = () => {
      if (
        !user ||
        !user.clientDetails ||
        !user.clientDetails.clientPicture ||
        !user.clientDetails.clientPicture.data
      ) {
        // If no user or no profile picture data, set default image
        setProfilePictureSrc("/assets/unknown.png");
        return;
      }

      const clientPictureData = new Uint8Array(
        user.clientDetails.clientPicture.data
      );

      // Check if clientPictureData is indeed a Uint8Array
      if (clientPictureData instanceof Uint8Array) {
        const blob = new Blob([clientPictureData], {
          type: user.clientDetails.clientPicture.type,
        });

        const reader = new FileReader();
        reader.onload = () => {
          setProfilePictureSrc(reader.result);
        };
        reader.readAsDataURL(blob);
      } else {
        // Handle case where clientPictureData is not a Uint8Array (optional)
        console.error("Client picture data is not a Uint8Array");
        setProfilePictureSrc("/assets/unknown.png");
      }
    };

    convertUint8ArrayToBlob();
  }, [user]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(clientDetails);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("clientName", clientDetails.clientName);
      formDataToSend.append("address", clientDetails.address);
      formDataToSend.append("natureOfBusiness", clientDetails.natureOfBusiness);
      formDataToSend.append("contactNumber", clientDetails.contactNumber);
      formDataToSend.append("clientType", clientDetails.clientType);
      formDataToSend.append("billerName", clientDetails.billerName);
      formDataToSend.append("billerAddress", clientDetails.billerAddress);
      formDataToSend.append(
        "billerContactPerson",
        clientDetails.billerContactPerson
      );
      formDataToSend.append(
        "billerContactNumber",
        clientDetails.billerContactNumber
      );
      formDataToSend.append("clientPicture", clientDetails.clientPicture);
      formDataToSend.append("submittedBy", clientDetails.submittedBy);

      // Add clientPicture if it's selected
      if (selectedFile) {
        formDataToSend.append("clientPicture", selectedFile);
      }

      let response;

      // Update existing client
      response = await axios.put(
        `${apiUrl}/client/${clientDetails.clientId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Client updated successfully!");

      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
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
                  GENERATOR
                </Typography>
                <IconButton onClick={handleCollapse}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && user && profilePictureSrc && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={handleOpenModal}
                style={{ cursor: "pointer" }}
              >
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={clientDetails.profilePictureSrc}
                  style={{ borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {clientDetails.clientName}
                </Typography>
              </Box>
            </Box>
          )}

          {isCollapsed && user && profilePictureSrc && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={handleOpenModal}
                style={{ cursor: "pointer" }}
              >
                <img
                  alt="profile-user"
                  width="50px"
                  height="50px"
                  src={profilePictureSrc}
                  style={{ borderRadius: "50%" }}
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
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Clients"
              to="clients"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Type Of Wastes"
              to="typeOfWastes"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Quotations"
              to="quotations"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Commissions"
              to="commissions"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
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
              to="form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="faq"
              icon={<HelpOutlinedIcon />}
              selected={selected}
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
              to="bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="pie"
              icon={<PieChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Client Details
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Client Name"
            name="clientName"
            value={clientDetails.clientName}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Address"
            name="address"
            value={clientDetails.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nature of Business"
            name="natureOfBusiness"
            value={clientDetails.natureOfBusiness}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={clientDetails.contactNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Client Type"
            name="clientType"
            value={clientDetails.clientType}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Name"
            name="billerName"
            value={clientDetails.billerName}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Address"
            name="billerAddress"
            value={clientDetails.billerAddress}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Contact Person"
            name="billerContactPerson"
            value={clientDetails.billerContactPerson}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Contact Number"
            name="billerContactNumber"
            value={clientDetails.billerContactNumber}
            onChange={handleInputChange}
          />
          <input
            type="file"
            className="form-control visually-hidden"
            accept="image/*"
            onChange={handleFileChange}
            id="clientPicture"
            name="clientPicture"
            style={{ display: "none" }}
          />
          <label htmlFor="clientPicture">
            <Typography>File: {fileName}</Typography>
            <Button
              variant="contained"
              component="span"
              sx={{ mt: 2, backgroundColor: colors.primary[500] }}
            >
              Upload Client Picture
            </Button>
          </label>
          <br></br>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GeneratorSidebar;
