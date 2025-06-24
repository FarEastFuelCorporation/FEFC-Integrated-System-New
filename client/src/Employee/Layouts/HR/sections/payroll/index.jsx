import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import SectionModal from "./SectionModal";
import { PayrollValidation } from "./Validation";

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
    deductions: [],
    adjustments: [],
    createdBy: user.id,
  };

  const formDeductionRef = useRef({
    deductions: [
      {
        otherDeduction: "",
      },
    ],
    adjustments: [
      {
        adjustment: "",
      },
    ],
  });

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [employees, setEmployees] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Using Promise.all to fetch all data concurrently
      const [employeeResponse, payrollResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/employeeRecord/salary`),
        axios.get(`${apiUrl}/api/payroll`),
      ]);

      // Logging and setting employee data
      console.log(employeeResponse.data.employeeRecords);
      setEmployees(employeeResponse.data.employeeRecords);

      // Logging and setting payrolls
      console.log(payrollResponse.data.payrolls);
      setPayrollRecords(payrollResponse.data.payrolls);

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
    setErrorMessage("");
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleEditClick = (row) => {
    setFormData({
      ...row,
      adjustments: row.PayrollAdjustment,
      deductions: row.PayrollDeduction,
    });
    handleOpenModal();
  };

  console.log(formData);

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Payroll?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/payroll/${id}`);
      // Filter out the deleted record
      setPayrollRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );

      setSuccessMessage("Payroll Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const validationErrors = PayrollValidation(formData);
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);

      if (formData.id) {
        // 🔁 Update existing record
        const res = await axios.put(
          `${apiUrl}/api/payroll/${formData.id}`,
          formData
        );

        setPayrollRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === formData.id ? res.data.updatedPayroll : record
          )
        );

        setSuccessMessage("Payroll Updated Successfully!");
      } else {
        // ➕ Create new record
        const res = await axios.post(`${apiUrl}/api/payroll`, formData);

        setPayrollRecords((prevRecords) => [
          ...prevRecords,
          res.data.newPayroll,
        ]);

        setSuccessMessage("Payroll Added Successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong.");
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
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
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return `${params.row.EmployeeRecord?.firstName} ${
          params.row.EmployeeRecord?.husbandSurname ||
          params.row.EmployeeRecord?.lastName
        }${params.row.EmployeeRecord?.affix || ""}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (params) => {
        return params.row.EmployeeRecord?.designation;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "compensationType",
      headerName: "Compensation Type",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "salaryType",
      headerName: "Salary Type",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "payrollType",
      headerName: "Payroll Type",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "weekNumber",
      headerName: "Week/Cut-Off",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        return params.row.payrollType === "SEMI-MONTHLY"
          ? params.row.cutOff
          : params.row.weekNumber;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalGrossAmount",
      headerName: "Gross Salary",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        return formatNumber(params.row.totalGrossAmount);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalDeductionAmount",
      headerName: "Deduction",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        return formatNumber(params.row.totalDeductionAmount);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "totalAdjustmentAmount",
      headerName: "Adjustment",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        return formatNumber(params.row.totalAdjustmentAmount);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "netAmount",
      headerName: "Net Salary",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        return formatNumber(params.row.netAmount);
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
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
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
          rows={payrollRecords ? payrollRecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>

      <SectionModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleFormSubmit={handleFormSubmit}
        formRef={formDeductionRef}
        formData={formData}
        setFormData={setFormData}
        showErrorMessage={showErrorMessage}
        errorMessage={errorMessage}
        colors={colors}
        employees={employees}
      />
    </Box>
  );
};

export default Payroll;
