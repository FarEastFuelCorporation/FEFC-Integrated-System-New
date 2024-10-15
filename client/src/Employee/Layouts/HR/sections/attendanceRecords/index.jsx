import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const AttendanceRecords = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [datarecords, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/attendanceRecord`);

      setRecords(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

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
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Attendance Records"
          subtitle="List of Attendance Records"
        />
      </Box>

      <CustomDataGridStyles>
        <DataGrid
          rows={datarecords ? datarecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default AttendanceRecords;
