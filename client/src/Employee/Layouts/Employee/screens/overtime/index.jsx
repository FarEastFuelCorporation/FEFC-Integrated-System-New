import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
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
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import {
  formatDate3,
  formatTime4,
} from "../../../../../OtherComponents/Functions";

const Overtime = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    entries: [
      {
        id: "",
        dateStart: "",
        dateEnd: "",
        timeStart: "",
        timeEnd: "",
        purpose: "",
      },
    ],
    employeeId: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
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
      const response = await axios.get(`${apiUrl}/api/overtime/${user.id}`);

      setRecords(response.data.overtimes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback(
    (e, index) => {
      const { name, value } = e.target;
      const updatedEntries = [...formData.entries];
      updatedEntries[index] = { ...updatedEntries[index], [name]: value };
      setFormData({ ...formData, entries: updatedEntries });
    },
    [formData]
  );

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

  const handleEditClick = (id) => {
    const typeToEdit = dataRecords.find((type) => type.id === id);

    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        entries: [
          {
            id: typeToEdit.id,
            dateStart: typeToEdit.dateStart,
            dateEnd: typeToEdit.dateEnd,
            timeStart: typeToEdit.timeStart,
            timeEnd: typeToEdit.timeEnd,
            purpose: typeToEdit.purpose,
          },
        ],
        employeeId: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Overtime with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Overtime Request?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/overtime/${id}`);

      fetchData();
      setSuccessMessage("Overtime Request Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateFormData = (formData) => {
    const { entries, remaining } = formData;

    const errors = []; // Initialize an array to collect error messages

    // Check if there are entries and validate each entry
    if (!Array.isArray(entries) || entries.length === 0) {
      errors.push("Please add at least one entry.");
    } else {
      entries.forEach((entry, index) => {
        const { dateStart, dateEnd, purpose } = entry; // Destructure entry

        // Check for required fields and push error messages to the array
        if (!dateStart) {
          errors.push(`Entry ${index + 1}: Please select a start date.`);
        }
        if (!dateEnd) {
          errors.push(`Entry ${index + 1}: Please select an end date.`);
        }
        if (!purpose) {
          errors.push(`Entry ${index + 1}: Please enter a purpose.`);
        }
        if (new Date(dateStart) > new Date(dateEnd)) {
          errors.push(`Entry ${index + 1}: End date must be after start date.`);
        }
      });
    }

    // Validate remaining days and duration
    const totalDuration = entries.length; // Assuming duration is based on the number of entries
    if (remaining < totalDuration) {
      errors.push("Remaining days cannot be less than the total duration.");
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
        // Update existing overtime order
        await axios.put(`${apiUrl}/api/overtime/${formData.id}`, formData);

        setSuccessMessage("Overtime Request Updated Successfully!");
      } else {
        // Add new overtime order
        await axios.post(`${apiUrl}/api/overtime`, formData);

        setSuccessMessage("Overtime Request Added Successfully!");
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
      field: "start",
      headerName: "Start",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let start;

        if (!params.row.dateStart) return (start = "");
        if (!params.row.timeStart) return (start = "");

        // Format departure date
        const date = new Date(params.row.dateStart);
        const dateFormat = formatDate3(date);

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeStart.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = formatTime4(timeFormat);

        start = `${dateFormat} ${timeString}`;

        let value = {};
        value.value = start || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "end",
      headerName: "End",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let end;

        if (!params.row.dateEnd) return (end = "");
        if (!params.row.timeEnd) return (end = "");

        // Format departure date
        const date = new Date(params.row.dateEnd);
        const dateFormat = formatDate3(date);

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeEnd.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = formatTime4(timeFormat);

        end = `${dateFormat} ${timeString}`;

        let value = {};
        value.value = end || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "purpose",
      headerName: "Purpose",
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
        }
        approval = params.row.isApproved;

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

  const handleAddEntry = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          id: "", // Generate or assign a unique ID here if necessary
          dateStart: "",
          dateEnd: "",
          timeStart: "",
          timeEnd: "",
          purpose: "",
        },
      ],
    }));
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = formData.entries.filter((_, i) => i !== index);
    setFormData({ ...formData, entries: updatedEntries });
  };

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
            Overtime Request
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
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            maxHeight: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "scroll",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id
              ? `Update Overtime Request Form`
              : `Overtime Request Form`}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>

          <Box>
            {formData.entries.map((entry, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <div style={{ width: "100%", display: "flex", gap: "20px" }}>
                  <TextField
                    label="Date Start"
                    name="dateStart"
                    value={entry.dateStart}
                    onChange={(e) => handleInputChange(e, index)}
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
                    label="Date End"
                    name="dateEnd"
                    value={entry.dateEnd}
                    onChange={(e) => handleInputChange(e, index)}
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
                <div style={{ width: "100%", display: "flex", gap: "20px" }}>
                  <TextField
                    label="Time Start"
                    name="timeStart"
                    value={entry.timeStart}
                    onChange={(e) => handleInputChange(e, index)}
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
                    label="Time End"
                    name="timeEnd"
                    value={entry.timeEnd}
                    onChange={(e) => handleInputChange(e, index)}
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
                <TextField
                  label="Purpose"
                  name="purpose"
                  value={entry.purpose}
                  onChange={(e) => handleInputChange(e, index)}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
                {formData.entries.length > 1 && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveEntry(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {!formData.id && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddEntry}
              >
                Add More
              </Button>
            )}
          </Box>

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
            disabled={formData.remaining < formData.duration} // Disable when remaining is less than duration
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Overtime;
