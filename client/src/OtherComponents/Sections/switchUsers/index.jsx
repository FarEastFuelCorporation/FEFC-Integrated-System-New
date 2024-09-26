import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";

const SwitchUsers = ({ user, onUpdateUser }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Initialize the navigate hook

  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace `user.id` with the actual ID
        const response = await axios.get(`${apiUrl}/api/switchUser/${user.id}`);
        console.log(response.data.employeeRolesOtherRole);
        const mappedData = response.data.employeeRolesOtherRole.map((data) => ({
          ...data,
          employeeRole: data.EmployeeRole.employeeRole,
        }));

        setEmployeeRoles(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user.id]);

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     let response;

  //     if (formData.id) {
  //       // Update existing vehicle type
  //       response = await axios.put(
  //         `${apiUrl}/api/vehicleType/${formData.id}`,
  //         formData
  //       );

  //       const updatedData = response.data.vehicleTypes;

  //       setVehicleTypes(updatedData);
  //       setSuccessMessage("Vehicle Type Updated Successfully!");
  //     } else {
  //       // Add new vehicle type
  //       response = await axios.post(`${apiUrl}/api/vehicleType`, formData);

  //       const updatedData = response.data.vehicleTypes;

  //       setVehicleTypes(updatedData);
  //       setSuccessMessage("Vehicle Type Added Successfully!");
  //     }

  //     setShowSuccessMessage(true);
  //     handleCloseModal();
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleSwitchRole = async (row) => {
    try {
      console.log(row.employeeRoleId);
      // Assuming you have an API endpoint to switch roles
      const response = await axios.put(`${apiUrl}/api/switchUser/${user.id}`, {
        roleId: row.employeeRoleId, // Example role data
      });

      console.log(response.data.employeeRolesEmployee.employeeRoleId);

      user.userType = row.employeeRoleId;

      if (response.status === 200) {
        console.log("Role switched successfully");

        // Update the user object with the new role
        const updatedUser = { ...user, userType: row.employeeRoleId };

        // Call onUpdateUser to update the parent component's user state
        onUpdateUser(updatedUser);

        // Redirect to the /dashboard route after successful role switch
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "employeeRole",
      headerName: "Employee Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "switchRole",
      headerName: "Switch Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSwitchRole(params.row)}
        >
          Switch Role
        </Button>
      ),
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="User Role" subtitle="List of User roles" />
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomDataGridStyles>
        <DataGrid
          rows={employeeRoles ? employeeRoles : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "typeOfVehicle", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default SwitchUsers;
