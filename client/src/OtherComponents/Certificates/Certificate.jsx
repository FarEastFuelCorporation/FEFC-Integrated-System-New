import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import CertificateOfDestruction from "./CertificateOfDestruction";

const Certificate = () => {
  const [loading, setLoading] = useState(true); // State to indicate loading
  const apiUrl = process.env.REACT_APP_API_URL;
  const [quotationData, setQuotationData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); // Navigate back to the previous page
  };

  const fetchData = async () => {
    try {
      const certificateResponse = await axios.get(
        `${apiUrl}/api/certificate/${id}`
      );

      setQuotationData(
        certificateResponse.data.certifiedTransaction.BookedTransaction
      );

      // Set a timeout of 5 seconds before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 5000); // 5000 ms = 5 seconds
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl, id]);

  return (
    <Box sx={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
      {loading && <LoadingSpinner />}
      {quotationData ? (
        <CertificateOfDestruction row={quotationData} verify={true} />
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
            No Certificate Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We couldn't find the certificate you're looking for.
          </Typography>
          <Button variant="contained" color="error" onClick={handleGoBack}>
            Go Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Certificate;
