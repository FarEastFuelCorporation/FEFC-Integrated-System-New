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
      minWidth: 100,
      renderCell: (params) => {
        let value = {};
        value.value = `${params.row.IdInformationCreatedBy.last_name}, ${params.row.IdInformationCreatedBy.first_name} ${params.row.IdInformationCreatedBy.affix}`;

        return renderCellWithWrapText(value);
      },
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

export default WorkSchedule;
