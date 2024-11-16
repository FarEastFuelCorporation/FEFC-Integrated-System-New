import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import {
  formatDate3,
  formatTime4,
} from "../../../../../OtherComponents/Functions";

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
      renderCell: (params) => {
        let value = {};
        value.value = params.row.employeeId || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        let value = {};
        value.value =
          `${params.row.Employee.lastName}, ${params.row.Employee.firstName} ${params.row.Employee.affix}` ||
          "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        let value = {};
        value.value = params.row.Employee.designation || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "start",
      headerName: "Start",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let start;

        if (!params.row.dateStart) return (start = "");
        if (!params.row.timeStart) return (start = "");

        // Format departure date
        const date = new Date(params.row.dateStart);
        const dateFormat = formatDate3(date);

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeStart.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = formatTime4(timeFormat);

        start = `${dateFormat} ${timeString}`;

        let value = {};
        value.value = start || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "end",
      headerName: "End",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let end;

        if (!params.row.dateEnd) return (end = "");
        if (!params.row.timeEnd) return (end = "");

        // Format departure date
        const date = new Date(params.row.dateEnd);
        const dateFormat = formatDate3(date);

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeEnd.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = formatTime4(timeFormat);

        end = `${dateFormat} ${timeString}`;

        let value = {};
        value.value = end || "";

        return renderCellWithWrapText(value);
      },
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
      renderCell: (params) => {
        let approval;

        if (!params.row.isApproved) {
          approval = "FOR APPROVAL";
        } else {
          approval = params.row.isApproved;
        }

        let value = {};
        value.value = approval || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "approvedBy",
      headerName: "Approved By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        let approvedBy;

        if (params.row.EmployeeApprovedBy) {
          approvedBy = `${params.row.EmployeeApprovedBy.lastName}, ${params.row.EmployeeApprovedBy.firstName} ${params.row.EmployeeApprovedBy.affix}`;
        }

        let value = {};
        value.value = approvedBy || "";

        return renderCellWithWrapText(value);
      },
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
