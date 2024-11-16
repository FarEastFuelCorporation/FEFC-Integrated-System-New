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
    <div className={"wrap-text"}>{params.value}</div>
  );

  const columns = [
    {
      field: "employeeId",
      headerName: "Employee ID",
      headerAlign: "center",
      align: "center",
      flex: 1,
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
        let fullName;

        if (params.row.IdInformation) {
          fullName = `${params.row.IdInformation.last_name}, ${params.row.IdInformation.first_name} ${params.row.IdInformation.affix}`;
        }

        let value = {};
        value.value = fullName || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let value = {};
        value.value = params.row.IdInformation.designation || "";

        return renderCellWithWrapText(value);
      },
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
      width: 120,
      renderCell: (params) => {
        let monday;

        const { mondayIn, mondayOut } = params.row;
        monday = formatTimeRange(mondayIn, mondayOut);

        let value = {};
        value.value = monday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "tuesdaySchedule",
      headerName: "Tuesday Schedule",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let tuesday;

        const { tuesdayIn, tuesdayOut } = params.row;
        tuesday = formatTimeRange(tuesdayIn, tuesdayOut);

        let value = {};
        value.value = tuesday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "wednesdaySchedule",
      headerName: "Wednesday Schedule",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let wednesday;

        const { wednesdayIn, wednesdayOut } = params.row;
        wednesday = formatTimeRange(wednesdayIn, wednesdayOut);

        let value = {};
        value.value = wednesday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "thursdaySchedule",
      headerName: "Thursday Schedule",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let thursday;

        const { thursdayIn, thursdayOut } = params.row;
        thursday = formatTimeRange(thursdayIn, thursdayOut);

        let value = {};
        value.value = thursday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "fridaySchedule",
      headerName: "Friday Schedule",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let friday;

        const { fridayIn, fridayOut } = params.row;
        friday = formatTimeRange(fridayIn, fridayOut);

        let value = {};
        value.value = friday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "saturdaySchedule",
      headerName: "Saturday Schedule",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let saturday;

        const { saturdayIn, saturdayOut } = params.row;
        saturday = formatTimeRange(saturdayIn, saturdayOut);

        let value = {};
        value.value = saturday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "sundaySchedule",
      headerName: "Sunday Schedule",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let sunday;

        const { sundayIn, sundayOut } = params.row;
        sunday = formatTimeRange(sundayIn, sundayOut);

        let value = {};
        value.value = sunday || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        let value = {};
        value.value = params.row.remarks
          ? params.row.remarks
          : "NO REMARKS" || "";

        return renderCellWithWrapText(value);
      },
      headerClassName: "wrap-header-text",
    },
    {
      field: "submittedBy",
      headerName: "Scheduled By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let value = {};
        value.value = `${params.row.IdInformationCreatedBy.last_name}, ${params.row.IdInformationCreatedBy.first_name} ${params.row.IdInformationCreatedBy.affix}`;

        return renderCellWithWrapText(value);
      },
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
