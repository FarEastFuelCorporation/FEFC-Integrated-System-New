import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  MenuItem,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmationDialog from "../../ConfirmationDialog";
import VehicleProfileModal from "../../Modals/VehicleProfileModal";
import {
  calculateRemainingDays,
  calculateRemainingTime,
  formatDateFull,
} from "../../Functions";

const Vehicles = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    vehicleTypeId: "",
    plateNumber: "",
    vehicleName: "",
    netCapacity: "",
    ownership: "",
    yearManufacture: "",
    registrationNumber: "",
    owner: "",
    registrationExpirationDate: "",
    insuranceProvider: "",
    insuranceExpirationDate: "",
    engineType: "",
    fuelType: "",
    transmission: "",
    grossVehicleWeight: "",
    curbWeight: "",
    picture: null,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureFileName, setPictureFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
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
      const response = await axios.get(`${apiUrl}/api/vehicle`);
      const vehicleRecords = response.data;

      const flattenedData = vehicleRecords.vehicles.map((vehicle) => ({
        ...vehicle,
        typeOfVehicle: vehicle.VehicleType
          ? vehicle.VehicleType.typeOfVehicle
          : null,
      }));

      // Set state with vehicles including typeOfVehicle
      setVehicleData(flattenedData);

      const vehicleTypeResponse = await axios.get(`${apiUrl}/api/vehicleType`);
      const sortedVehicleTypes = vehicleTypeResponse.data.vehicleTypes.sort(
        (a, b) => {
          if (a.typeOfVehicle < b.typeOfVehicle) {
            return -1;
          }
          if (a.typeOfVehicle > b.typeOfVehicle) {
            return 1;
          }
          return 0;
        }
      );
      setVehicleTypes(sortedVehicleTypes);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
    setErrorMessage("");
    setPictureFileName("");
  };

  const handleRowClick = (params) => {
    setSelectedRow(params);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setSelectedTab(0);
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const vehicleToEdit = vehicleData.find((vehicle) => vehicle.id === id);
    if (vehicleToEdit) {
      setFormData({
        id: vehicleToEdit.id,
        vehicleTypeId: vehicleToEdit.vehicleTypeId,
        plateNumber: vehicleToEdit.plateNumber,
        vehicleName: vehicleToEdit.vehicleName,
        netCapacity: vehicleToEdit.netCapacity,
        ownership: vehicleToEdit.ownership,
        yearManufacture: vehicleToEdit.yearManufacture,
        registrationNumber: vehicleToEdit.registrationNumber,
        owner: vehicleToEdit.owner,
        registrationExpirationDate: vehicleToEdit.registrationExpirationDate,
        insuranceProvider: vehicleToEdit.insuranceProvider,
        insuranceExpirationDate: vehicleToEdit.insuranceExpirationDate,
        engineType: vehicleToEdit.engineType,
        fuelType: vehicleToEdit.fuelType,
        transmission: vehicleToEdit.transmission,
        grossVehicleWeight: vehicleToEdit.grossVehicleWeight,
        curbWeight: vehicleToEdit.curbWeight,
        picture: vehicleToEdit.picture,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Vehicle with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Vehicle?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/vehicle/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Vehicle Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const validateVehicleForm = () => {
    let errors = [];

    // Destructure vehicleData for easier validation
    const {
      vehicleTypeId,
      plateNumber,
      vehicleName,
      netCapacity,
      ownership,
      // yearManufacture,
      // registrationNumber,
      // owner,
      // registrationExpirationDate,
      // insuranceProvider,
      // insuranceExpirationDate,
      // engineType,
      // fuelType,
      // transmission,
      // grossVehicleWeight,
      // curbWeight,
      // picture,
    } = formData;

    if (!vehicleTypeId) errors.push("Vehicle Type is required");
    if (!plateNumber) errors.push("Plate Number is required");
    if (!vehicleName) errors.push("Vehicle Name is required");
    if (!netCapacity) errors.push("Net Capacity is required");
    if (!ownership) errors.push("Ownership is required");
    // if (!yearManufacture) errors.push("Year of Manufacture is required");
    // if (!registrationNumber) errors.push("Registration Number is required");
    // if (!owner) errors.push("Owner is required");
    // if (!registrationExpirationDate)
    //   errors.push("Registration Expiration Date is required");
    // if (!insuranceProvider) errors.push("Insurance Provider is required");
    // if (!insuranceExpirationDate)
    //   errors.push("Insurance Expiration Date is required");
    // if (!engineType) errors.push("Engine Type is required");
    // if (!fuelType) errors.push("Fuel Type is required");
    // if (!transmission) errors.push("Transmission is required");
    // if (!grossVehicleWeight) errors.push("Gross Vehicle Weight is required");
    // if (!curbWeight) errors.push("Curb Weight is required");
    // if (!picture) errors.push("Vehicle Picture is required");

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      setShowErrorMessage(true);
      return false;
    }
    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    if (!validateVehicleForm()) {
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Append form data fields to FormData object
      formDataToSend.append("vehicleTypeId", formData.vehicleTypeId);
      formDataToSend.append("plateNumber", formData.plateNumber);
      formDataToSend.append("vehicleName", formData.vehicleName);
      formDataToSend.append("netCapacity", formData.netCapacity);
      formDataToSend.append("ownership", formData.ownership);
      formDataToSend.append("yearManufacture", formData.yearManufacture);
      formDataToSend.append("registrationNumber", formData.registrationNumber);
      formDataToSend.append("owner", formData.owner);
      formDataToSend.append(
        "registrationExpirationDate",
        formData.registrationExpirationDate
      );
      formDataToSend.append("insuranceProvider", formData.insuranceProvider);
      formDataToSend.append(
        "insuranceExpirationDate",
        formData.insuranceExpirationDate
      );
      formDataToSend.append("engineType", formData.engineType);
      formDataToSend.append("fuelType", formData.fuelType);
      formDataToSend.append("transmission", formData.transmission);
      formDataToSend.append("grossVehicleWeight", formData.grossVehicleWeight);
      formDataToSend.append("curbWeight", formData.curbWeight);
      if (pictureFile) {
        formDataToSend.append("picture", pictureFile);
      }
      formDataToSend.append("createdBy", formData.createdBy);

      if (formData.id) {
        // Update existing vehicle
        await axios.put(`${apiUrl}/api/vehicle/${formData.id}`, formDataToSend);

        setSuccessMessage("Vehicle Updated Successfully!");
      } else {
        // Add new vehicle
        await axios.post(`${apiUrl}/api/vehicle`, formDataToSend);

        setSuccessMessage("Vehicle Added Successfully!");
      }
      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setOpen(false);
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
      field: "plateNumber",
      headerName: "Plate Number",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "vehicleName",
      headerName: "Vehicle Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "netCapacity",
      headerName: "Net Capacity (MT)",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "ownership",
      headerName: "Ownership",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "typeOfVehicle",
      headerName: "Vehicle Type",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "registrationExpirationDate",
      headerName: "Registration Expiration Date",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        const formattedDate = formatDateFull(params.value);
        return (
          <div>
            {renderCellWithWrapText({ ...params, value: formattedDate })}
          </div>
        );
      },
    },
    {
      field: "remainingDays",
      headerName: "Days to Expire",
      headerAlign: "center",
      align: "center",
      WIDTH: 150,
      renderCell: (params) => {
        const { registrationExpirationDate } = params.row;

        // Return empty string if registrationExpirationDate is null
        if (registrationExpirationDate === null) {
          return <div></div>; // Return empty div for null
        }

        const { years, months, days, isExpired } = calculateRemainingTime(
          registrationExpirationDate
        );

        // Determine the display value
        let displayValue;
        if (isExpired) {
          displayValue = `${
            years > 0 ? years + " Year" + (years === 1 ? "" : "s") + ", " : ""
          }${
            months > 0
              ? months + " Month" + (months === 1 ? "" : "s") + ", "
              : ""
          }${days} Day${days === 1 ? "" : "s"} Expired`;
        } else if (years === 0 && months === 0 && days === 0) {
          displayValue = "Expires Today"; // Show if it expires today
        } else {
          displayValue = `${
            years > 0 ? years + " Year" + (years === 1 ? "" : "s") + ", " : ""
          }${
            months > 0
              ? months + " Month" + (months === 1 ? "" : "s") + ", "
              : ""
          }${days} Day${days === 1 ? "" : "s"} Remaining`; // Show years, months, and days remaining
        }

        return (
          <div>
            {renderCellWithWrapText({ ...params, value: displayValue })}
          </div>
        );
      },
      sortComparator: (v1, v2) => {
        const getDaysValue = (value) => {
          if (value === null) return 1000000; // Null should be last (highest value)

          return value;
        };

        const daysValue1 = getDaysValue(v1);
        const daysValue2 = getDaysValue(v2);

        return daysValue1 - daysValue2; // Sort based on the calculated values
      },
    },
    {
      field: "view",
      headerName: "View",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handleRowClick(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  if (user.userType === 3) {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
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
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    );
  }

  const calculateGrossVehicleWeight = (netCapacity, curbWeight) => {
    return netCapacity + curbWeight;
  };

  const handleInputChangeWithGrossVehicleWeight = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "netCapacity" || name === "curbWeight") {
      const grossVehicleWeight = calculateGrossVehicleWeight(
        parseFloat(updatedFormData.netCapacity || 0),
        parseFloat(updatedFormData.curbWeight || 0)
      );
      updatedFormData.grossVehicleWeight = grossVehicleWeight;
    }

    setFormData(updatedFormData);
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPictureFile(file);
      setPictureFileName(file.name);
    }
  };

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Vehicles" subtitle="List of Vehicles" />
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
          rows={vehicleData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          getRowClassName={(params) => {
            const daysRemaining = calculateRemainingDays(
              params.row.registrationExpirationDate
            );

            if (daysRemaining !== null) {
              if (daysRemaining < 0) {
                return "blink-red"; // Expired
              } else if (daysRemaining <= 30) {
                return "blink-yellow"; // Near expired
              }
            }
            return ""; // Default class if no blinking is needed
          }}
          initialState={{
            sorting: {
              sortModel: [
                { field: "remainingDays", sort: "asc" }, // First sort by remaining days
              ],
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "100%",
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
            {formData.id ? "Update Vehicle" : "Add New Vehicle"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <TextField
                label="Vehicle Type"
                name="vehicleTypeId"
                value={formData.vehicleTypeId}
                onChange={handleInputChange}
                select
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.typeOfVehicle}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                label="Plate Number"
                name="plateNumber"
                value={formData.plateNumber}
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
            <Grid item xs={12} lg={6}>
              <TextField
                label="Vehicle Name"
                name="vehicleName"
                value={formData.vehicleName}
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
            <Grid item xs={12} lg={6}>
              <TextField
                label="Ownership"
                name="ownership"
                value={formData.ownership}
                onChange={handleInputChange}
                select
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              >
                <MenuItem value="OWNED">OWNED</MenuItem>
                <MenuItem value="LEASED">LEASED</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextField
                label="Net Capacity (MT)"
                name={`netCapacity`}
                value={formData.netCapacity}
                onChange={handleInputChangeWithGrossVehicleWeight}
                type="number"
                required
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextField
                label="Curb Weight (MT)"
                name={`curbWeight`}
                value={formData.curbWeight}
                onChange={handleInputChangeWithGrossVehicleWeight}
                type="number"
                required
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextField
                label="Gross Vehicle Weight (MT)"
                name={`grossVehicleWeight`}
                value={formData.grossVehicleWeight}
                onChange={handleInputChange}
                type="number"
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
                disabled
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                label="Make/Model"
                name="makeModel"
                value={formData.makeModel}
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
            <Grid item xs={12} lg={6}>
              <TextField
                label="Year Manufacture"
                name="yearManufacture"
                value={formData.yearManufacture}
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
            <Grid item xs={12} lg={12}>
              <TextField
                label="Owner"
                name="owner"
                value={formData.owner}
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
            <Grid item xs={12} lg={6}>
              <TextField
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
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
            <Grid item xs={12} lg={6}>
              <TextField
                label="Registration Expiration Date"
                name="registrationExpirationDate"
                value={formData.registrationExpirationDate}
                onChange={handleInputChange}
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                label="Insurance Provider"
                name="insuranceProvider"
                value={formData.insuranceProvider}
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
            <Grid item xs={12} lg={6}>
              <TextField
                label="insurance Expiration Date"
                name="insuranceExpirationDate"
                value={formData.insuranceExpirationDate}
                onChange={handleInputChange}
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextField
                label="Engine Type"
                name="engineType"
                value={formData.engineType}
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
            <Grid item xs={12} lg={4}>
              <TextField
                label="Fuel Type"
                name="fuelType"
                value={formData.fuelType}
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
            <Grid item xs={12} lg={4}>
              <TextField
                label="Transmission"
                name="transmission"
                value={formData.transmission}
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
            <Grid item xs={12} md={6} lg={4}>
              <input
                type="file"
                className="form-control visually-hidden"
                accept="image/*"
                onChange={handlePictureChange}
                id="picture"
                name="picture"
                style={{ display: "none" }}
              />
              <label htmlFor="picture">
                <Typography>File: {pictureFileName}</Typography>
                <Button
                  variant="contained"
                  component="span"
                  sx={{ mt: 2, backgroundColor: colors.primary[500] }}
                >
                  Upload Vehicle Picture
                </Button>
              </label>
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
            {formData.id ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </Box>
      </Modal>
      <VehicleProfileModal
        user={user}
        selectedRow={selectedRow}
        open={open}
        openModal={openModal}
        handleClose={handleClose}
        handleEditClick={handleEditClick}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </Box>
  );
};

export default Vehicles;
