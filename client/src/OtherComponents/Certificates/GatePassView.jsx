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
import { formatDate3, formatTime2 } from "../Functions";

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : "";
const formatTime = (timeStr) =>
  timeStr ? new Date(`1970-01-01T${timeStr}`).toLocaleTimeString() : "";
const formatNumber = (num) =>
  num ? parseFloat(num).toLocaleString() + " kg" : "0 kg";

const GatePassView = () => {
  const [loading, setLoading] = useState(true);
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const [gatePassData, setGatePassData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login");
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/gatePassView/${id}`);
      setGatePassData(response.data.gatePass);
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

  if (!gatePassData) {
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
          No Gate Pass Found
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          We couldn't find the gate Pass data you're looking for.
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
        Gate Pass Details
      </Typography>

      <Paper elevation={3} sx={{ maxWidth: 800, mx: "auto", p: 3, mb: 4 }}>
        {/* Main Delivery Info Table */}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Gate Pass #</strong>
              </TableCell>
              <TableCell>{gatePassData.gatePassNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Date IN</strong>
              </TableCell>
              <TableCell>{formatDate3(gatePassData.dateIn)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Time IN</strong>
              </TableCell>
              <TableCell>{formatTime2(gatePassData.timeIn)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Date OUT</strong>
              </TableCell>
              <TableCell>{formatDate3(gatePassData.dateOut)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Time OUT</strong>
              </TableCell>
              <TableCell>{formatTime2(gatePassData.timeOut)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Issued To</strong>
              </TableCell>
              <TableCell>{gatePassData.issuedTo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Company</strong>
              </TableCell>
              <TableCell>{gatePassData.company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Address</strong>
              </TableCell>
              <TableCell>{gatePassData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Vehicle</strong>
              </TableCell>
              <TableCell>{gatePassData.vehicle}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Plate Number</strong>
              </TableCell>
              <TableCell>{gatePassData.plateNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>{gatePassData.category}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Category 2</strong>
              </TableCell>
              <TableCell>{gatePassData.truckScaleNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Plate Number</strong>
              </TableCell>
              <TableCell>{gatePassData.plateNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Remarks</strong>
              </TableCell>
              <TableCell>{gatePassData.remarks}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Section Title */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
          Items
        </Typography>

        {/* Items  Table (Scrollable, but contained in Paper) */}
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
              {gatePassData.GatePassItem?.map((item, index) => (
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

export default GatePassView;
