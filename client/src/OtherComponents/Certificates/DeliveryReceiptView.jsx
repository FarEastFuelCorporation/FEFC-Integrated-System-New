import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate3 } from "../Functions";

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : "";
const formatTime = (timeStr) =>
  timeStr ? new Date(`1970-01-01T${timeStr}`).toLocaleTimeString() : "";
const formatNumber = (num) =>
  num ? parseFloat(num).toLocaleString() + " kg" : "0 kg";

const DeliveryReceiptView = () => {
  const [loading, setLoading] = useState(true);
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const [deliveryReceiptData, setDeliveryReceiptData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login");
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/deliveryReceiptView/${id}`
      );
      setDeliveryReceiptData(response.data.deliveryReceipt);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [apiUrl, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner isLoading />;
  }

  if (!deliveryReceiptData) {
    return (
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
          No Delivery Receipt Found
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          We couldn't find the delivery receipt data you're looking for.
        </Typography>
        <Button variant="contained" color="error" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 10, p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Delivery Receipt Details
      </Typography>

      <Paper elevation={3} sx={{ maxWidth: 800, mx: "auto", p: 3, mb: 4 }}>
        {/* Main Delivery Info Table */}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Delivery Receipt #</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.deliveryReceiptNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Delivery Date</strong>
              </TableCell>
              <TableCell>
                {formatDate3(deliveryReceiptData.dateOfDelivery)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Company</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Address</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Plate Number</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.plateNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Driver</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.driver}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Remarks</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.remarks}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Section Title */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
          Items Delivered
        </Typography>

        {/* Items Delivered Table (Scrollable, but contained in Paper) */}
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 300, whiteSpace: "nowrap" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Unit</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryReceiptData.DeliveryReceiptItem?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {item.quantity ? formatNumber(item.quantity) : ""}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeliveryReceiptView;
