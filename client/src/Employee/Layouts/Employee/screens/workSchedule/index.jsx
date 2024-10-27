import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import { formatTimeRange } from "../../../../../OtherComponents/Functions";

const WorkSchedule = ({ user }) => {
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

      const workScheduleResponse = await axios.get(
        `${apiUrl}/api/workSchedule/${user.id}`
      );

      setRecords(workScheduleResponse.data.workSchedules);

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
      width: 120,
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
      width: 120,
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
      width: 120,
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
      width: 120,
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
      width: 120,
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
      width: 120,
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
      headerClassName: "wrap-header-text",
    },
    {
      field: "submittedBy",
      headerName: "Scheduled By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return `${params.row.EmployeeCreatedBy.lastName}, ${params.row.EmployeeCreatedBy.firstName} ${params.row.EmployeeCreatedBy.affix}`;
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            Work Schedule
          </Typography>
        </Box>
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

export default WorkSchedule;
