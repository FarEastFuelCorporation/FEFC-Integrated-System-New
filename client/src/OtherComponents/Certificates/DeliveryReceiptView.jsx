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
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

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
      console.log(response.data.deliveryReceipt);
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
    <Box sx={{ marginTop: "60px", padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Truck Scale Details
      </Typography>
      <Paper elevation={3} sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Truck Scale #</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.truckScaleNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Transaction Type</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.transactionType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Client</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.clientName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Commodity</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.commodity}</TableCell>
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
                <strong>1st Weigh</strong>
              </TableCell>
              <TableCell>
                {formatDate(deliveryReceiptData.firstScaleDate)}{" "}
                {formatTime(deliveryReceiptData.firstScaleTime)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>1st Weigher</strong>
              </TableCell>
              <TableCell>
                {deliveryReceiptData.Employee2?.firstName}{" "}
                {deliveryReceiptData.Employee2?.lastName}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>2nd Weigh</strong>
              </TableCell>
              <TableCell>
                {formatDate(deliveryReceiptData.secondScaleDate)}{" "}
                {formatTime(deliveryReceiptData.secondScaleTime)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>2nd Weigher</strong>
              </TableCell>
              <TableCell>
                {deliveryReceiptData.Employee2?.firstName}{" "}
                {deliveryReceiptData.Employee2?.lastName}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Gross Weight</strong>
              </TableCell>
              <TableCell>
                {formatNumber(deliveryReceiptData.grossWeight)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tare Weight</strong>
              </TableCell>
              <TableCell>
                {formatNumber(deliveryReceiptData.tareWeight)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Net Weight</strong>
              </TableCell>
              <TableCell>
                {formatNumber(deliveryReceiptData.netWeight)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Remarks</strong>
              </TableCell>
              <TableCell>{deliveryReceiptData.remarks}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DeliveryReceiptView;
