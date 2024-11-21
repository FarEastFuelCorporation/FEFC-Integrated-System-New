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
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";

import PostAddIcon from "@mui/icons-material/PostAdd";
import { tokens } from "../../../theme";
import { formatDate3, formatTime4 } from "../../Functions";
import LoadingSpinner from "../../LoadingSpinner";
import SuccessMessage from "../../SuccessMessage";
import ConfirmationDialog from "../../ConfirmationDialog";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import Header from "../../Header";

const Medicines = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);

  const initialFormData = {
    id: "",
    medicineName: "",
    createdBy: user.id,
  };
  const initialLogFormData = {
    id: "",
    medicineName: "",
    employeeId: "",
    reason: "",
    transaction: "",
    quantity: 0,
    transactionDate: "",
    transactionTime: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [formLogData, setFormLogData] = useState(initialLogFormData);

  const [dataRecords, setRecords] = useState([]);
  const [dataRecords2, setRecords2] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
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
      const response = await axios.get(`${apiUrl}/api/medicine/quantity`);
      const responseLog = await axios.get(`${apiUrl}/api/medicineLog`);
      const employeeResponse = await axios.get(`${apiUrl}/api/employee`);
      const medicineResponse = await axios.get(`${apiUrl}/api/medicine`);

      console.log(response);
      console.log(responseLog);

      const medicines = response.data.medicines;
      const medicineLogs = responseLog.data.medicineLogs;

      console.log(medicineLogs);
      console.log(medicines);
      setRecords(medicineLogs);
      setRecords2(medicines); // Assuming you're storing this in the `records` state
      setEmployeesData(employeeResponse.data.employees);
      setMedicinesData(medicineResponse.data.medicines);

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
    // const typeToEdit = departments.find((type) => type.id === id);
    // if (typeToEdit) {
    //   setFormData({
    //     id: typeToEdit.id,
    //     department: typeToEdit.department,
    //     createdBy: user.id,
    //   });
    //   handleOpenModal();
    // } else {
    //   console.error(`Department with ID ${id} not found for editing.`);
    // }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Department?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/department/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Department Deleted Successfully!");
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
    const { medicineName } = formData;

    // Check if all required fields are filled
    if (!medicineName) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing department
        await axios.put(`${apiUrl}/api/medicine/${formData.id}`, formData);

        setSuccessMessage("Medicine Updated Successfully!");
      } else {
        // Add new department
        await axios.post(`${apiUrl}/api/medicine`, formData);

        setSuccessMessage("Medicine Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpenLogModal = () => {
    setOpenLogModal(true);
  };

  const handleCloseLogModal = () => {
    setOpenLogModal(false);
    clearFormLogData();
  };

  const clearFormLogData = () => {
    setFormData(initialFormData);
  };

  const handleInputLogChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditLogClick = (id) => {
    // const typeToEdit = departments.find((type) => type.id === id);
    // if (typeToEdit) {
    //   setFormData({
    //     id: typeToEdit.id,
    //     department: typeToEdit.department,
    //     createdBy: user.id,
    //   });
    //   handleOpenModal();
    // } else {
    //   console.error(`Department with ID ${id} not found for editing.`);
    // }
  };

  const handleDeleteLogClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Department?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmLogDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/department/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Department Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormLogSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { medicineName } = formData;

    // Check if all required fields are filled
    if (!medicineName) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing department
        await axios.put(`${apiUrl}/api/medicine/${formData.id}`, formData);

        setSuccessMessage("Medicine Updated Successfully!");
      } else {
        // Add new department
        await axios.post(`${apiUrl}/api/medicine`, formData);

        setSuccessMessage("Medicine Added Successfully!");
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
      field: "medicineName",
      headerName: "Medicine Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transaction",
      headerName: "Transaction",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "reason",
      headerName: "Reason",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        if (!params.row.transactionDate) return "";

        // Format transactionDate
        const date = new Date(params.row.transactionDate);
        const dateFormat = formatDate3(date);

        let value = {};
        value.value = dateFormat || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "transactionTime",
      headerName: "Transaction Time",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        if (!params.row.transactionTime) return "";

        // Format transactionTime
        const date = new Date(params.row.transactionTime);
        const dateFormat = formatTime4(date);

        let value = {};
        value.value = dateFormat || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "issuedTo",
      headerName: "Issued To",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "issuedBy",
      headerName: "Issued By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
  ];

  const columns2 = [
    {
      field: "medicineName",
      headerName: "Medicine Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Medicine Records" subtitle="List of Medicine Records" />
        {user.userType === 23 && (
          <>
            <Box display="flex">
              <IconButton onClick={handleOpenModal}>
                <PostAddIcon sx={{ fontSize: "40px" }} />
              </IconButton>
            </Box>
            {/* <Box display="flex">
              <IconButton onClick={handleOpenLogModal}>
                <PostAddIcon sx={{ fontSize: "40px" }} />
              </IconButton>
            </Box> */}
          </>
        )}
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
          <Tab label={"Summary"} />
          <Tab label={"Log"} />
        </Tabs>
        <hr />
        {selectedTab === 0 && (
          <DataGrid
            rows={dataRecords2 ? dataRecords2 : []}
            columns={columns2}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
          />
        )}
        {selectedTab === 1 && (
          <DataGrid
            rows={dataRecords ? dataRecords : []}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
          />
        )}
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
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Medicine Record" : "Add New Medicine Record"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <TextField
            label="Medicine Name"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
          <TextField
            label="Created By"
            name="createdBy"
            value={formData.createdBy}
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
            {formData.id ? "Update Medicine" : "Add Medicine"}
          </Button>
        </Box>
      </Modal>
      <Modal open={openLogModal} onClose={handleCloseLogModal}>
        <Box
          component="form"
          onSubmit={handleFormLogSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Medicine Log" : "Add New Medicine Log"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="Transaction Date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleInputChange}
              fullWidth
              type="date"
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
              label="Transaction Time"
              name="transactionTime"
              value={formData.transactionTime}
              onChange={handleInputChange}
              fullWidth
              type="time"
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
          <FormControl fullWidth required>
            <InputLabel
              id="transaction-label" // Ensure this matches the labelId in Select
              sx={{
                color: colors.grey[100], // Use the sx prop for styling
              }}
            >
              Transaction
            </InputLabel>
            <Select
              labelId="transaction-label" // Matches the id of InputLabel
              name="transaction" // Name for the input
              value={formData.transaction || ""} // Controlled value from state
              onChange={handleInputChange} // Handler for value changes
              inputProps={{
                id: "transaction", // Unique id for accessibility
              }}
            >
              <MenuItem value="RE-STOCK">RE-STOCK</MenuItem>
              <MenuItem value="ISSUANCE">ISSUANCE</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            options={medicinesData}
            getOptionLabel={(option) =>
              option.employeeId === "" ? "" : option.medicineName
            }
            value={
              medicinesData.find((emp) => emp.id === formData.medicineName) ||
              null
            }
            onChange={(event, newValue) => {
              handleInputChange({
                target: {
                  name: "medicineName",
                  value: newValue ? newValue.id : "",
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Medicine"
                name="medicineName"
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            )}
          />{" "}
          <TextField
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            type="number"
            fullWidth
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
          <Autocomplete
            options={employeesData}
            getOptionLabel={(option) =>
              option.employeeId === ""
                ? ""
                : `${option.firstName} ${option.lastName}`
            }
            value={
              employeesData.find(
                (emp) => emp.employeeId === formData.driverId
              ) || null
            }
            onChange={(event, newValue) => {
              handleInputChange({
                target: {
                  name: "employeeId",
                  value: newValue ? newValue.employeeId : "",
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Employee"
                name="employeeId"
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            )}
          />{" "}
          <TextField
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
          <TextField
            label="Created By"
            name="createdBy"
            value={formData.createdBy}
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
            {formData.id ? "Update Medicine Log" : "Add Medicine Log"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Medicines;
