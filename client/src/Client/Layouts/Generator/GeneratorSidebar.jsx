import React, { useEffect, useCallback, useState, useMemo } from "react";
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
  BottomNavigation,
  useMediaQuery,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import SuccessMessage from "../../../OtherComponents/SuccessMessage";
import Item from "../../../OtherComponents/Item";
import {
  HomeOutlined as HomeOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
} from "@mui/icons-material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HelpIcon from "@mui/icons-material/Help";
import axios from "axios";
import BottomNavItem from "../../../OtherComponents/BottomNavItem";

const GeneratorSidebar = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathToTitleMap = useMemo(
    () => ({
      "/dashboard/dashboard": "Dashboard",
      "/dashboard/transactions": "Transactions",
      "/dashboard/quotations": "Quotations",
      "/dashboard/calendar": "Calendar",
      "/dashboard/help": "Help",
    }),
    []
  );

  const initialSelected = pathToTitleMap[location.pathname] || "Dashboard";
  const [selected, setSelected] = useState(initialSelected);

  const [profilePictureSrc, setProfilePictureSrc] = useState(
    "/assets/unknown.png"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [clientDetails, setClientDetails] = useState({
    clientId: "",
    clientName: "",
    address: "",
    natureOfBusiness: "",
    contactNumber: "",
    clientType: "",
    billerName: "",
    billerAddress: "",
    billerContactPerson: "",
    billerContactNumber: "",
    billerTinNumber: "",
    clientPicture: "",
  });

  useEffect(() => {
    const currentTitle = pathToTitleMap[location.pathname] || "Dashboard";
    setSelected(currentTitle);
  }, [location, pathToTitleMap]);

  useEffect(() => {
    if (
      user &&
      user.clientDetails &&
      user.clientDetails.clientPicture &&
      user.clientDetails.clientPicture.data
    ) {
      const clientPictureData = new Uint8Array(
        user.clientDetails.clientPicture.data
      );

      const blob = new Blob([clientPictureData], {
        type: user.clientDetails.clientPicture.type,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureSrc(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading the Blob as Data URL");
        setProfilePictureSrc("/assets/unknown.png");
      };
      reader.readAsDataURL(blob);
    } else {
      setProfilePictureSrc("/assets/unknown.png");
    }
  }, [user]);

  const initializeClientDetails = useCallback(() => {
    const { clientDetails } = user || {};
    setClientDetails({
      id: clientDetails?.id || "",
      clientId: clientDetails?.clientId || "",
      clientName: clientDetails?.clientName || "",
      address: clientDetails?.address || "",
      natureOfBusiness: clientDetails?.natureOfBusiness || "",
      contactNumber: clientDetails?.contactNumber || "",
      clientType: clientDetails?.clientType || "",
      billerName: clientDetails?.billerName || "",
      billerAddress: clientDetails?.billerAddress || "",
      billerContactPerson: clientDetails?.billerContactPerson || "",
      billerContactNumber: clientDetails?.billerContactNumber || "",
      billerTinNumber: clientDetails?.billerTinNumber || "",
      clientPicture: clientDetails?.clientPicture || "",
    });
  }, [user]);

  useEffect(() => {
    initializeClientDetails();
  }, [initializeClientDetails]);

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
      formDataToSend.append("billerTinNumber", clientDetails.billerTinNumber);
      formDataToSend.append("clientPicture", clientDetails.clientPicture);
      formDataToSend.append("submittedBy", clientDetails.submittedBy);
      // Add clientPicture if it's selected
      if (selectedFile) {
        formDataToSend.append("clientPicture", selectedFile);
      }
      // Update existing client
      const response = await axios.put(
        `${apiUrl}/api/client/${clientDetails.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the profile picture source if a new file was uploaded
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          setProfilePictureSrc(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }

      const data = response.data.client;

      setClientDetails({
        id: data?.id || "",
        clientId: data?.clientId || "",
        clientName: data?.clientName || "",
        address: data?.address || "",
        natureOfBusiness: data?.natureOfBusiness || "",
        contactNumber: data?.contactNumber || "",
        clientType: data?.clientType || "",
        billerName: data?.billerName || "",
        billerAddress: data?.billerAddress || "",
        billerContactPerson: data?.billerContactPerson || "",
        billerContactNumber: data?.billerContactNumber || "",
        billerTinNumber: data?.billerTinNumber || "",
        clientPicture: data?.clientPicture || "",
      });

      setSuccessMessage("Client updated successfully!");
      setShowSuccessMessage(true); // Show the success message
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
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
          label="Quotations"
          value="Quotations"
          icon={FormatListBulletedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"quotations"}
        />
        <BottomNavItem
          label="Help"
          value="Help"
          icon={HelpIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"help"}
        />
      </BottomNavigation>
    </Box>
  ) : (
    <Box
      position="relative"
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
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <ProSidebar collapsed={isCollapsed}>
        <Box display="flex" flexDirection="column" height="calc(100vh - 64px)">
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
                    src={profilePictureSrc}
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
                title="Transactions"
                to="transactions"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                collapsed={isCollapsed}
              />
              <Item
                title="Quotations"
                to="quotations"
                icon={<FormatListBulletedIcon />}
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
                title="Help"
                to="help"
                icon={<HelpIcon />}
                selected={selected}
                setSelected={setSelected}
                collapsed={isCollapsed}
              />
            </Box>
          </Menu>
          {/* Footer Section */}
          <Box textAlign="center" mt="auto" mb={2} p={2}>
            <Typography variant="h5" color={colors.grey[100]}>
              Powered by <strong>JIM'S INTEGRATION</strong>
            </Typography>
            <Typography variant="h5" color={colors.grey[100]}>
              <i>jimsintegration@gmail.com</i>
            </Typography>
          </Box>
        </Box>
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
            autoComplete="off"
            value={clientDetails.clientName}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Address"
            name="address"
            autoComplete="off"
            value={clientDetails.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nature of Business"
            name="natureOfBusiness"
            autoComplete="off"
            value={clientDetails.natureOfBusiness}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contact Number"
            name="contactNumber"
            autoComplete="off"
            value={clientDetails.contactNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Client Type"
            name="clientType"
            autoComplete="off"
            value={clientDetails.clientType}
            onChange={handleInputChange}
            disabled
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Name"
            name="billerName"
            autoComplete="off"
            value={clientDetails.billerName}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Address"
            name="billerAddress"
            autoComplete="off"
            value={clientDetails.billerAddress}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Contact Person"
            name="billerContactPerson"
            autoComplete="off"
            value={clientDetails.billerContactPerson}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller Contact Number"
            name="billerContactNumber"
            autoComplete="off"
            value={clientDetails.billerContactNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Biller TIN Number"
            name="billerTinNumber"
            autoComplete="off"
            value={clientDetails.billerTinNumber}
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
