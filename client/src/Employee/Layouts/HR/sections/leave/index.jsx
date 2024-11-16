import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Tab, Tabs, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import { tokens } from "../../../../../theme";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import { formatDate3 } from "../../../../../OtherComponents/Functions";

const Leave = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);

  const [dataRecords, setRecords] = useState([]);
  const [dataRecords2, setRecords2] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/leave`);

      setRecords(response.data.leaves);

      const leaves = response.data.leaves;

      // Create a summary object to hold the totals for each employee by typeOfLeave
      const employeeLeaveSummary = leaves.reduce((summary, leave) => {
        const { employeeId, typeOfLeave, duration, Employee } = leave;

        // Ensure the employee entry exists in the summary
        if (!summary[employeeId]) {
          summary[employeeId] = {
            Employee: Employee,
            employeeId: employeeId,
            totalSickLeave: 0,
            totalVacationLeave: 0,
            totalEmergencyLeave: 0,
          };
        }

        // Add the leave duration based on the type of leave
        if (typeOfLeave === "SICK LEAVE") {
          summary[employeeId].totalSickLeave += duration || 0;
        } else if (typeOfLeave === "VACATION LEAVE") {
          summary[employeeId].totalVacationLeave += duration || 0;
        } else if (typeOfLeave === "EMERGENCY LEAVE") {
          summary[employeeId].totalEmergencyLeave += duration || 0;
        }

        return summary;
      }, {});

      // Convert the summary object into an array
      const leaveSummaryArray = Object.values(employeeLeaveSummary);

      setRecords2(leaveSummaryArray); // Assuming you're storing this in the `records` state

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprovedClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Approve this Leave?");
    setDialogAction(() => () => handleConfirmApproved(id));
  };

  const handleConfirmApproved = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/api/leave/subordinateApproved2/${id}`);

      fetchData();
      setSuccessMessage("Leave Approved Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };
  const handleDisapprovedClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Disapprove this Leave?");
    setDialogAction(() => () => handleConfirmDisapproved(id));
  };

  const handleConfirmDisapproved = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/api/leave/subordinateDisapproved2/${id}`);

      fetchData();
      setSuccessMessage("Leave Approved Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

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
      width: 100,
      renderCell: renderCellWithWrapText,
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
      field: "typeOfLeave",
      headerName: "Type OF Leave",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "reason",
      headerName: "Type OF Leave",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        if (!params.row.startDate) return "";

        // Format startDate
        const date = new Date(params.row.startDate);
        const dateFormat = formatDate3(date);

        let value = {};
        value.value = dateFormat || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        if (!params.row.endDate) return "";

        // Format endDate
        const date = new Date(params.row.endDate);
        const dateFormat = formatDate3(date);

        let value = {};
        value.value = dateFormat || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      headerAlign: "center",
      align: "center",
      width: 100,
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
      field: "isNoted",
      headerName: "Noted",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        let isNoted = params.row.isNoted;

        // If isNoted is falsy and isApproved is truthy, show the buttons
        const buttonGroup = !isNoted && params.row.isApproved && (
          <>
            <IconButton
              color="success"
              onClick={() => handleApprovedClick(params.row.id)}
            >
              <i className="fa-solid fa-thumbs-up"></i>
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDisapprovedClick(params.row.id)}
            >
              <i className="fa-solid fa-thumbs-down"></i>
            </IconButton>
          </>
        );

        let value = {};
        value.value =
          (
            <div>
              {isNoted && <span>{isNoted}</span>}
              {buttonGroup}
            </div>
          ) || "";

        return renderCellWithWrapText(value);
      },
    },
  ];

  const columns2 = [
    {
      field: "employeeId",
      headerName: "Employee ID",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
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
      field: "totalVacationLeave",
      headerName: "Vacation Leave",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalSickLeave",
      headerName: "Sick Leave",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalEmergencyLeave",
      headerName: "Emergency Leave",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "total",
      headerName: "Total Leave",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let value = {};
        value.value =
          params.row.totalVacationLeave +
            params.row.totalSickLeave +
            params.row.totalEmergencyLeave || 0;

        return renderCellWithWrapText(value);
      },
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Leave Records" subtitle="List of Leaves" />
      </Box>
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      />
      <CustomDataGridStyles height={"65vh"}>
        <hr />
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          sx={{
            "& .Mui-selected": {
              backgroundColor: colors.greenAccent[400],
              boxShadow: "none",
              borderBottom: `1px solid ${colors.grey[100]}`,
            },
            "& .MuiTab-root > span": {
              paddingRight: "10px",
            },
          }}
        >
          <Tab label={"History"} />
          <Tab label={"Summary"} />
        </Tabs>
        <hr />
        {selectedTab === 0 && (
          <DataGrid
            rows={dataRecords ? dataRecords : []}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
          />
        )}
        {selectedTab === 1 && (
          <DataGrid
            rows={dataRecords2 ? dataRecords2 : []}
            columns={columns2}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.employeeId}
          />
        )}
      </CustomDataGridStyles>
    </Box>
  );
};

export default Leave;
