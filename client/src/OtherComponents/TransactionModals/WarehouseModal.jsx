import React from "react";
import { Box, Modal, Button, TextField, Grid } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

const WarehousedTransactionModal = ({ open, onClose, onSubmit }) => {
  const { control } = useFormContext(); // Access methods and state from the parent form

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
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
        <h2>Warehoused Transaction</h2>
        <Grid
          container
          spacing={2}
          sx={{
            overflowY: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* Warehoused Date */}
          <Grid item xs={6}>
            <Controller
              name="warehousedDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Warehoused Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              )}
            />
          </Grid>
          {/* Warehoused Time */}
          <Grid item xs={6}>
            <Controller
              name="warehousedTime"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Warehoused Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              )}
            />
          </Grid>

          {/* Warehoused Items */}
          <Grid item xs={12}>
            <h3>Warehoused Items</h3>
            <Controller
              name="warehousedItems"
              control={control}
              defaultValue={[
                {
                  gatePass: "",
                  warehouse: "",
                  area: "",
                  section: "",
                  level: "",
                  palletNumber: "",
                  steamNumber: "",
                  quantity: 0,
                  unit: "",
                  description: "",
                },
              ]}
              render={({ field: { onChange, value } }) =>
                value.map((item, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                      <TextField
                        label="Description"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].description = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Unit"
                        value={item.unit}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].unit = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].quantity = Number(e.target.value);
                          onChange(newItems);
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Gate Pass"
                        value={item.gatePass}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].gatePass = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Warehouse"
                        value={item.warehouse}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].warehouse = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Area"
                        value={item.area}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].area = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Section"
                        value={item.section}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].section = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Level"
                        value={item.level}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].level = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Pallet #"
                        value={item.palletNumber}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].palletNumber = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2} lg={1}>
                      <TextField
                        label="Steam Number"
                        value={item.steamNumber}
                        onChange={(e) => {
                          const newItems = [...value];
                          newItems[index].steamNumber = e.target.value;
                          onChange(newItems);
                        }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))
              }
            />
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <Controller
              name="remarks"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Remarks" fullWidth />
              )}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WarehousedTransactionModal;
