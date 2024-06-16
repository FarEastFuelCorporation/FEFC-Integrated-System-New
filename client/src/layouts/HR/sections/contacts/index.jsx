import { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import { tokens } from "../../../../theme";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "employeeId", headerName: "Employee ID" },
    { field: "firstName", headerName: "First Name" },
    { field: "middleName", headerName: "Middle Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "gender", headerName: "Gender" },
    { field: "civilStatus", headerName: "Civil Status" },
    { field: "birthDate", headerName: "Birth Date" },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      valueGetter: (params) => {
        const mobileNoObject = params.row["mobileNo"];
        return mobileNoObject ? mobileNoObject[""] || "" : "";
      },
    },
    { field: "permanentAddress", headerName: "Permanent Address" },
    {
      field: "tinNo",
      headerName: "TIN No",
      valueGetter: (params) => {
        const tinNoObject = params.row["tinNo"];
        return tinNoObject ? tinNoObject[""] || "" : "";
      },
    },
    {
      field: "sssGsisNo",
      headerName: "SSS/GSIS No",
      valueGetter: (params) => {
        const sssGsisNoObject = params.row["sssGsisNo"];
        return sssGsisNoObject ? sssGsisNoObject[""] || "" : "";
      },
    },
    {
      field: "philhealthNo",
      headerName: "Philhealth No",
      valueGetter: (params) => {
        const philhealthNoObject = params.row["philhealthNo"];
        return philhealthNoObject ? philhealthNoObject[""] || "" : "";
      },
    },
    {
      field: "pagIbigNo",
      headerName: "Pag-ibig No",
      valueGetter: (params) => {
        const pagIbigNoObject = params.row["pagIbigNo"];
        return pagIbigNoObject ? pagIbigNoObject[""] || "" : "";
      },
    },
    { field: "dateHire", headerName: "Date Hire" },
    { field: "employeeType", headerName: "Employee Type" },
    { field: "payrollType", headerName: "Payroll Type" },
    { field: "salaryType", headerName: "Salary Type" },
    { field: "employeeStatus", headerName: "Employee Status" },
    { field: "department", headerName: "Department" },
    { field: "designation", headerName: "Designation" },
    { field: "dailyRate", headerName: "Daily Rate", type: "number" },
    {
      field: "dayAllowance",
      headerName: "Day Allowance",
      type: "number",
    },
    {
      field: "nightAllowance",
      headerName: "Night Allowance",
      type: "number",
    },
    { field: "submittedBy", headerName: "Submitted By" },
  ];

  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/hrDashboard/employee"
        );
        const employeeRecords = await response.json();
        const data = await employeeRecords.employeeRecords;
        const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index + 1,
        }));
        const rowsPadded = rowsWithId.map((row) => ({
          ...row,
          employeeId: row["employeeId"].toString().padStart(5, "0"),
        }));
        setEmployeeData(rowsPadded);
      } catch (error) {
        console.error("Error fetching employeeData:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p="20px" width="100% !important">
      <Header
        title="Employee Records"
        subtitle="List of Employee for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        width="100% !important"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            width: "100%",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={employeeData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
