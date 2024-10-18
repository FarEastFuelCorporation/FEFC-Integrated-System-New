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
        `${apiUrl}/api/attendanceRecord/subordinates/${user.id}`
      );

      console.log(response.data.results);
      console.log(response.data.attendanceMap);
      console.log(response.data.data);
      setRecords(response.data.data);
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
      field: "employee_id",
      headerName: "Employee ID",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "weekNumber",
      headerName: "Week Number",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Monday",
      headerName: "Monday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Tuesday",
      headerName: "Tuesday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Wednesday",
      headerName: "Wednesday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Thursday",
      headerName: "Thursday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Friday",
      headerName: "Friday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Saturday",
      headerName: "Saturday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Sunday",
      headerName: "Sunday",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    // {
    //   field: "daysOfWork",
    //   headerName: "# of Days Worked",
    //   headerAlign: "center",
    //   align: "center",
    //   width: 125,
    //   renderCell: renderCellWithWrapText,
    // },
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
        <Typography sx={{ fontSize: 20 }}>Attendance</Typography>
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
