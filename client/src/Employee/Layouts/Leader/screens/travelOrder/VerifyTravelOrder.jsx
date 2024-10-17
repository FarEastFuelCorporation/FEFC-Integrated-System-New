import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import { tokens } from "../../../../../theme";
import {
  formatDate3,
  formatDate4,
  formatTime2,
  formatTime3,
} from "../../../../../OtherComponents/Functions";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";

const VerifyTravelOrder = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const apiUrl = process.env.REACT_APP_API_URL;
  const [data, setData] = useState(null);
  const { id } = useParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true); // State to indicate loading

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); // Navigate back to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/travelOrderVerify/${id}`);

      setData(response.data.travelOrder);

      // Set a timeout of 5 seconds before setting loading to false
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [apiUrl, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.put(`${apiUrl}/api/travelOrderVerify/${id}`);

      setData(response.data.updatedTravelOrder);

      setSuccessMessage("Travel Order Updated Successfully!");

      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
      <LoadingSpinner isLoading={loading} />
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      {data ? (
        <Box
          mt={3}
          sx={{
            height: "auto",
            width: "100%",
            margin: "40px 20px",
            padding: "20px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Travel Order Form
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Name:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data?.Employee.firstName} {data?.Employee.lastName}{" "}
              {data?.Employee.affix}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Designation:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data?.Employee.designation}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Department:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data?.Employee.department}
            </Typography>
          </Box>
          <hr />
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Destination:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data?.destination}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Purpose:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data?.purpose}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Departure:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data && (
                <>
                  {formatDate3(data?.departureDate)}
                  <br />
                  {formatTime2(data?.departureTime)}
                </>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
            <Typography sx={{ fontSize: "16px" }}>Arrival:</Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {data && (
                <>
                  {formatDate3(data?.arrivalDate)}
                  <br />
                  {formatTime2(data?.arrivalTime)}
                </>
              )}
            </Typography>
          </Box>
          {data?.out && (
            <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
              <Typography sx={{ fontSize: "16px" }}>Actual Out:</Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                {formatDate4(data.out)}
                <br />
                {formatTime3(data.out)}
              </Typography>
            </Box>
          )}
          {data?.in && (
            <Box sx={{ display: "grid", gridTemplateColumns: "35% 65%" }}>
              <Typography sx={{ fontSize: "16px" }}>Actual In:</Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                {formatDate4(data.in)}
                <br />
                {formatTime3(data.in)}
              </Typography>
            </Box>
          )}

          {/* Submit Button */}

          {(data?.in === null || data?.out === null) && (
            <Box mt={4} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
                disabled={loading} // Disable button while loading
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
          }}
        >
          <Typography variant="h4" color="textSecondary" gutterBottom>
            No Travel Order Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We couldn't find the Travel Order you're looking for.
          </Typography>
          <Button variant="contained" color="error" onClick={handleGoBack}>
            Go Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VerifyTravelOrder;
