import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import {
  formatDate3,
  formatTime4,
} from "../../../../../OtherComponents/Functions";

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
      field: "formattedDate",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let value = {};
        value.value = formatDate3(params.row.createdAt) || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "formattedTime",
      headerName: "Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let value = {};
        value.value = formatTime4(params.row.createdAt) || "";

        return renderCellWithWrapText(value);
      },
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
      <CustomDataGridStyles>
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
