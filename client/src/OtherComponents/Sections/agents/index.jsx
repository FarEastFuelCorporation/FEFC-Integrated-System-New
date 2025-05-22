import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../../theme";
import SuccessMessage from "../../SuccessMessage";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import LoadingSpinner from "../../LoadingSpinner";
import { validateAgentForm } from "./Validation";
// import ConfirmationDialog from "../../ConfirmationDialog";

const Agents = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    agentId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    affix: "",
    gender: "",
    civilStatus: "",
    birthDate: "",
    mobileNo: "",
    emailAddress: "",
    permanentAddress: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [agents, setAgents] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [openDialog, setOpenDialog] = useState(false);
  // const [dialog, setDialog] = useState(false);
  // const [dialogAction, setDialogAction] = useState(false);

  const [gender, setGender] = useState(formData.gender);
  const [civilStatus, setCivilStatus] = useState(formData.civilStatus);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/agent`);

      setAgents(response.data.agents);
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

  const handleEditClick = (row) => {
    if (row) {
      setFormData({
        agentId: row.agentId,
        firstName: row.firstName,
        middleName: row.middleName,
        lastName: row.lastName,
        affix: row.affix,
        gender: row.gender,
        civilStatus: row.civilStatus,
        birthDate: row.birthDate,
        mobileNo: row.mobileNo,
        emailAddress: row.emailAddress,
        permanentAddress: row.permanentAddress,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Agent with ID ${row.agentId} not found for editing.`);
    }
  };

  // const handleDeleteClick = (id) => {
  //   setOpenDialog(true);
  //   setDialog("Are you sure you want to Delete this Agent?");
  //   setDialogAction(() => () => handleConfirmDelete(id));
  // };

  // const handleConfirmDelete = async (id) => {
  //   try {
  //     setLoading(true);
  //     await axios.delete(`${apiUrl}/api/agents/${id}`, {
  //       data: { deletedBy: user.id },
  //     });

  //     fetchData();
  //     setSuccessMessage("Agent Deleted Successfully!");
  //     setShowSuccessMessage(true);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setOpenDialog(false); // Close the dialog
  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAgentForm(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.agentId) {
        // Update existing agent
        await axios.put(`${apiUrl}/api/agent/${formData.agentId}`, formData);

        setSuccessMessage("Agent Updated Successfully!");
      } else {
        // Add new agent
        await axios.post(`${apiUrl}/api/agent`, formData);

        setSuccessMessage("Agent Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
    handleInputChange(event);
  };

  const handleCivilStatusChange = (event) => {
    const selectedCivilStatus = event.target.value;
    setCivilStatus(selectedCivilStatus);
    handleInputChange(event);
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "agentId",
      headerName: "Agent ID",
      headerAlign: "center",
      align: "center",
      width: 80,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "agentName",
      headerName: "Agent",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 150,
      valueGetter: (params) => {
        return `${params.row.firstName} ${params.row.lastName} ${
          params.row.affix ? params.row.affix : ""
        }`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "gender",
      headerName: "Gender",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "civilStatus",
      headerName: "Civil Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mobileNo",
      headerName: "Contact Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "permanentAddress",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 60,
    //   renderCell: (params) => (
    //     <IconButton
    //       color="error"
    //       onClick={() => handleDeleteClick(params.row.id)}
    //     >
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // },
  ];

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Agents" subtitle="List of Agents" />
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
      {/* <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      /> */}
      <CustomDataGridStyles>
        <DataGrid
          rows={agents ? agents : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.agentId}
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
            width: 1000,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.agentId ? "Update Agent" : "Add New Agent"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} lg={3}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
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
            </Grid>
            <Grid item xs={6} lg={3}>
              <TextField
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
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
            </Grid>
            <Grid item xs={6} lg={3}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
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
            </Grid>
            <Grid item xs={6} lg={3}>
              <TextField
                label="Affix"
                name="affix"
                value={formData.affix}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel
                  id="gender-select-label"
                  style={{ color: colors.grey[100] }}
                  required
                >
                  Gender
                </InputLabel>
                <Select
                  labelId="gender-select-label"
                  name="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                  label="Gender"
                  fullWidth
                >
                  <MenuItem value={"MALE"}>MALE</MenuItem>
                  <MenuItem value={"FEMALE"}>FEMALE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel
                  id="civilStatus-select-label"
                  style={{ color: colors.grey[100] }}
                  required
                >
                  Civil Status
                </InputLabel>
                <Select
                  labelId="civilStatus-select-label"
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleCivilStatusChange}
                  label="civilStatus"
                  fullWidth
                >
                  <MenuItem value={"SINGLE"}>SINGLE</MenuItem>
                  <MenuItem value={"MARRIED"}>MARRIED</MenuItem>
                  <MenuItem value={gender === "MALE" ? "WIDOWER" : "WIDOW"}>
                    {gender === "MALE" ? "WIDOWER" : "WIDOW"}
                  </MenuItem>
                  <MenuItem value={"LIVE-IN"}>LIVE-IN</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} lg={3}>
              <TextField
                label="Birth Date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                fullWidth
                required
                type="date"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                  shrink: true,
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={6} lg={3}>
              <TextField
                label="Mobile No."
                name="mobileNo"
                value={formData.mobileNo}
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
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6} lg={3}>
              <TextField
                label="Email Address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                fullWidth
                required
                type="email"
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                  shrink: true,
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={6} lg={9}>
              <TextField
                label="Address"
                name="permanentAddress"
                value={formData.permanentAddress}
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
            onClick={handleFormSubmit}
          >
            {formData.agentId ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Agents;
