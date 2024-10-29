import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import { formatTimeRange } from "../../../../../OtherComponents/Functions";

const WorkSchedule = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dataRecords, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/workSchedule`);

      setRecords(response.data.workSchedules);
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
      flex: 1,
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
        if (params.row.IdInformation) {
          return `${params.row.IdInformation.last_name}, ${params.row.IdInformation.first_name} ${params.row.IdInformation.affix}`;
        }
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
        return params.row.IdInformation.designation;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "typeOfSchedule",
      headerName: "Type Of Schedule",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "weekNumber",
      headerName: "Week Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mondaySchedule",
      headerName: "Monday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { mondayIn, mondayOut } = params.row;
        return formatTimeRange(mondayIn, mondayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "tuesdaySchedule",
      headerName: "Tuesday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { tuesdayIn, tuesdayOut } = params.row;
        return formatTimeRange(tuesdayIn, tuesdayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "wednesdaySchedule",
      headerName: "Wednesday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { wednesdayIn, wednesdayOut } = params.row;
        return formatTimeRange(wednesdayIn, wednesdayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "thursdaySchedule",
      headerName: "Thursday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { thursdayIn, thursdayOut } = params.row;
        return formatTimeRange(thursdayIn, thursdayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fridaySchedule",
      headerName: "Friday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { fridayIn, fridayOut } = params.row;
        return formatTimeRange(fridayIn, fridayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "saturdaySchedule",
      headerName: "Saturday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { saturdayIn, saturdayOut } = params.row;
        return formatTimeRange(saturdayIn, saturdayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "sundaySchedule",
      headerName: "Sunday Schedule",
      headerAlign: "center",
      align: "center",
      width: 80,
      valueGetter: (params) => {
        const { sundayIn, sundayOut } = params.row;
        return formatTimeRange(sundayIn, sundayOut);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.remarks ? params.row.remarks : "NO REMARKS";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "submittedBy",
      headerName: "Scheduled By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return `${params.row.IdInformationCreatedBy.last_name}, ${params.row.IdInformationCreatedBy.first_name} ${params.row.IdInformationCreatedBy.affix}`;
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Work Schedules" subtitle="List of Work Schedules" />
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

export default WorkSchedule;
