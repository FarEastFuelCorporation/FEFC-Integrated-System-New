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

  // Filter and sort packaging items
  const packagingItems = packagings
    .filter(
      (item) =>
        item.transactionCategory === "PACKAGING AND LABELING" &&
        (formData.id || item.updatedQuantity !== 0)
    )
    .sort((a, b) => a.item.localeCompare(b.item));

  // Filter and sort ingredient items
  const ingredientItems = ingredients
    .filter(
      (item) =>
        item.transactionCategory === "INGREDIENTS" &&
        (formData.id || item.updatedQuantity !== 0)
    )
    .sort((a, b) => a.item.localeCompare(b.item));

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

      console.log(ingredientItem);

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

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "packagings", value: updatedPackagings },
    });
  };

  const handleAddEquipment = () => {
    const newEquipments = {
      id: "",
      unit: "",
      remaining: "",
      unitPrice: "",
      quantity: "",
      amount: 0,
      remarks: "",
    };
    const updatedEquipments = [...formData.equipments, newEquipments];
    handleInputChange({
      target: { name: "equipments", value: updatedEquipments },
    });
  };

  const handleRemoveEquipment = (index) => {
    const updatedEquipments = formData.equipments.filter(
      (waste, i) => i !== index
    );
    handleInputChange({
      target: { name: "equipments", value: updatedEquipments },
    });
  };

  const handleEquipmentChange = (index, field, value) => {
    const updatedEquipments = formData.equipments.map((equipment, i) => {
      if (i !== index) return equipment;

      const equipmentItem = equipments.filter(
        (equipment) => equipment.id === value
      );

      // Calculate amount if quantity or unitPrice is updated
      const updatedTransaction = {
        ...equipment,
        [field]: value,
        ...(field === "id" && equipmentItem.length > 0
          ? {
              remaining: equipmentItem[0].updatedAmount,
              unitPrice: equipmentItem[0].amount,
              amount: 0,
            }
          : {}),
      };

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "equipments", value: updatedEquipments },
    });
  };

  const handleAddOutput = () => {
    const newOutputs = {
      id: "",
      unit: "",
      remaining: "",
      unitPrice: "",
      quantity: "",
      amount: 0,
      remarks: "",
    };
    const updatedOutputs = [...formData.outputs, newOutputs];
    handleInputChange({
      target: { name: "outputs", value: updatedOutputs },
    });
  };

  const handleRemoveOutput = (index) => {
    const updatedOutputs = formData.outputs.filter((waste, i) => i !== index);
    handleInputChange({
      target: { name: "outputs", value: updatedOutputs },
    });
  };

  const handleOutputChange = (index, field, value) => {
    const updatedOutputs = formData.outputs.map((output, i) => {
      if (i !== index) return output;

      // Calculate amount if quantity or unitPrice is updated
      const updatedTransaction = {
        ...output,
        [field]: value,
      };

      if (updatedTransaction.outputType === "PRODUCT") {
        updatedTransaction.unit = "PC";
      }

      if (field === "outputType") {
        updatedTransaction.id = "";
        updatedTransaction.quantity = "";
        updatedTransaction.unitPrice = "";
      }

      return updatedTransaction;
    });

    handleInputChange({
      target: { name: "outputs", value: updatedOutputs },
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
                    {ingredientItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        ({item.id}) {item.item}
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
                  value={(ingredient.remaining || 0).toFixed(5)}
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
                  disabled={!ingredient.id}
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
                    {packagingItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        ({item.id}) {item.item}
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
                  value={(packaging.remaining || 0).toFixed(5)}
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
                  disabled={!packaging.id}
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
          Equipments
        </Typography>
        {formData.equipments?.map((equipment, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Equipment #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={3}>
                <FormControl fullWidth required>
                  <InputLabel
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Equipment
                  </InputLabel>
                  <Select
                    labelId={`id`}
                    name={`equipments[${index}].id`}
                    value={equipment.id || ""}
                    onChange={(e) =>
                      handleEquipmentChange(index, "id", e.target.value)
                    }
                    fullWidth
                    inputProps={{
                      name: `id`,
                      id: `id`,
                    }}
                  >
                    {equipments
                      .sort((a, b) =>
                        a.equipmentName.localeCompare(b.equipmentName)
                      )
                      .map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.equipmentName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={3}>
                <TextField
                  label="Available Amount"
                  name={`equipments[${index}].remaining`}
                  value={equipment.remaining || ""}
                  onChange={(e) =>
                    handleEquipmentChange(index, "remaining", e.target.value)
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
                  name={`equipments[${index}].unitPrice`}
                  value={equipment.unitPrice || ""}
                  onChange={(e) =>
                    handleEquipmentChange(index, "unitPrice", e.target.value)
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
              <Grid item xs={12} lg={3.5}>
                <TextField
                  label="Amount"
                  name={`equipments[${index}].amount`}
                  value={equipment.amount || 0}
                  onChange={(e) =>
                    handleEquipmentChange(index, "amount", e.target.value)
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
              <Grid item xs={12} lg={0.5} textAlign="right">
                <IconButton
                  color="error"
                  onClick={() => handleRemoveEquipment(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center">
          <IconButton color="success" onClick={handleAddEquipment}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={11.5 / 5}>
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
          <Grid item xs={12} lg={11.5 / 5}>
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
          <Grid item xs={12} lg={11.5 / 5}>
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
          <Grid item xs={12} lg={11.5 / 5}>
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
          <Grid item xs={12} lg={11.5 / 5}>
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
        </Grid>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>
          Output
        </Typography>
        {formData.outputs?.map((output, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Output #{index + 1}
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
                    name={`outputs[${index}].outputType`}
                    value={output.outputType || ""}
                    onChange={(e) =>
                      handleOutputChange(index, "outputType", e.target.value)
                    }
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
                    <MenuItem
                      key={"PACKAGING AND LABELING"}
                      value={"PACKAGING AND LABELING"}
                    >
                      {"PACKAGING AND LABELING"}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {output.outputType === "PRODUCT" && (
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
                      labelId={`id`}
                      name={`outputs[${index}].id`}
                      value={output.id || ""}
                      onChange={(e) =>
                        handleOutputChange(index, "id", e.target.value)
                      }
                      fullWidth
                      inputProps={{
                        name: `id`,
                        id: `id`,
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
              {output.outputType === "INGREDIENT" && (
                <Grid item xs={12} lg={4}>
                  <TextField
                    label="Ingredient"
                    name={`outputs[${index}].id`}
                    value={output.id || ""}
                    onChange={(e) =>
                      handleOutputChange(index, "id", e.target.value)
                    }
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
              )}
              {output.outputType === "PACKAGING AND LABELING" && (
                <Grid item xs={12} lg={4}>
                  <TextField
                    label="Packaging and Labeling"
                    name={`outputs[${index}].id`}
                    value={output.id || ""}
                    onChange={(e) =>
                      handleOutputChange(index, "id", e.target.value)
                    }
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
              )}
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
                    name={`outputs[${index}].unit`}
                    value={output.unit || ""}
                    onChange={(e) =>
                      handleOutputChange(index, "unit", e.target.value)
                    }
                    fullWidth
                    disabled={output.outputType === "PRODUCT"}
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
              <Grid item xs={12} lg={1}>
                <TextField
                  label="Quantity"
                  name={`outputs[${index}].quantity`}
                  value={output.quantity || ""}
                  onChange={(e) =>
                    handleOutputChange(index, "quantity", e.target.value)
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
                  label="Unit Price"
                  name={`outputs[${index}].unitPrice`}
                  value={output.unitPrice || ""}
                  onChange={(e) =>
                    handleOutputChange(index, "unitPrice", e.target.value)
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
              <Grid item xs={12} lg={1.5}>
                <TextField
                  label="Amount"
                  name={`outputs[${index}].amount`}
                  value={output.amount || 0}
                  onChange={(e) =>
                    handleOutputChange(index, "amount", e.target.value)
                  }
                  fullWidth
                  disabled
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
              <Grid item xs={12} lg={0.5} textAlign="right">
                <IconButton
                  color="error"
                  onClick={() => handleRemoveOutput(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center">
          <IconButton color="success" onClick={handleAddOutput}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        <Grid container spacing={2}></Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2}>
            <TextField
              label="Gross Income"
              name="grossIncome"
              value={formData.grossIncome}
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
          <Grid item xs={12} lg={2}>
            <TextField
              label="Net Income"
              name="netIncome"
              value={formData.netIncome}
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
              label="Profit Margin (%)"
              name="profitMargin"
              value={formData.profitMargin}
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
