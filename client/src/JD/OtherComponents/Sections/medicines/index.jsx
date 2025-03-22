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
import {
  formatDate3,
  formatTime2,
  formatTime3,
  formatTime4,
} from "../../Functions";
import LoadingSpinner from "../../LoadingSpinner";
import SuccessMessage from "../../SuccessMessage";
import ConfirmationDialog from "../../ConfirmationDialog";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import Header from "../../Header";
import { format, parse } from "date-fns";

const Medicines = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFormTab, setSelectedFormTab] = useState(0);

  const initialFormData = {
    id: "",
    medicineName: "",
    createdBy: user.id,
  };
  const initialLogFormData = {
    id: "",
    medicineId: "",
    employeeId: null,
    reason: "",
    transaction: "",
    quantity: 0,
    transactionDate: "",
    transactionTime: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formLogData, setFormLogData] = useState(initialLogFormData);

  const [dataRecords, setRecords] = useState([]);
  const [dataRecords2, setRecords2] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorLogMessage, setErrorLogMessage] = useState("");
  const [showErrorLogMessage, setShowErrorLogMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleChangeFormTab = (event, newValue) => {
    setSelectedFormTab(newValue);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/medicine/quantity`);
      const responseLog = await axios.get(`${apiUrl}/api/medicineLog`);
      const employeeResponse = await axios.get(`${apiUrl}/api/employee`);
      const medicineResponse = await axios.get(`${apiUrl}/api/medicine`);

      const medicines = response.data.medicines;
      const medicineLogs = responseLog.data.medicineLogs;

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
    clearFormLogData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const clearFormLogData = () => {
    setFormLogData(initialLogFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputLogChange = (e) => {
    const { name, value } = e.target;
    setFormLogData({ ...formLogData, [name]: value });
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

  const validateMedicineId = (medicineId, errors) => {
    if (!medicineId) errors.push("Medicine Name is required.");
  };

  const validateEmployeeId = (employeeId, errors) => {
    if (!employeeId) errors.push("Employee is required.");
  };

  const validateReason = (reason, errors) => {
    if (!reason || reason.trim() === "") errors.push("Reason is required.");
  };

  const validateTransaction = (transaction, errors) => {
    if (!transaction || transaction.trim() === "")
      errors.push("Transaction type is required.");
  };

  const validateQuantity = (quantity, errors) => {
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      errors.push("Quantity must be a positive number.");
    }
  };

  const validateTransactionDate = (transactionDate, errors) => {
    if (!transactionDate) {
      errors.push("Transaction date is required.");
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (new Date(transactionDate) > new Date(today)) {
        errors.push("Transaction date cannot be in the future.");
      }
    }
  };

  const validateTransactionTime = (transactionTime, errors) => {
    if (!transactionTime) errors.push("Transaction time is required.");
  };

  const validateFormLogData = (formLogData) => {
    const errors = [];

    validateMedicineId(formLogData.medicineId, errors);
    validateTransaction(formLogData.transaction, errors);
    if (formLogData.transaction === "ISSUANCE") {
      validateEmployeeId(formLogData.employeeId, errors);
      validateReason(formLogData.reason, errors);
    }
    validateQuantity(formLogData.quantity, errors);
    validateTransactionDate(formLogData.transactionDate, errors);
    validateTransactionTime(formLogData.transactionTime, errors);

    return errors;
  };

  const handleFormLogSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = validateFormLogData(formLogData);
    if (errors.length > 0) {
      setErrorLogMessage(errors.join(" "));
      setShowErrorLogMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formLogData.id) {
        // Update existing department
        await axios.put(
          `${apiUrl}/api/medicineLog/${formLogData.id}`,
          formLogData
        );

        setSuccessMessage("Medicine Log Updated Successfully!");
      } else {
        // Add new department
        await axios.post(`${apiUrl}/api/medicineLog`, formLogData);

        setSuccessMessage("Medicine Log Added Successfully!");
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

        const parsedTime = parse(
          params.row.transactionTime,
          "HH:mm:ss",
          new Date()
        );

        let haulingTime;

        haulingTime = format(parsedTime, "hh:mm a");

        let value = {};
        value.value = haulingTime;

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "medicineName",
      headerName: "Medicine Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        return params.row.Medicine.medicineName;
      },
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
      field: "submittedBy",
      headerName: "Submitted By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        if (params.row.Employee) {
          return `${params.row.Employee.firstName} ${params.row.Employee.lastName}`;
        } else {
          return;
        }
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "issuedTo",
      headerName: "Issued To",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        if (params.row.MedicineLogEmployee) {
          return `${params.row.MedicineLogEmployee.firstName} ${params.row.MedicineLogEmployee.lastName}`;
        } else {
          return;
        }
      },
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
            maxWidth: 600,
            height: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Tabs
            value={selectedFormTab}
            onChange={handleChangeFormTab}
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
            <Tab
              label={
                formData.id
                  ? "Update Medicine Record"
                  : "Add New Medicine Record"
              }
            />
            <Tab
              label={
                formData.id ? "Update Medicine Log" : "Add New Medicine Log"
              }
            />
          </Tabs>
          {selectedFormTab === 0 && (
            <Box>
              <Typography variant="h6" component="h2" color="error" mb={2}>
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

              <Box
                mt={2}
                sx={{ width: "100%", display: "flex", justifyContent: "end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                >
                  {formData.id ? "Update Medicine" : "Add Medicine"}
                </Button>
              </Box>
            </Box>
          )}
          {selectedFormTab === 1 && (
            <Box>
              <Typography variant="h6" component="h2" color="error" mb={2}>
                {showErrorLogMessage && errorLogMessage}
              </Typography>
              <Box
                style={{ width: "100%", display: "flex", gap: "20px" }}
                sx={{ mb: 3 }}
              >
                <TextField
                  label="Transaction Date"
                  name="transactionDate"
                  value={formLogData.transactionDate}
                  onChange={handleInputLogChange}
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
                  value={formLogData.transactionTime}
                  onChange={handleInputLogChange}
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
              </Box>
              <FormControl fullWidth required sx={{ mb: 3 }}>
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
                  value={formLogData.transaction || ""} // Controlled value from state
                  onChange={handleInputLogChange} // Handler for value changes
                  inputProps={{
                    id: "transaction", // Unique id for accessibility
                  }}
                >
                  <MenuItem value="RE-STOCK">RE-STOCK</MenuItem>
                  <MenuItem value="ISSUANCE">ISSUANCE</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                sx={{ mb: 3 }}
                options={medicinesData}
                getOptionLabel={(option) =>
                  option.id === "" ? "" : option.medicineName
                }
                value={
                  medicinesData.find(
                    (emp) => emp.id === formLogData.medicineId
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleInputLogChange({
                    target: {
                      name: "medicineId",
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
                sx={{ mb: 3 }}
                label="Quantity"
                name="quantity"
                value={formLogData.quantity}
                onChange={handleInputLogChange}
                type="number"
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
              {formLogData.transaction === "ISSUANCE" && (
                <>
                  <Autocomplete
                    sx={{ mb: 3 }}
                    options={employeesData}
                    getOptionLabel={(option) =>
                      option.employeeId === ""
                        ? ""
                        : `${option.firstName} ${option.lastName}`
                    }
                    value={
                      employeesData.find(
                        (emp) => emp.employeeId === formLogData.employeeId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleInputLogChange({
                        target: {
                          name: "employeeId",
                          value: newValue ? newValue.employeeId : null,
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
                  />
                  <TextField
                    sx={{ mb: 3 }}
                    label="Reason"
                    name="reason"
                    value={formLogData.reason}
                    onChange={handleInputLogChange}
                    fullWidth
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                    autoComplete="off"
                  />
                </>
              )}
              <TextField
                label="Created By"
                name="createdBy"
                value={formLogData.createdBy}
                onChange={handleInputLogChange}
                fullWidth
                autoComplete="off"
                style={{ display: "none" }}
              />
              <Box
                mt={2}
                sx={{ width: "100%", display: "flex", justifyContent: "end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormLogSubmit}
                >
                  {formData.id ? "Update Medicine Log" : "Add Medicine Log"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Medicines;
