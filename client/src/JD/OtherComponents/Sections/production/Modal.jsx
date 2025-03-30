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
  Grid,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { tokens } from "../../../theme";

const ModalJD = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  ingredients,
  packaging,
  equipments,
  products,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const category1 = [
    "EQUIPMENTS",
    "INGREDIENTS",
    "LABOR",
    "PACKAGING AND LABELING",
    "TRANSPORTATION",
    "UNSOLD GOODS",
    "UTILITIES",
    "OPERATIONS",
    "SALES",
  ];

  const category2 = [
    "CASH IN",
    "CASH ON HAND",
    "CASH OUT",
    "EQUIPMENT FUNDS",
    "EQUIPMENTS",
    "INGREDIENTS",
    "LABOR",
    "PACKAGING AND LABELING",
    "TRANSPORTATION",
    "UNSOLD GOODS",
    "UTILITIES",
  ];

  const unitCategory = [
    "PC",
    "PACK",
    "G",
    "KG",
    "ML",
    "L",
    "BOTTLE",
    "BOX",
    "ROLL",
  ];

  const handleAddIngredient = () => {
    const newIngredient = {
      id: "",
      unit: "",
      remaining: "",
      unitPrice: "",
      quantity: "",
      amount: 0,
      remarks: "",
    };
    const updatedIngredients = [...formData.ingredients, newIngredient];
    handleInputChange({
      target: { name: "ingredients", value: updatedIngredients },
    });
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = formData.ingredients.filter(
      (waste, i) => i !== index
    );
    handleInputChange({
      target: { name: "ingredients", value: updatedIngredients },
    });
  };

  const handleIngredientsChange = (index, field, value) => {
    const updatedIngredients = formData.ingredients.map((ingredient, i) => {
      if (i !== index) return ingredient;

      const ingredientItem = ingredients.filter(
        (ingredient) => ingredient.id === value
      );

      console.log(ingredientItem);

      console.log(ingredient);
      console.log(index);
      console.log(field);
      console.log(value);

      // Calculate amount if quantity or unitPrice is updated
      const updatedTransaction = {
        ...ingredient,
        [field]: value,
        ...(field === "id" && ingredientItem.length > 0
          ? {
              unit: ingredientItem[0].unit,
              remaining: ingredientItem[0].updatedQuantity,
              unitPrice: ingredientItem[0].unitPrice,
            }
          : {}),
      };

      if (field === "quantity" || field === "unitPrice") {
        const quantity = parseFloat(updatedTransaction.quantity) || 0;
        const unitPrice = parseFloat(updatedTransaction.unitPrice) || 0;
        updatedTransaction.amount = quantity * unitPrice;
      }

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "ingredients", value: updatedIngredients },
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
          width: "90%",
          maxHeight: "90%",
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
          {formData.id ? "Update Production" : "Add New Production"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1} lg={2}>
            <TextField
              label="Transaction Date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleInputChange}
              type="Date"
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
          <Grid item xs={1} lg={3}>
            <FormControl fullWidth required>
              <InputLabel
                style={{
                  color: colors.grey[100],
                }}
              >
                Product
              </InputLabel>
              <Select
                labelId={`productId`}
                name={`productId`}
                value={formData.productId || ""}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  name: `productId`,
                  id: `productId`,
                }}
              >
                {products.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.productName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>
          Ingredients
        </Typography>
        {formData.ingredients?.map((ingredient, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Ingredient #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={1} lg={3}>
                <FormControl fullWidth required>
                  <InputLabel
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Product
                  </InputLabel>
                  <Select
                    labelId={`id`}
                    name={`ingredients[${index}].id`}
                    value={ingredient.id || ""}
                    onChange={(e) =>
                      handleIngredientsChange(index, "id", e.target.value)
                    }
                    fullWidth
                    inputProps={{
                      name: `id`,
                      id: `id`,
                    }}
                  >
                    {ingredients.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1} lg={1}>
                <TextField
                  label="Unit"
                  name={`ingredients[${index}].unit`}
                  value={ingredient.unit || ""}
                  onChange={(e) =>
                    handleIngredientsChange(index, "unit", e.target.value)
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
                  disabled
                />
              </Grid>
              <Grid item xs={1} lg={2}>
                <TextField
                  label="Available Stock"
                  name={`ingredients[${index}].remaining`}
                  value={ingredient.remaining || ""}
                  onChange={(e) =>
                    handleIngredientsChange(index, "remaining", e.target.value)
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
                  disabled
                />
              </Grid>
              <Grid item xs={1} lg={2}>
                <TextField
                  label="Unit Price"
                  name={`ingredients[${index}].unitPrice`}
                  value={ingredient.unitPrice || ""}
                  onChange={(e) =>
                    handleIngredientsChange(index, "unitPrice", e.target.value)
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
                  disabled
                />
              </Grid>
              <Grid item xs={1} lg={1.5}>
                <TextField
                  label="Quantity"
                  name={`ingredients[${index}].quantity`}
                  value={ingredient.quantity || ""}
                  onChange={(e) =>
                    handleIngredientsChange(index, "quantity", e.target.value)
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
              <Grid item xs={1} lg={2}>
                <TextField
                  label="Amount"
                  name={`ingredients[${index}].amount`}
                  value={ingredient.amount || ""}
                  onChange={(e) =>
                    handleIngredientsChange(index, "amount", e.target.value)
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
                  disabled
                />
              </Grid>
              <Grid item xs={1} lg={0.5} textAlign="right">
                <IconButton
                  color="error"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center">
          <IconButton color="success" onClick={handleAddIngredient}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1} lg={2}>
            <TextField
              label="Ingredient Cost"
              name="ingredientCost"
              value={formData.ingredientCost}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
                shrink: true,
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
          <Grid item xs={1} lg={2}>
            <TextField
              label="Packaging Cost"
              name="packagingCost"
              value={formData.packagingCost}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
                shrink: true,
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
          <Grid item xs={1} lg={2}>
            <TextField
              label="Equipment Cost"
              name="equipmentCost"
              value={formData.equipmentCost}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
                shrink: true,
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
          <Grid item xs={1} lg={2}>
            <TextField
              label="Utilities Cost"
              name="utilitiesCost"
              value={formData.utilitiesCost}
              onChange={handleInputChange}
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
          <Grid item xs={1} lg={2}>
            <TextField
              label="Labor Cost"
              name="laborCost"
              value={formData.laborCost}
              onChange={handleInputChange}
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
          <Grid item xs={1} lg={2}>
            <TextField
              label="Total Cost"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
                shrink: true,
              }}
              autoComplete="off"
              disabled
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
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update Production" : "Add Production"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalJD;
