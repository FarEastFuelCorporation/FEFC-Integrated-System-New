import { useState, useEffect } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Header from "../Header";
import axios from "axios";
import { tokens } from "../../../../../theme";
import EmployeeRecordModal from "../../../../../OtherComponents/Modals/EmployeeRecordModal";

const Contacts = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    employeeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    husbandSurname: "",
    gender: "",
    civilStatus: "",
    birthday: "",
    birthPlace: "",
    bloodType: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [employeeData, setEmployeeData] = useState([]);
  const [gender, setGender] = useState(formData.gender || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/hrDashboard/employee`);
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
  }, [apiUrl]);

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
    console.log(e);
    console.log(name);
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { treatmentProcessId, machineName } = formData;
    if (!treatmentProcessId || !machineName) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    // try {
    //   let response;

    //   if (formData.id) {
    //     // Update existing treatment machine
    //     response = await axios.put(
    //       `${apiUrl}/treatmentMachine/${formData.id}`,
    //       formData
    //     );

    //     if (response && Array.isArray(response.data.treatmentMachines)) {
    //       const flattenedData = response.data.treatmentMachines.map(
    //         (machine) => ({
    //           ...machine,
    //           treatmentProcess: machine.TreatmentProcess
    //             ? machine.TreatmentProcess.treatmentProcess
    //             : null,
    //         })
    //       );

    //       setTreatmentMachines(flattenedData);
    //       setSuccessMessage("Treatment Machine Updated Successfully!");
    //     } else {
    //       console.error(
    //         "treatmentMachineResponse is undefined or not an array"
    //       );
    //     }
    //   } else {
    //     // Add new treatment machine
    //     response = await axios.post(`${apiUrl}/treatmentMachine`, formData);

    //     if (response && Array.isArray(response.data.treatmentMachines)) {
    //       const flattenedData = response.data.treatmentMachines.map(
    //         (machine) => ({
    //           ...machine,
    //           treatmentProcess: machine.TreatmentProcess
    //             ? machine.TreatmentProcess.treatmentProcess
    //             : null,
    //         })
    //       );

    //       setTreatmentMachines(flattenedData);
    //       setSuccessMessage("Treatment Machine Added Successfully!");
    //     } else {
    //       console.error(
    //         "treatmentMachineResponse is undefined or not an array"
    //       );
    //     }
    //   }

    //   setShowSuccessMessage(true);
    //   handleCloseModal();
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

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

  return (
    <Box p="20px" width="100% !important">
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Employee Records"
          subtitle="List of Employee for Future Reference"
        />
        {user.userType === 9 && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
      </Box>
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
      <EmployeeRecordModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        formData={formData}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default Contacts;
