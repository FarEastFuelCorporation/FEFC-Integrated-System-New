import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import { tokens } from "../../../theme";

export const ModalJD = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
          {formData.id ? "Update Product Category" : "Add New Product Category"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <TextField
          label="Product Category"
          name="productCategory"
          value={formData.productCategory}
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
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update Product Category" : "Add Product Category"}
        </Button>
      </Box>
    </Modal>
  );
};

export const ModalJD2 = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  productCategories,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          {formData.id ? "Update Product" : "Add New Product"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <TextField
          label="Product Name"
          name="productName"
          value={formData.productName}
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
        <FormControl fullWidth required>
          <InputLabel
            style={{
              color: colors.grey[100],
            }}
          >
            Product Category
          </InputLabel>
          <Select
            labelId={`productCategoryId`}
            name={`productCategoryId`}
            value={formData.productCategoryId || ""}
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              name: `productCategoryId`,
              id: `productCategoryId`,
            }}
          >
            {productCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.productCategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          {formData.id ? "Update Product" : "Add Product"}
        </Button>
      </Box>
    </Modal>
  );
};
