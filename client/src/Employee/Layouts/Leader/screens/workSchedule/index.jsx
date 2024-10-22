import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";

const WorkSchedule = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // const response = await axios.get(
      //   `${apiUrl}/api/attendanceRecord/${user.id}`
      // );

      // setRecords(response.data.results);
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
  return (
    <Box m="20px">
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
          <Typography
            sx={{ fontSize: 20, display: "flex", alignItems: "center" }}
          >
            Work Schedule
          </Typography>
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
    </Box>
  );
};

export default WorkSchedule;
