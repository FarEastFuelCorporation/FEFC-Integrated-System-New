import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";

const Undertime = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dataRecords, setRecords] = useState([]);
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

  return (
    <Box m="20px">
      <LoadingSpinner isLoading={loading} />
      <Box sx={{ display: "flex", gap: 2 }}>
        <IconButton
          color="error" // Set the color to error (red)
          onClick={handleBackClick}
          sx={{ m: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ fontSize: 20 }}>Undertime</Typography>
      </Box>
      <hr />
    </Box>
  );
};

export default Undertime;
