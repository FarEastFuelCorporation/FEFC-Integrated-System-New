import { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import { tokens } from "../../../../../theme";
import { formatTimeRange } from "../../../../../OtherComponents/Functions";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const WorkSchedule = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    employeeId: "",
    typeOfSchedule: "",
    weekNumber: "",
    mondayIn: null,
    mondayOut: null,
    tuesdayIn: null,
    tuesdayOut: null,
    wednesdayIn: null,
    wednesdayOut: null,
    thursdayIn: null,
    thursdayOut: null,
    fridayIn: null,
    fridayOut: null,
    saturdayIn: null,
    saturdayOut: null,
    sundayIn: null,
    sundayOut: null,
    remarks: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [sortedSubordinates, setSortedSubordinates] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/workSchedule/getSubordinate/${user.id}`
      );

      const workScheduleResponse = await axios.get(
        `${apiUrl}/api/workSchedule/subordinate/${user.id}`
      );

      setRecords(workScheduleResponse.data.workSchedules);

      const sorted = [...response.data.subordinates].sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );

      setSortedSubordinates(sorted);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

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
      const employee = sortedSubordinates.find(
        (emp) => emp.employee_id === typeToEdit.employeeId
      ); // Find the employee details

      setFormData({
        id: typeToEdit.id,
        employeeId: typeToEdit.employeeId,
        designation: employee ? employee.designation : "",
        typeOfSchedule: typeToEdit.typeOfSchedule,
        weekNumber: typeToEdit.weekNumber,
        mondayIn: typeToEdit.mondayIn,
        mondayOut: typeToEdit.mondayOut,
        tuesdayIn: typeToEdit.tuesdayIn,
        tuesdayOut: typeToEdit.tuesdayOut,
        wednesdayIn: typeToEdit.wednesdayIn,
        wednesdayOut: typeToEdit.wednesdayOut,
        thursdayIn: typeToEdit.thursdayIn,
        thursdayOut: typeToEdit.thursdayOut,
        fridayIn: typeToEdit.fridayIn,
        fridayOut: typeToEdit.fridayOut,
        saturdayIn: typeToEdit.saturdayIn,
        saturdayOut: typeToEdit.saturdayOut,
        sundayIn: typeToEdit.sundayIn,
        sundayOut: typeToEdit.sundayOut,
        remarks: typeToEdit.remarks,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Scrap type with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Work Schedule?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/workSchedule/${id}`);

      fetchData();
      setSuccessMessage("Work Schedule Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateFormData = (formData) => {
    const { employeeId, typeOfSchedule } = formData;

    const errors = []; // Initialize an array to collect error messages

    // Check for required fields and push error messages to the array
    if (!employeeId) {
      errors.push("Please select an Employee.");
    }
    if (!typeOfSchedule) {
      errors.push("Please select a Type of Schedule.");
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
        // Update existing work schedule
        await axios.put(`${apiUrl}/api/workSchedule/${formData.id}`, formData);

        setSuccessMessage("Work Schedule Updated Successfully!");
      } else {
        // Add new work schedule
        await axios.post(`${apiUrl}/api/workSchedule`, formData);

        setSuccessMessage("Work Schedule Added Successfully!");
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
      renderCell: renderCellWithWrapText,
      headerClassName: "wrap-header-text",
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
          `${params.row.IdInformation.last_name}, ${params.row.IdInformation.first_name} ${params.row.IdInformation.affix}` ||
          "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      renderCell: (params) => {
        let value = {};
        value.value = params.row.IdInformation.designation || "";

        return renderCellWithWrapText(value);
      },
      headerClassName: "wrap-header-text",
    },
    {
      field: "typeOfSchedule",
      headerName: "Type Of Schedule",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      renderCell: renderCellWithWrapText,
      headerClassName: "wrap-header-text",
    },
    {
      field: "weekNumber",
      headerName: "Week Number",
      headerAlign: "center",
      align: "center",
      minWidth: 80,
      renderCell: renderCellWithWrapText,
      headerClassName: "wrap-header-text",
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
        value.value = params.row.remarks ? params.row.remarks : "NO REMARKS";

        return renderCellWithWrapText(value);
      },
      headerClassName: "wrap-header-text",
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
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
      </Box>
      <hr />
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
          sx={{
            "& .MuiDataGrid-row  > div": {
              color: "black",
              backgroundColor: "white",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid black",
              backgroundColor: "white",
              color: "black",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "white",
              color: "black",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "white",
              color: "black",
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },
          }}
        />
      </CustomDataGridStyles>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "scroll",
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Work Schedule" : "Add Work Schedule"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
              <FormControl fullWidth required>
                <InputLabel
                  id="type-of-schedule-label"
                  style={{
                    color: colors.grey[100],
                  }}
                >
                  Type of Schedule
                </InputLabel>
                <Select
                  labelId="type-of-schedule-label"
                  name="typeOfSchedule"
                  value={formData.typeOfSchedule}
                  onChange={handleInputChange}
                  label="Type of Schedule"
                >
                  <MenuItem value="SHIFTING" sx={{ height: 50 }}>
                    SHIFTING
                  </MenuItem>
                  <MenuItem value="CONTINUOUS" sx={{ height: 50 }}>
                    CONTINUOUS
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.typeOfSchedule === "SHIFTING" && (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                <TextField
                  label="Week Number"
                  name="weekNumber"
                  value={formData.weekNumber}
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
              </Grid>
            )}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
              <Autocomplete
                options={sortedSubordinates || []} // Subordinates array for autocomplete
                getOptionLabel={(option) =>
                  `${option.last_name}, ${option.first_name} ${
                    option.affix || ""
                  }`
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
                  sortedSubordinates.find(
                    (option) => option.employee_id === formData.employeeId
                  ) || null
                } // Set the value to the current employee
                onChange={(event, newValue) => {
                  // Handle selection and set the employeeId as the value
                  if (newValue) {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      employeeId: newValue.employee_id, // Set the employeeId
                      designation: newValue.designation, // Set the employeeId
                    }));
                  }
                }}
                autoHighlight
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={8}
              lg={8}
              xl={2}
              sx={{
                display: {
                  xs: "block",
                  sm: "block",
                  md: "flex",
                  lg: "flex",
                  xl: "block",
                }, // Set to block for xl
                gap: 2,
              }}
            >
              <Grid item xs={12} sm={12} md={6} lg={6} xl={12}>
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
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={12}>
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
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
              </Grid>
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Monday IN"
                name="mondayIn"
                value={formData.mondayIn || ""}
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
              <TextField
                label="Monday OUT"
                name="mondayOut"
                value={formData.mondayOut || ""}
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
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Tuesday IN"
                name="tuesdayIn"
                value={formData.tuesdayIn || ""}
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
              <TextField
                label="Tuesday OUT"
                name="tuesdayOut"
                value={formData.tuesdayOut || ""}
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
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Wednesday IN"
                name="wednesdayIn"
                value={formData.wednesdayIn || ""}
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
              <TextField
                label="Wednesday OUT"
                name="wednesdayOut"
                value={formData.wednesdayOut || ""}
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
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Thursday IN"
                name="thursdayIn"
                value={formData.thursdayIn || ""}
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
              <TextField
                label="Thursday OUT"
                name="thursdayOut"
                value={formData.thursdayOut || ""}
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
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Friday IN"
                name="fridayIn"
                value={formData.fridayIn || ""}
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
              <TextField
                label="Friday OUT"
                name="fridayOut"
                value={formData.fridayOut || ""}
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
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Saturday IN"
                name="saturdayIn"
                value={formData.saturdayIn || ""}
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
              <TextField
                label="Saturday OUT"
                name="saturdayOut"
                value={formData.saturdayOut || ""}
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
            </Grid>
            <Grid item xs={6} sm={3} md={12 / 7} lg={12 / 7} xl={8 / 7}>
              <TextField
                label="Sunday IN"
                name="sundayIn"
                value={formData.sundayIn || ""}
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
              <TextField
                label="Sunday OUT"
                name="sundayOut"
                value={formData.sundayOut || ""}
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
            </Grid>
          </Grid>

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
            width="200px"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default WorkSchedule;
