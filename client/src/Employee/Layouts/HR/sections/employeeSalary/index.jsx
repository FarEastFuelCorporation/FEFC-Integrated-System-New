import React, { useState, useEffect, useCallback } from "react";
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

const EmployeeSalary = ({ user }) => {
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
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/employeeSalary`);

      setRecords(response.data.employeeSalaries);

      const employeeResponse = await axios.get(`${apiUrl}/api/employee`);

      setEmployees(employeeResponse.data.employees);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    const typeToEdit = dataRecords.find((type) => type.id === id);
    if (typeToEdit) {
      const employee = employees.find(
        (emp) => emp.employeeId === typeToEdit.employeeId
      ); // Find the employee details

      setFormData({
        id: typeToEdit.id,
        employeeId: typeToEdit.employeeId,
        designation: employee ? employee.designation : "",
        payrollType: typeToEdit.payrollType,
        salaryType: typeToEdit.salaryType,
        compensationType: typeToEdit.compensationType,
        salary: typeToEdit.salary,
        dayAllowance: typeToEdit.dayAllowance,
        nightAllowance: typeToEdit.nightAllowance,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Employee Salary with ID ${id} not found for editing.`);
    }
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
      field: "payrollType",
      headerName: "Payroll Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "salaryType",
      headerName: "Salary Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "compensationType",
      headerName: "Compensation Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "salary",
      headerName: "Salary",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let value = {};
        value.value = formatNumber(params.row.salary) || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "dayAllowance",
      headerName: "Day Allowance",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let value = {};
        value.value = formatNumber(params.row.dayAllowance) || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "nightAllowance",
      headerName: "Night Allowance",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let value = {};
        value.value = formatNumber(params.row.nightAllowance) || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) =>
        !params.row.isApproved && (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon />
          </IconButton>
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) =>
        !params.row.isApproved && (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Employee Salary" subtitle="List of Employee Salaries" />
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

export default EmployeeSalary;
