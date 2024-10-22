import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";

const Attendance = ({ user }) => {
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
      const response = await axios.get(
        `${apiUrl}/api/attendanceRecord/${user.id}`
      );

      setRecords(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "formattedDate", // Custom field for date
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedTime", // Custom field for time
      headerName: "Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24 PM"
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
  ];

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
        <Typography
          sx={{ fontSize: 20, display: "flex", alignItems: "center" }}
        >
          Attendance
        </Typography>
      </Box>
      <hr />
      <CustomDataGridStyles height={"auto"}>
        <DataGrid
          rows={dataRecords ? dataRecords : []}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default Attendance;
