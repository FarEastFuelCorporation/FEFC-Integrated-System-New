import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const OvertimeRequest = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dataRecords, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/overtime`);

      setRecords(response.data.overtimes);
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
      field: "employeeId",
      headerName: "Employee ID",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      valueGetter: (params) => {
        return params.row.employeeId;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        return `${params.row.Employee.lastName}, ${params.row.Employee.firstName} ${params.row.Employee.affix}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        return params.row.Employee.designation;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "start",
      headerName: "Start",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.dateStart) return "";
        if (!params.row.timeStart) return "";

        // Format departure date
        const date = new Date(params.row.dateStart);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeStart.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = timeFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24:30 PM"

        return `${dateFormat} ${timeString}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "end",
      headerName: "End",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.dateStart) return "";
        if (!params.row.timeEnd) return "";

        // Format departure date
        const date = new Date(params.row.dateStart);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeEnd.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = timeFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24:30 PM"

        return `${dateFormat} ${timeString}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "isApproved",
      headerName: "Approval",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "approvedBy",
      headerName: "Approved By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        if (params.row.EmployeeApprovedBy) {
          return `${params.row.EmployeeApprovedBy.lastName}, ${params.row.EmployeeApprovedBy.firstName} ${params.row.EmployeeApprovedBy.affix}`;
        }
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Overtime Requests"
          subtitle="List of Overtime Requests"
        />
      </Box>

      <CustomDataGridStyles>
        <DataGrid
          rows={dataRecords ? dataRecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default OvertimeRequest;
