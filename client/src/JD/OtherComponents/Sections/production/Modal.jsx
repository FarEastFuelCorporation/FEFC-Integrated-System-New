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
  packagings,
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

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = formData.ingredients.map((ingredient, i) => {
      if (i !== index) return ingredient;

      const ingredientItem = ingredients.filter(
        (ingredient) => ingredient.id === value
      );

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
        formData.ingredientCost -= updatedTransaction.amount;
        formData.totalCost -= updatedTransaction.amount;
        const quantity = parseFloat(updatedTransaction.quantity) || 0;
        const unitPrice = parseFloat(updatedTransaction.unitPrice) || 0;
        updatedTransaction.amount = quantity * unitPrice;
        formData.ingredientCost += quantity * unitPrice;
        formData.totalCost += quantity * unitPrice;
      }

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "ingredients", value: updatedIngredients },
    });
  };

  const handleAddPackaging = () => {
    const newPackagings = {
      id: "",
      unit: "",
      remaining: "",
      unitPrice: "",
      quantity: "",
      amount: 0,
      remarks: "",
    };
    const updatedPackagings = [...formData.packagings, newPackagings];
    handleInputChange({
      target: { name: "packagings", value: updatedPackagings },
    });
  };

  const handleRemovePackaging = (index) => {
    const updatedPackagings = formData.packagings.filter(
      (waste, i) => i !== index
    );
    handleInputChange({
      target: { name: "packagings", value: updatedPackagings },
    });
  };

  const handlePackagingChange = (index, field, value) => {
    const updatedPackagings = formData.packagings.map((packaging, i) => {
      if (i !== index) return packaging;

      const packagingItem = packagings.filter(
        (packaging) => packaging.id === value
      );

      // Calculate amount if quantity or unitPrice is updated
      const updatedTransaction = {
        ...packaging,
        [field]: value,
        ...(field === "id" && packagingItem.length > 0
          ? {
              unit: packagingItem[0].unit,
              remaining: packagingItem[0].updatedQuantity,
              unitPrice: packagingItem[0].unitPrice,
            }
          : {}),
      };

      if (field === "quantity" || field === "unitPrice") {
        formData.packagingCost -= updatedTransaction.amount;
        formData.totalCost -= updatedTransaction.amount;
        const quantity = parseFloat(updatedTransaction.quantity) || 0;
        const unitPrice = parseFloat(updatedTransaction.unitPrice) || 0;
        updatedTransaction.amount = quantity * unitPrice;
        formData.packagingCost += quantity * unitPrice;
        formData.totalCost += quantity * unitPrice;
      }

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "packagings", value: updatedPackagings },
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
          <Grid item xs={12} lg={3}>
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
              <Grid item xs={12} lg={3}>
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
                      handleIngredientChange(index, "id", e.target.value)
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
              <Grid item xs={12} lg={1}>
                <TextField
                  label="Unit"
                  name={`ingredients[${index}].unit`}
                  value={ingredient.unit || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
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
              <Grid item xs={12} lg={2}>
                <TextField
                  label="Available Stock"
                  name={`ingredients[${index}].remaining`}
                  value={ingredient.remaining || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "remaining", e.target.value)
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
              <Grid item xs={12} lg={2}>
                <TextField
                  label="Unit Price"
                  name={`ingredients[${index}].unitPrice`}
                  value={ingredient.unitPrice || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "unitPrice", e.target.value)
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
              <Grid item xs={12} lg={1.5}>
                <TextField
                  label="Quantity"
                  name={`ingredients[${index}].quantity`}
                  value={ingredient.quantity || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
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
              <Grid item xs={12} lg={2}>
                <TextField
                  label="Amount"
                  name={`ingredients[${index}].amount`}
                  value={ingredient.amount || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
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
              <Grid item xs={12} lg={0.5} textAlign="right">
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
          Packaging and Labeling
        </Typography>
        {formData.packagings?.map((packaging, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Packaging and Labeling #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={3}>
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
                    name={`packagings[${index}].id`}
                    value={packaging.id || ""}
                    onChange={(e) =>
                      handlePackagingChange(index, "id", e.target.value)
                    }
                    fullWidth
                    inputProps={{
                      name: `id`,
                      id: `id`,
                    }}
                  >
                    {packagings.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={1}>
                <TextField
                  label="Unit"
                  name={`packagings[${index}].unit`}
                  value={packaging.unit || ""}
                  onChange={(e) =>
                    handlePackagingChange(index, "unit", e.target.value)
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
              <Grid item xs={12} lg={2}>
                <TextField
                  label="Available Stock"
                  name={`packagings[${index}].remaining`}
                  value={packaging.remaining || ""}
                  onChange={(e) =>
                    handlePackagingChange(index, "remaining", e.target.value)
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
              <Grid item xs={12} lg={2}>
                <TextField
                  label="Unit Price"
                  name={`packagings[${index}].unitPrice`}
                  value={packaging.unitPrice || ""}
                  onChange={(e) =>
                    handlePackagingChange(index, "unitPrice", e.target.value)
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
              <Grid item xs={12} lg={1.5}>
                <TextField
                  label="Quantity"
                  name={`packagings[${index}].quantity`}
                  value={packaging.quantity || ""}
                  onChange={(e) =>
                    handlePackagingChange(index, "quantity", e.target.value)
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
              <Grid item xs={12} lg={2}>
                <TextField
                  label="Amount"
                  name={`packagings[${index}].amount`}
                  value={packaging.amount || ""}
                  onChange={(e) =>
                    handlePackagingChange(index, "amount", e.target.value)
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
              <Grid item xs={12} lg={0.5} textAlign="right">
                <IconButton
                  color="error"
                  onClick={() => handleRemovePackaging(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center">
          <IconButton color="success" onClick={handleAddPackaging}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2}>
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
          <Grid item xs={12} lg={2}>
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
          <Grid item xs={12} lg={2}>
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
          <Grid item xs={12} lg={2}>
            <TextField
              label="Utilities Cost"
              name="utilitiesCost"
              value={formData.utilitiesCost}
              onChange={handleInputChange}
              type="number"
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
          <Grid item xs={12} lg={2}>
            <TextField
              label="Labor Cost"
              name="laborCost"
              value={formData.laborCost}
              onChange={handleInputChange}
              type="number"
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
          <Grid item xs={12} lg={2}>
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
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>
          Output
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2}>
            <FormControl fullWidth required>
              <InputLabel
                style={{
                  color: colors.grey[100],
                }}
              >
                Output Type
              </InputLabel>
              <Select
                labelId={`outputType`}
                name={`outputType`}
                value={formData.outputType || ""}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  name: `outputType`,
                  id: `outputType`,
                }}
              >
                <MenuItem key={"INGREDIENT"} value={"INGREDIENT"}>
                  {"INGREDIENT"}
                </MenuItem>
                <MenuItem key={"PRODUCT"} value={"PRODUCT"}>
                  {"PRODUCT"}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.outputType === "PRODUCT" && (
            <Grid item xs={12} lg={4}>
              <FormControl fullWidth required>
                <InputLabel
                  style={{
                    color: colors.grey[100],
                  }}
                >
                  Product
                </InputLabel>
                <Select
                  labelId={`outputTypeId`}
                  name={`outputTypeId`}
                  value={formData.outputTypeId || ""}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{
                    name: `outputTypeId`,
                    id: `outputTypeId`,
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
          )}
          {formData.outputType === "INGREDIENT" && (
            <Grid item xs={12} lg={4}>
              <FormControl fullWidth required>
                <InputLabel
                  style={{
                    color: colors.grey[100],
                  }}
                >
                  Ingredient
                </InputLabel>
                <Select
                  labelId={`outputTypeId`}
                  name={`outputTypeId`}
                  value={formData.outputTypeId || ""}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{
                    name: `outputTypeId`,
                    id: `outputTypeId`,
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
          )}
          <Grid item xs={12} lg={1}>
            <TextField
              label="Yield"
              name="yield"
              value={formData.yield}
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
          <Grid item xs={12} lg={1}>
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
                name={`unit`}
                value={formData.unit || ""}
                onChange={handleInputChange}
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
          <Grid item xs={12} lg={2}>
            <TextField
              label="Unit Price"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              type="number"
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
          <Grid item xs={12} lg={2}>
            <TextField
              label="Gross Income"
              name="grossIncome"
              value={formData.grossIncome}
              onChange={handleInputChange}
              type="number"
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
