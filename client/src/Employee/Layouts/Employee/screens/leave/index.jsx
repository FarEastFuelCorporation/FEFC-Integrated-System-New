import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SickIcon from "@mui/icons-material/Sick";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import { tokens } from "../../../../../theme";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import {
  formatDate3,
  formatTime4,
} from "../../../../../OtherComponents/Functions";

const Leave = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    typeOfLeave: "",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    startTime: "",
    endTime: "",
    remaining: 0,
    duration: 0,
    reason: "",
    employeeId: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [sickLeaveCount, setSickLeaveCount] = useState(0);
  const [vacationLeaveCount, setVacationLeaveCount] = useState(0);
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
      const response = await axios.get(`${apiUrl}/api/leave/${user.id}`);

      const leaves = response.data.leaves;

      const sickLeaveCount = leaves
        .filter(
          (leave) =>
            leave.typeOfLeave === "SICK LEAVE" &&
            leave.isApproved !== "DISAPPROVED"
        )
        .reduce((total, leave) => total + (leave.duration || 0), 0);

      const vacationLeaveCount = leaves
        .filter(
          (leave) =>
            leave.typeOfLeave === "VACATION LEAVE" &&
            leave.isApproved !== "DISAPPROVED"
        )
        .reduce((total, leave) => total + (leave.duration || 0), 0);

      setRecords(response.data.leaves);
      setSickLeaveCount(sickLeaveCount);
      setVacationLeaveCount(vacationLeaveCount);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const handleDateChange = useCallback(
    (e) => {
      handleInputChange(e);

      const { startDate, endDate, isHalfDay } = {
        ...formData,
        [e.target.name]: e.target.value,
      };

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
          // Set error message and show the error
          setErrorMessage("End date cannot be earlier than the start date.");
          setShowErrorMessage(true);

          // Reset the duration to prevent invalid data
          setFormData((prevData) => ({
            ...prevData,
            duration: "",
          }));
        } else {
          // Calculate the difference in time and convert it to days
          const diffTime = Math.abs(end - start);
          let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

          // Adjust duration if isHalfDay is checked
          if (isHalfDay) {
            diffDays -= 0.5; // Subtract 0.5 if it's a half-day leave
          }

          // Clear the error message and update the duration
          setErrorMessage("");
          setShowErrorMessage(false);

          // Update the duration in the formData
          setFormData((prevData) => ({
            ...prevData,
            duration: diffDays,
          }));
        }
      }
    },
    [formData, handleInputChange]
  );

  useEffect(() => {
    // Trigger date recalculation whenever isHalfDay changes
    if (formData.startDate && formData.endDate) {
      handleDateChange({
        target: {
          name: "startDate",
          value: formData.startDate,
        },
      });
    }
  }, [
    formData.isHalfDay,
    formData.startDate,
    formData.endDate,
    handleDateChange,
  ]);

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

  const handleSickLeaveClick = (id) => {
    // Calculate remaining sick leaves
    const remainingSickLeaves = 5 - sickLeaveCount; // Assuming 5 is the initial total
    setFormData({
      id: "",
      typeOfLeave: "SICK LEAVE",
      startDate: "",
      endDate: "",
      isHalfDay: false,
      startTime: "",
      endTime: "",
      remaining: remainingSickLeaves < 0 ? 0 : remainingSickLeaves,
      duration: 0,
      reason: "",
      employeeId: user.id,
    });
    handleOpenModal();
  };

  const handleVacationLeaveClick = (id) => {
    const remainingVacationLeaves = 7 - vacationLeaveCount; // Assuming 5 is the initial total

    setFormData({
      id: "",
      typeOfLeave: "VACATION LEAVE",
      startDate: "",
      endDate: "",
      isHalfDay: false,
      startTime: "",
      endTime: "",
      remaining: remainingVacationLeaves < 0 ? 0 : remainingVacationLeaves,
      duration: 0,
      reason: "",
      employeeId: user.id,
    });
    handleOpenModal();
  };

  const handleEmergencyLeaveClick = (id) => {
    setFormData({
      id: "",
      typeOfLeave: "EMERGENCY LEAVE",
      startDate: "",
      endDate: "",
      isHalfDay: false,
      startTime: "",
      endTime: "",
      remaining: 0,
      duration: 0,
      reason: "",
      employeeId: user.id,
    });
    handleOpenModal();
  };

  const handleEditClick = (id) => {
    const typeToEdit = dataRecords.find((type) => type.id === id);
    const remainingLeave =
      typeToEdit.typeOfLeave === "SICK LEAVE"
        ? 5 - sickLeaveCount + typeToEdit.duration
        : 7 - vacationLeaveCount + typeToEdit.duration;

    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        typeOfLeave: typeToEdit.typeOfLeave,
        startDate: typeToEdit.startDate,
        endDate: typeToEdit.endDate,
        isHalfDay: typeToEdit.isHalfDay,
        startTime: typeToEdit.startTime,
        endTime: typeToEdit.endTime,
        remaining: remainingLeave,
        duration: typeToEdit.duration,
        reason: typeToEdit.reason,
        employeeId: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Scrap type with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Leave?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/leave/${id}`);

      fetchData();
      setSuccessMessage("Leave Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateFormData = (formData) => {
    const { startDate, endDate, reason, duration, remaining } = formData;

    const errors = []; // Initialize an array to collect error messages

    // Check for required fields and push error messages to the array
    if (!startDate) {
      errors.push("Please select a start date.");
    }
    if (!endDate) {
      errors.push("Please select an end date.");
    }
    if (!reason) {
      errors.push("Please enter a reason.");
    }
    if (formData.typeOfLeave !== "EMERGENCY LEAVE") {
      if (duration <= 0) {
        errors.push("Duration must be greater than zero.");
      }
      if (remaining < duration) {
        errors.push("Remaining days cannot be less than the duration.");
      }
      if (new Date(startDate) > new Date(endDate)) {
        errors.push("End date must be after start date.");
      }
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
        // Update existing travel order
        await axios.put(`${apiUrl}/api/leave/${formData.id}`, formData);

        setSuccessMessage("Leave Updated Successfully!");
      } else {
        // Add new travel order
        await axios.post(`${apiUrl}/api/leave`, formData);

        setSuccessMessage("Leave Added Successfully!");
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
        let value = {};
        value.value = formatDate3(params.row.startDate) || "";

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
        let value = {};
        value.value = formatDate3(params.row.endDate) || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Approval",
      headerName: "Approval",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        let approval;
        if (!params.row.isApproved) {
          approval = "WAITING FOR APPROVAL";
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
        let approval;
        if (!params.row.isNoted) {
          approval = "WAITING FOR APPROVAL";
        } else {
          approval = params.row.isNoted;
        }

        let value = {};
        value.value = approval || "";

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
            Leave
          </Typography>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSickLeaveClick}
          sx={{ display: "flex", width: "150px", justifyContent: "flex-start" }}
          disabled={sickLeaveCount >= 5}
        >
          <SickIcon sx={{ fontSize: 40 }} />
          {`Sick Leave ${sickLeaveCount}/5`}
        </Button>
        <Button
          onClick={handleVacationLeaveClick}
          variant="contained"
          color="secondary"
          sx={{ display: "flex", width: "150px", justifyContent: "flex-start" }}
          disabled={vacationLeaveCount >= 7}
        >
          <AirportShuttleIcon sx={{ fontSize: 40 }} />
          {`Vacation Leave ${vacationLeaveCount}/7`}
        </Button>
        <Button
          onClick={handleEmergencyLeaveClick}
          variant="contained"
          color="secondary"
          sx={{ display: "flex", width: "150px", justifyContent: "flex-start" }}
        >
          <MedicalServicesIcon sx={{ fontSize: 40 }} />
          {`Emergency Leave`}
        </Button>
      </Box>
      <CustomDataGridStyles height={"auto"}>
        <DataGrid
          rows={dataRecords ? dataRecords : []}
          columns={columns}
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
            {formData.id
              ? `Update ${formData.typeOfLeave} FORM`
              : `${formData.typeOfLeave} FORM`}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            {formData.typeOfLeave !== "EMERGENCY LEAVE" && (
              <TextField
                label="Remaining"
                name="remaining"
                value={formData.remaining}
                onChange={handleInputChange}
                fullWidth
                type="number"
                required
                InputProps={{ readOnly: true }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            )}
            <TextField
              label="Duration of Leave"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              fullWidth
              type="number"
              required
              InputProps={{ readOnly: true }}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </div>
          <Typography variant="h6" component="h2">
            Date Coverage
          </Typography>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <TextField
              label="From"
              name="startDate"
              value={formData.startDate}
              onChange={handleDateChange}
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
              label="To"
              name="endDate"
              value={formData.endDate}
              onChange={handleDateChange}
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
          </div>

          {/* Checkbox for isHalfDay */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isHalfDay || false} // Ensure it's a boolean value
                onChange={(e) => {
                  const isChecked = e.target.checked;

                  // Update the isHalfDay value in formData
                  handleInputChange({
                    target: { name: "isHalfDay", value: isChecked },
                  });
                }}
                color="secondary"
              />
            }
            label="Half Day"
          />

          {formData.isHalfDay && (
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <TextField
                label="From"
                name="startTime"
                value={formData.startTime}
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
                label="To"
                name="endTime"
                value={formData.endTime}
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
          )}
          <TextField
            label="Reason"
            name="reason"
            value={formData.reason}
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
            disabled={
              formData.typeOfLeave !== "EMERGENCY LEAVE" &&
              formData.remaining < formData.duration
            } // Disable when remaining is less than duration
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Leave;
