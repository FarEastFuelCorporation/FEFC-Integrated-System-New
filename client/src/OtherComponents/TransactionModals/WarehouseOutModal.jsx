import React, { forwardRef } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { tokens } from "../../theme";

const WarehouseOutModal = forwardRef(
  (
    {
      open,
      onClose,
      formData,
      setFormData,
      handleFormSubmit,
      errorMessage,
      showErrorMessage,
      refs,
    },
    ref
  ) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {
      warehousedOutDateRef,
      warehousedOutTimeRef,
      warehousedOutItemsRef,
      remarksRef,
    } = refs;

    const handleWeightChange = (index, field, value) => {
      const item = warehousedOutItemsRef.current[index];

      const remaining = document.querySelector(`#remaining-${index}`);

      remaining.value = item.quantity - value;
    };

    return (
      <Box>
        <Modal open={open} onClose={onClose}>
          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1400,
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
              {formData.id
                ? "Update Warehoused Out Transaction"
                : "Warehouse Out Transaction"}
            </Typography>
            <Typography variant="h6" component="h2" color="error">
              {showErrorMessage && errorMessage}
            </Typography>
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <TextField
                label="Warehouse Out Date"
                inputRef={warehousedOutDateRef}
                defaultValue={formData.warehousedOutDate}
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
                label="Warehouse Out Time"
                inputRef={warehousedOutTimeRef}
                defaultValue={formData.warehousedOutTime}
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

            {/* Warehoused Items */}
            <Grid item xs={12} ref={ref}>
              <h3>Warehoused Out Items</h3>
              {warehousedOutItemsRef.current.map((item, index) => (
                <Box key={index} id="item">
                  <Typography my={1}>Item {index + 1}</Typography>
                  <Box id={`warehoused-item-${index}`}>
                    <Grid container spacing={2}>
                      <TextField
                        sx={{ display: "none" }}
                        name={`warehousedTransactionItemId-${index}`}
                        label="warehousedTransactionItemId"
                        fullWidth
                        required
                        autoComplete="off"
                        defaultValue={item.warehousedTransactionItemId}
                        disabled
                      />
                      <Grid item xs={12} sm={6} md={6} lg={4}>
                        <TextField
                          name={`description-${index}`}
                          label="Description"
                          fullWidth
                          required
                          autoComplete="off"
                          defaultValue={item.description}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <FormControl fullWidth required>
                          <InputLabel id={`unit-label-${index}`}>
                            Unit
                          </InputLabel>
                          <Select
                            name={`unit-${index}`}
                            defaultValue={item.unit}
                            labelId={`unit-label-${index}`}
                            fullWidth
                            disabled
                          >
                            <MenuItem value="">
                              <em>Select</em>
                            </MenuItem>
                            <MenuItem value="KG">KG</MenuItem>
                            <MenuItem value="PC">PC</MenuItem>
                            <MenuItem value="CASE">CASE</MenuItem>
                            <MenuItem value="JUMBO">JUMBO</MenuItem>
                            <MenuItem value="POLYSACK">POLYSACK</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          name={`quantity-${index}`}
                          label="Quantity"
                          type="number"
                          fullWidth
                          required
                          defaultValue={item.quantity}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          name={`quantityOut-${index}`}
                          label="Quantity Out"
                          type="number"
                          fullWidth
                          required
                          onChange={(e) =>
                            handleWeightChange(
                              index,
                              `quantityOut-${index}`,
                              e.target.value
                            )
                          }
                          defaultValue={item.quantityOut}
                          disabled={item.quantity === 0}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          name={`remaining-${index}`}
                          id={`remaining-${index}`}
                          label="Remaining"
                          type="number"
                          fullWidth
                          required
                          defaultValue={item.remaining}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ))}
            </Grid>

            <TextField
              label="Remarks"
              inputRef={remarksRef}
              defaultValue={formData.remarksRef}
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="Status Id"
              name="statusId"
              value={formData.statusId}
              fullWidth
              autoComplete="off"
              style={{ display: "none" }}
            />
            <TextField
              label="Created By"
              name="createdBy"
              value={formData.createdBy}
              fullWidth
              autoComplete="off"
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              {formData.id ? "Update" : "Submit"}
            </Button>
          </Box>
        </Modal>
      </Box>
    );
  }
);

export default WarehouseOutModal;
