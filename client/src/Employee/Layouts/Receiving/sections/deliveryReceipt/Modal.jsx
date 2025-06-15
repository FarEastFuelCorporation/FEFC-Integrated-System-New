import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { tokens } from "../../../../../theme";

const unitCategory = [
  "PC",
  "PACK",
  "KG",
  "LITERS",
  "BOTTLE",
  "BOX",
  "ROLL",
  "DRUM",
  "CONTAINER",
  "JUMBO SACK",
  "PAIL",
  "LOAD",
  "BAG",
  "GALLON",
  "SET",
].sort((a, b) => a.localeCompare(b));

const SectionModal = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  clients,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddItem = () => {
    const newItem = {
      description: "",
      quantity: "",
      unit: "",
    };
    const updatedItems = [...formData.items, newItem];
    handleInputChange({
      target: { name: "items", value: updatedItems },
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((waste, i) => i !== index);
    handleInputChange({
      target: { name: "items", value: updatedItems },
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItem = formData.items.map((item, i) => {
      if (i !== index) return item;

      // Calculate amount if quantity or unitPrice is updated
      const updatedItem = {
        ...item,
        [field]: value,
      };

      return updatedItem;
    });

    handleInputChange({
      target: { name: "items", value: updatedItem },
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : "50%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          maxHeight: "80vh",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Delivery Receipt" : "Add New Delivery Receipt"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          {formData.id && (
            <Grid item xs={12} lg={6}>
              <TextField
                label="DR No"
                name="deliveryReceiptNo"
                value={formData.deliveryReceiptNo}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                disabled
                autoComplete="off"
              />
            </Grid>
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3}>
            <TextField
              label="Delivery Date"
              name="dateOfDelivery"
              value={formData.dateOfDelivery}
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
              disabled={formData.id}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} lg={9}>
            <Autocomplete
              freeSolo
              fullWidth
              options={clients}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option.clientName || "";
              }}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.clientName
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase())
                )
              }
              inputValue={formData.company}
              onInputChange={(event, newInputValue) => {
                handleInputChange({
                  target: {
                    name: "company",
                    value: newInputValue || "",
                  },
                });
              }}
              onChange={(event, newValue) => {
                if (typeof newValue === "object" && newValue !== null) {
                  // Selected from the list
                  handleInputChange({
                    target: {
                      name: "company",
                      value: newValue.clientName,
                    },
                  });
                  handleInputChange({
                    target: {
                      name: "address",
                      value: newValue.address,
                    },
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company Name"
                  name="company"
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
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
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
              disabled={formData.id}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Driver Name"
              name="driver"
              value={formData.driver}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              disabled={formData.id}
              autoComplete="off"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
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
        {formData.items?.map((item, index) => {
          return (
            <Box key={index}>
              <Typography variant="subtitle2" gutterBottom>
                Item #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label="Description"
                    name={`items[${index}].description`}
                    value={item.description || ""}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    fullWidth
                    required
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                      shrink: true,
                    }}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={5} lg={3}>
                  <TextField
                    label="Quantity"
                    name={`items[${index}].quantity`}
                    value={item.quantity || ""}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    type="Number"
                    fullWidth
                    required
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                      shrink: true,
                    }}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={5} lg={2}>
                  <FormControl fullWidth required>
                    <InputLabel
                      style={{
                        color: colors.grey[100],
                      }}
                    >
                      Unit
                    </InputLabel>
                    <Select
                      labelId={`unit`}
                      name={`items[${index}].unit`}
                      value={item.unit || ""}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      fullWidth
                      inputProps={{
                        name: `unit`,
                        id: `unit`,
                      }}
                    >
                      {unitCategory.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {!formData.id && (
                  <Grid item xs={0.5} textAlign="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        })}
        {!formData.id && (
          <Box display="flex" justifyContent="center">
            <IconButton color="success" onClick={handleAddItem}>
              <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        )}
        <TextField
          label="Created By"
          name="createdBy"
          value={formData.createdBy}
          onChange={handleInputChange}
          fullWidth
          autoComplete="off"
          style={{ display: "none" }}
        />
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update" : "Add"}
        </Button>
      </Box>
    </Modal>
  );
};

export default SectionModal;
