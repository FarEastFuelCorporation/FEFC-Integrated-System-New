import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";
import HandbookComponent from "./HandbookComponent";

const HandBook = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <Typography
            sx={{ fontSize: 20, display: "flex", alignItems: "center" }}
          >
            Employee Handbook
          </Typography>
        </Box>
      </Box>
      <hr />
      <HandbookComponent />
    </Box>
  );
};

export default HandBook;
