import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { tokens } from "../../../../../theme";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import QRCodeModal from "../../../../../OtherComponents/Modals/QRCodeModal";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const TravelOrder = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const modify = modifyApiUrlPort(apiUrl);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    destination: "",
    purpose: "",
    employeeId: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/travelOrder/${user.id}`);

      setRecords(response.data.travelOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const typeToEdit = dataRecords.find((type) => type.id === id);
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        departureDate: typeToEdit.departureDate,
        departureTime: typeToEdit.departureTime,
        arrivalDate: typeToEdit.arrivalDate,
        arrivalTime: typeToEdit.arrivalTime,
        destination: typeToEdit.destination,
        purpose: typeToEdit.purpose,
        employeeId: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Scrap type with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Travel Order?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/travelOrder/${id}`);

      fetchData();
      setSuccessMessage("Travel Order Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateFormData = (formData) => {
    const {
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      destination,
      purpose,
    } = formData;

    const errors = []; // Initialize an array to collect error messages

    // Check for required fields and push error messages to the array
    if (!departureDate) {
      errors.push("Please select a departure date.");
    }
    if (!departureTime) {
      errors.push("Please select a departure time.");
    }
    if (!arrivalDate) {
      errors.push("Please select an arrival date.");
    }
    if (!arrivalTime) {
      errors.push("Please select an arrival time.");
    }
    if (!destination) {
      errors.push("Please enter a destination.");
    }
    if (!purpose) {
      errors.push("Please enter a purpose.");
    }

    // Return concatenated error messages or null if no errors
    return errors.length > 0 ? errors.join(" ") : null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    // Validate the form data
    const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing travel order
        await axios.put(`${apiUrl}/api/travelOrder/${formData.id}`, formData);

        setSuccessMessage("Travel Order Updated Successfully!");
      } else {
        // Add new travel order
        await axios.post(`${apiUrl}/api/travelOrder`, formData);

        setSuccessMessage("Travel Order Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle closing the modal
  const handleCloseQRCodeModal = () => {
    setShowQRCodeModal(false);
    setQRCodeUrl(""); // Clear the QR code URL
  };

  const handleShowQRCode = (id) => {
    const qrUrl = `${modify}/travelOrderVerify/${id}`;

    // You can set the QR code URL to the state to display it in a modal or another component.
    setQRCodeUrl(qrUrl);
    setShowQRCodeModal(true); // Show the QR code modal
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "destination",
      headerName: "Destination",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedDeparture",
      headerName: "Departure",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.departureDate) return "";
        if (!params.row.departureTime) return "";

        // Format departure date
        const date = new Date(params.row.departureDate);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Format departure time
        const [hours, minutes, seconds] = params.row.departureTime.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = timeFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24:30 PM"

        return `${dateFormat} ${timeString}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedArrival",
      headerName: "Arrival",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.arrivalDate) return "";
        if (!params.row.arrivalTime) return "";

        // Format arrival date
        const date = new Date(params.row.arrivalDate);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Extract hours, minutes, and seconds from arrivalTime
        const [hours, minutes, seconds] = params.row.arrivalTime.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds); // Set seconds

        // Format arrival time with seconds
        const timeString = timeFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24:30 PM"

        return `${dateFormat} ${timeString}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedOut",
      headerName: "Out",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.out) return "";
        const date = new Date(params.row.out);
        const dateFomrat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"
        const timeFomrat = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24 PM"
        return `${dateFomrat} ${timeFomrat}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedIn",
      headerName: "In",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.in) return "";
        const date = new Date(params.row.in);
        const dateFomrat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"
        const timeFomrat = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24 PM"
        return `${dateFomrat} ${timeFomrat}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "qrCode",
      headerName: "QR Code",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleShowQRCode(params.row.id)} // Call the function to show QR code
        >
          Show QR
        </Button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton
          color="warning"
          onClick={() => handleEditClick(params.row.id)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            color="error" // Set the color to error (red)
            onClick={handleBackClick}
            sx={{ m: 0 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ fontSize: 20 }}>Travel Order</Typography>
        </Box>
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
      </Box>
      <hr />
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomDataGridStyles height={"auto"}>
        <DataGrid
          rows={dataRecords ? dataRecords : []}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>

      <Modal open={openModal} onClose={handleCloseModal}>
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
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Travel Order" : "Add New Travel Order"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Departure Date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              fullWidth
              type="date"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="Departure Time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              fullWidth
              type="time"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </div>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Arrival Date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleInputChange}
              fullWidth
              type="date"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="Arrival Time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              fullWidth
              type="time"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </div>
          <TextField
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
          <TextField
            label="Purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
          <TextField
            label="Created By"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            fullWidth
            autoComplete="off"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>

      {/* QR Code Modal */}
      <QRCodeModal
        open={showQRCodeModal}
        handleClose={handleCloseQRCodeModal}
        qrCodeUrl={qrCodeUrl}
      />
    </Box>
  );
};

export default TravelOrder;
