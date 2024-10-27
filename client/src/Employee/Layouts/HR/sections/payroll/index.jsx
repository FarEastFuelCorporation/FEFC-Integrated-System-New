import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import { tokens } from "../../../../../theme";
import { formatNumber } from "../../../../../OtherComponents/Functions";

const Payroll = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    employeeId: "",
    designation: "",
    payrollType: "",
    salaryType: "",
    compensationType: "",
    salary: "",
    dayAllowance: "",
    nightAllowance: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [dataRecords, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeSalaryRecords, setEmployeeSalaryRecords] = useState([]);
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [workSchedule, setWorkScheduleRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  // basic 8 hours pay rate
  // from 6am to 10pm
  const ordinary = 1;
  const restDayDuty = 1.3;
  const specialHoliday = 1.3;
  const specialHolidayRestDayDuty = 1.5;
  const regularHoliday = 2;
  const regularHolidayRestDayDuty = 2.6;

  // basic 8 hours pay rate
  // from 10pm to 6am
  const ordinaryNight = 1.1;
  const restDayDutyNight = 1.43;
  const specialHolidayNight = 1.43;
  const specialHolidayRestDayDutyNight = 1.65;
  const regularHolidayNight = 2.2;
  const regularHolidayRestDayDutyNight = 2.86;

  // overtime pay rate
  // from 6am to 10pm
  const ordinaryOT = 1.25;
  const restDayDutyOT = 1.69;
  const specialHolidayOT = 1.69;
  const specialHolidayRestDayDutyOT = 1.95;
  const regularHolidayOT = 2.6;
  const regularHolidayRestDayDutyOT = 3.38;

  // overtime pay rate
  // from 10pm to 6am
  const ordinaryNightOT = 1.375;
  const restDayDutyNightOT = 1.859;
  const specialHolidayNightOT = 1.859;
  const specialHolidayRestDayDutyNightOT = 2.145;
  const regularHolidayNightOT = 2.86;
  const regularHolidayRestDayDutyNightOT = 3.718;

  function calculateHours(dayString, data, day) {
    // Check if dayString is valid
    if (!dayString || typeof dayString !== "string") {
      return null; // Return null if dayString is invalid
    }

    // Split the string to get multiple time intervals using the semicolon
    const timeIntervals = dayString.split(";");

    // Initialize total hours worked
    let totalHoursWorked = 0;
    let totalLateMinutes = 0; // Variable to store total late minutes

    // Initialize global variable for hourly rate
    let hourlyRate;

    // Check if workSchedule exists and is an array
    if (workSchedule && Array.isArray(workSchedule)) {
      // Find the schedule for the employee that matches data.employee_id
      const employeeSchedule = workSchedule.find(
        (schedule) => schedule.employeeId === data.employee_id
      );

      // If a matching employee record is found, calculate the total amount
      if (!employeeSchedule) {
        return null; // Return null if no matching record is found
      }

      // If a matching schedule is found, extract the day-specific attributes
      const dayIn = employeeSchedule[`${day}In`]; // e.g., "08:00:00"
      const dayOut = employeeSchedule[`${day}Out`]; // e.g., "17:00:00"

      // Check if dayIn and dayOut are valid
      if (!dayIn || !dayOut) {
        return null; // Return null if dayIn or dayOut is invalid
      }

      console.log(dayIn); // e.g., "08:00:00"
      console.log(dayOut); // e.g., "17:00:00"

      // Iterate through each time interval
      for (const interval of timeIntervals) {
        const trimmedInterval = interval.trim();
        const [startTime, endTime] = trimmedInterval.split(" - ");

        console.log(startTime); // e.g., "10/21/2024 7:41:17 AM"
        console.log(endTime); // e.g., "10/21/2024 5:00:37 PM"

        // Extract the time components without parsing dates
        const startParts = startTime.split(" ");
        const endParts = endTime.split(" ");
        const startOnlyTime = startParts[1] + " " + startParts[2]; // e.g., "7:41:17 AM"
        const endOnlyTime = endParts[1] + " " + endParts[2]; // e.g., "5:00:37 PM"

        console.log("Start Only Time:", startOnlyTime);
        console.log("End Only Time:", endOnlyTime);

        // Construct Date objects for the start and end of the workday
        const startOfWorkParts = dayIn.split(":");
        const endOfWorkParts = dayOut.split(":");

        const startOfWork = new Date(1970, 0, 1, ...startOfWorkParts); // Create Date object for dayIn
        const endOfWork = new Date(1970, 0, 1, ...endOfWorkParts); // Create Date object for dayOut

        // Create Date objects for the start and end of the interval
        let [hours, minutes, seconds] = startOnlyTime.split(/[:\s]/);
        const start = new Date(
          1970,
          0,
          1,
          (hours % 12) + (startParts[2] === "PM" ? 12 : 0),
          minutes,
          seconds
        );

        [hours, minutes, seconds] = endOnlyTime.split(/[:\s]/);
        let end = new Date(
          1970,
          0,
          1,
          (hours % 12) + (endParts[2] === "PM" ? 12 : 0),
          minutes,
          seconds
        );

        // Adjust for night shifts by checking if the end time is before the start time
        if (end < start) {
          end.setDate(end.getDate() + 1); // Add 1 day to the end time
        }

        console.log("Start:", start);
        console.log("End:", end);
        console.log("startOfWork:", startOfWork);
        console.log("endOfWork:", endOfWork);

        // Check if the work hours fall within the employee's scheduled hours
        if (end > startOfWork) {
          // Set effectiveStart to startOfWork since we only want to count hours from there
          const effectiveStart = startOfWork;

          // Calculate the difference in milliseconds
          const diffInMs = end - effectiveStart;

          // Ensure the difference is positive before calculating hours
          if (diffInMs > 0) {
            const hoursWorked = diffInMs / (1000 * 60 * 60); // Convert from milliseconds to hours

            // Add to the total hours worked
            totalHoursWorked += hoursWorked;

            // Calculate late minutes if the start time is after startOfWork
            if (start > startOfWork) {
              // Calculate late time in minutes
              const lateTimeMs = start - startOfWork; // Time late in milliseconds
              const lateMinutes = Math.floor(lateTimeMs / (1000 * 60)); // Convert to minutes
              totalLateMinutes += lateMinutes; // Accumulate late minutes
            }
          }
        }
      }
    }

    // Find the employee salary record that matches the employee_id
    let employeeRecord; // Declare employeeRecord
    if (employeeSalaryRecords && Array.isArray(employeeSalaryRecords)) {
      employeeRecord = employeeSalaryRecords.find(
        (record) => record.employeeId === data.employee_id
      );
    }

    // If a matching employee record is found, set hourlyRate
    if (employeeRecord) {
      hourlyRate = employeeRecord.salary / 8; // Calculate hourly rate here

      // Check if the dayString indicates "On Duty"
      if (dayString.includes("On Duty")) {
        return "On Duty"; // Return "On Duty" if found
      }

      // Initialize overtime to 0
      let overtime = 0;
      let regularHours = Math.min(totalHoursWorked, 8); // Cap regular hours at 8

      // Calculate regular and overtime pay
      const regularPay = (regularHours * hourlyRate).toFixed(2);
      const overtimePay = (overtime * (hourlyRate * 1.5)).toFixed(2); // Overtime pay at 1.5x rate

      const totalAmount = (
        parseFloat(regularPay) + parseFloat(overtimePay)
      ).toFixed(2); // Calculate total amount

      // Calculate late pay based on hourly rate per minute
      let latePay = 0; // Initialize latePay variable
      if (hourlyRate !== undefined) {
        latePay = (hourlyRate / 60) * totalLateMinutes; // Calculate late pay
        console.log(
          `Late Pay for ${totalLateMinutes} minutes: ${latePay.toFixed(2)}`
        );
      }

      // Return only the total amount less late pay
      const finalAmount = (totalAmount - latePay).toFixed(2);
      return finalAmount; // Return the final amount
    }

    // If no matching employee record is found, return null
    return null;
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Using Promise.all to fetch all data concurrently
      const [
        employeeSalaryResponse,
        attendanceResponse,
        employeeResponse,
        overtimeResponse,
        workScheduleResponse,
      ] = await Promise.all([
        axios.get(`${apiUrl}/api/employeeSalary`),
        axios.get(`${apiUrl}/api/attendanceRecord`),
        axios.get(`${apiUrl}/api/employee`),
        axios.get(`${apiUrl}/api/overtime/approved`),
        axios.get(`${apiUrl}/api/workSchedule`),
      ]);

      // Logging and setting employee salary records
      console.log(employeeSalaryResponse.data.employeeSalaries);
      setEmployeeSalaryRecords(employeeSalaryResponse.data.employeeSalaries);

      // Logging and setting attendance records
      console.log(attendanceResponse.data.data);
      setRecords(attendanceResponse.data.data);

      // Logging and setting employee data
      setEmployees(employeeResponse.data.employees);

      // Logging and setting overtime records
      console.log(overtimeResponse.data.overtimes);
      setOvertimeRecords(overtimeResponse.data.overtimes);

      // Logging and setting overtime records
      console.log(workScheduleResponse.data.workSchedules);
      setWorkScheduleRecords(workScheduleResponse.data.workSchedules);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Ensure loading is stopped on error as well
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    handleOpenModal();
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Employee Salary?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/employeeSalary/${id}`);

      fetchData();
      setSuccessMessage("Employee Salary Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateFormData = (formData) => {
    const {
      employeeId,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      nightAllowance,
    } = formData;

    const errors = []; // Initialize an array to collect error messages

    // Check for required fields and push error messages to the array
    if (!employeeId) {
      errors.push("Please select an employee.");
    }
    if (!payrollType) {
      errors.push("Please select a payroll type.");
    }
    if (!salaryType) {
      errors.push("Please select a salary type.");
    }
    if (!compensationType) {
      errors.push("Please select a compensation type.");
    }
    if (!salary) {
      errors.push("Salary is required.");
    }
    if (!dayAllowance) {
      errors.push("Day allowance is required.");
    }
    if (!nightAllowance) {
      errors.push("Night allowance is required.");
    }

    // Return concatenated error messages or null if no errors
    return errors.length > 0 ? errors.join(" ") : null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    // Validate the form data
    const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing employee salary
        await axios.put(
          `${apiUrl}/api/employeeSalary/${formData.id}`,
          formData
        );

        setSuccessMessage("Employee Salary Updated Successfully!");
      } else {
        // Add new employee salary
        await axios.post(`${apiUrl}/api/employeeSalary`, formData);

        setSuccessMessage("Employee Salary Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      width: 100,
      valueGetter: (params) => {
        return params.row.Monday
          ? calculateHours(params.row.Monday, params.row, "monday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Tuesday",
      headerName: "Tuesday",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.Tuesday
          ? calculateHours(params.row.Tuesday, params.row, "tuesday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Wednesday",
      headerName: "Wednesday",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.Wednesday
          ? calculateHours(params.row.Wednesday, params.row, "wednesday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Thursday",
      headerName: "Thursday",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.Thursday
          ? calculateHours(params.row.Thursday, params.row, "thursday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Friday",
      headerName: "Friday",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.Friday
          ? calculateHours(params.row.Friday, params.row, "friday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Saturday",
      headerName: "Saturday",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.Saturday
          ? calculateHours(params.row.Saturday, params.row, "saturday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Sunday",
      headerName: "Sunday",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (params) => {
        return params.row.Sunday
          ? calculateHours(params.row.Sunday, params.row, "sunday")
          : null;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
      ),
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
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Payroll" subtitle="List of Employee Payroll" />
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
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
      <CustomDataGridStyles>
        <DataGrid
          rows={dataRecords ? dataRecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Employee Salary" : "Add New Employee Salary"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <Autocomplete
              options={employees || []} // Subordinates array for autocomplete
              getOptionLabel={(option) =>
                `${option.lastName}, ${option.firstName} ${option.affix || ""}`
              } // Display full name
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Full Name"
                  name="employeeId"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              )}
              value={
                employees.find(
                  (option) => option.employeeId === formData.employeeId
                ) || null
              } // Set the value to the current employee
              onChange={(event, newValue) => {
                // Handle selection and set the employeeId as the value
                if (newValue) {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    employeeId: newValue.employeeId, // Set the employeeId
                    designation: newValue.designation, // Set the employeeId
                  }));
                }
              }}
              autoHighlight
            />
            <TextField
              label="Designation"
              name="designation"
              value={formData.designation || ""}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                readOnly: true,
              }}
              autoComplete="off"
            />
          </div>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <FormControl fullWidth required>
              <InputLabel
                id="payrollType-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Payroll Type
              </InputLabel>
              <Select
                labelId="payrollType-label"
                name="payrollType"
                value={formData.payrollType}
                onChange={handleInputChange}
                label="Payroll Type"
              >
                <MenuItem value="SEMI-MONTHLY" sx={{ height: 50 }}>
                  SEMI-MONTHLY
                </MenuItem>
                <MenuItem value="WEEKLY" sx={{ height: 50 }}>
                  WEEKLY
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel
                id="salaryType-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Salary Type
              </InputLabel>
              <Select
                labelId="salaryType-label"
                name="salaryType"
                value={formData.salaryType}
                onChange={handleInputChange}
                label="Salary Type"
              >
                <MenuItem value="CASH" sx={{ height: 50 }}>
                  CASH
                </MenuItem>
                <MenuItem value="ATM" sx={{ height: 50 }}>
                  ATM
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel
                id="compensationType-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Compensation Type
              </InputLabel>
              <Select
                labelId="compensationType-label"
                name="compensationType"
                value={formData.compensationType}
                onChange={handleInputChange}
                label="Compensation Type"
              >
                <MenuItem value="FIXED" sx={{ height: 50 }}>
                  FIXED
                </MenuItem>
                <MenuItem value="TIME BASED" sx={{ height: 50 }}>
                  TIME BASED
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Salary"
              name="salary"
              value={formData.salary || ""}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="Day Allowance"
              name="dayAllowance"
              value={formData.dayAllowance || ""}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="Night Allowance"
              name="nightAllowance"
              value={formData.nightAllowance || ""}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </div>

          <TextField
            label="Created By"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            fullWidth
            autoComplete="off"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Payroll;
