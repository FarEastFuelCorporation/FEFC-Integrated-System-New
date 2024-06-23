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
import { useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import SuccessMessage from "../../../OtherComponents/SuccessMessage";
import Item from "../../../OtherComponents/Item";
import {
  HomeOutlined as HomeOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  HelpOutlined as HelpOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  PieChartOutlined as PieChartOutlinedIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
} from "@mui/icons-material";
import axios from "axios";

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

  const initializeClientDetails = () => {
    const { clientDetails } = user || {};
    setClientDetails({
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
      clientPicture: clientDetails?.clientPicture || "",
    });
  };

  useEffect(() => {
    initializeClientDetails();
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

      // Update existing client
      await axios.put(
        `${apiUrl}/client/${clientDetails.clientId}`,
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

      setSuccessMessage("Client updated successfully!");
      setShowSuccessMessage(true); // Show the success message
      initializeClientDetails();
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
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
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
              to="/dashboard/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected === "Dashboard"}
              setSelected={() => setSelected("Dashboard")}
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
              to="/dashboard/clients"
              icon={<PeopleOutlinedIcon />}
              selected={selected === "Clients"}
              setSelected={() => setSelected("Clients")}
            />
            <Item
              title="Type Of Wastes"
              to="/dashboard/typeOfWastes"
              icon={<PeopleOutlinedIcon />}
              selected={selected === "Type Of Wastes"}
              setSelected={() => setSelected("Type Of Wastes")}
            />
            <Item
              title="Quotations"
              to="/dashboard/quotations"
              icon={<ContactsOutlinedIcon />}
              selected={selected === "Quotations"}
              setSelected={() => setSelected("Quotations")}
            />
            <Item
              title="Commissions"
              to="/dashboard/commissions"
              icon={<ReceiptOutlinedIcon />}
              selected={selected === "Commissions"}
              setSelected={() => setSelected("Commissions")}
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
              to="/dashboard/form"
              icon={<PersonOutlinedIcon />}
              selected={selected === "Profile Form"}
              setSelected={() => setSelected("Profile Form")}
            />
            <Item
              title="Calendar"
              to="/dashboard/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected === "Calendar"}
              setSelected={() => setSelected("Calendar")}
            />
            <Item
              title="FAQ Page"
              to="/dashboard/faq"
              icon={<HelpOutlinedIcon />}
              selected={selected === "FAQ Page"}
              setSelected={() => setSelected("FAQ Page")}
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
              to="/dashboard/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected === "Bar Chart"}
              setSelected={() => setSelected("Bar Chart")}
            />
            <Item
              title="Pie Chart"
              to="/dashboard/pie"
              icon={<PieChartOutlinedIcon />}
              selected={selected === "Pie Chart"}
              setSelected={() => setSelected("Pie Chart")}
            />
            <Item
              title="Line Chart"
              to="/dashboard/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected === "Line Chart"}
              setSelected={() => setSelected("Line Chart")}
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
