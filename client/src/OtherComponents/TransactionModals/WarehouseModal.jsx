import React, { forwardRef, useCallback, useEffect, useState } from "react";
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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { tokens } from "../../theme";
import axios from "axios";

const WarehouseModal = forwardRef(
  (
    {
      open,
      onClose,
      formData,
      setFormData,
      handleFormSubmit,
      errorMessage,
      showErrorMessage,
      setIsDiscrepancy,
      isDiscrepancy,
      refs,
    },
    ref
  ) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {
      warehousedDateRef,
      warehousedTimeRef,
      warehousedItemsRef,
      remarksRef,
    } = refs;

    const [quotations, setQuotations] = useState([]);

    useEffect(() => {
      if (open) {
        const fetchData = async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const [quotationsResponse] = await Promise.all([
              axios.get(`${apiUrl}/api/quotation/${formData.clientId}`),
            ]);

            setQuotations(quotationsResponse.data.quotations);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      }
    }, [open, formData.clientId]);

    useEffect(() => {
      const totalWarehousedWeight = calculateTotalWarehousedWeight(
        formData.warehousedItems
      );
      const discrepancyWeight = calculateDiscrepancyWeight(
        parseFloat(formData.batchWeight || 0),
        totalWarehousedWeight
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        totalWarehousedWeight,
        discrepancyWeight,
      }));
      if (discrepancyWeight === 0) {
        setIsDiscrepancy(false);
      } else {
        setIsDiscrepancy(true);
      }
    }, [
      formData.warehousedItems,
      formData.batchWeight,
      setFormData,
      setIsDiscrepancy,
    ]);

    const calculateTotalWarehousedWeight = (warehousedItems) => {
      const totalWarehousedWasteWeight = warehousedItems.reduce(
        (total, waste) => {
          return total + parseFloat(waste.weight || 0);
        },
        0
      );

      return totalWarehousedWasteWeight;
    };

    const calculateDiscrepancyWeight = (batchWeight, totalWarehousedWeight) => {
      return batchWeight - totalWarehousedWeight;
    };

    const handleItemChange = useCallback(
      (index, field, value) => {
        const updatedWarehousedItems = formData.warehousedItems.map(
          (item, i) => {
            return i === index ? { ...item, [field]: value } : item;
          }
        );
        setFormData({
          ...formData,
          warehousedItems: updatedWarehousedItems,
        });
      },
      [formData, setFormData]
    );

    const handleAddItem = () => {
      // Accessing current warehoused items and adding a new one
      const newItem = {
        quotationWasteId: "",
        description: "",
        quantity: 0,
        weight: 0,
        clientWeight: 0,
        gatePass: "",
        warehouse: "",
        area: "",
        section: "",
        level: "",
        palletNumber: "",
        steamNumber: "",
        unit: "",
      };

      warehousedItemsRef.current = [...warehousedItemsRef.current, newItem];
      setFormData((prev) => ({
        ...prev,
        warehousedItems: [...prev.warehousedItems, newItem],
      }));
    };

    const handleRemoveItem = (index) => {
      const updatedItems = warehousedItemsRef.current.filter(
        (_, i) => i !== index
      );

      warehousedItemsRef.current = updatedItems;

      setFormData((prev) => ({
        ...prev,
        warehousedItems: prev.warehousedItems.filter((_, i) => i !== index),
      }));
    };

    const handleCategoryChange = (index, value) => {
      // Find the selected waste item from quotations
      let selectedWaste = null;
      for (const quotation of quotations) {
        selectedWaste = quotation.QuotationWaste.find(
          (waste) => waste.id === value
        );
        if (selectedWaste) break;
      }

      const wasteName = selectedWaste ? selectedWaste.wasteName : "";

      // Update the ref
      const itemRef = warehousedItemsRef.current[index];
      if (itemRef) {
        itemRef.quotationWasteId = value;
      }

      // Update form data state
      setFormData((prev) => ({
        ...prev,
        warehousedItems: prev.warehousedItems.map((item, idx) =>
          idx === index
            ? {
                ...item,
                quotationWasteId: value,
                description: wasteName, // set description as wasteName
              }
            : item
        ),
      }));

      // Update DOM elements directly if needed
      const quotationWasteId = document.querySelector(
        `#quotationWasteId-${index}`
      );
      const description = document.querySelector(`#description-${index}`);
      if (quotationWasteId) quotationWasteId.value = value;
      if (description) description.value = wasteName;
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
                ? "Update Warehoused In Transaction"
                : "Warehouse In Transaction"}
            </Typography>
            <Typography variant="h6" component="h2" color="error">
              {showErrorMessage && errorMessage}
            </Typography>
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <TextField
                label="Warehouse In Date"
                inputRef={warehousedDateRef}
                defaultValue={formData.warehousedDate}
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
                label="Warehouse In Time"
                inputRef={warehousedTimeRef}
                defaultValue={formData.warehousedTime}
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
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Batch Weight"
                  name={`batchWeight`}
                  value={formData.batchWeight}
                  type="number"
                  fullWidth
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Total Warehoused Weight"
                  name={`totalWarehousedWeight`}
                  value={formData.totalWarehousedWeight}
                  type="number"
                  fullWidth
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Discrepancy Weight"
                  name={`discrepancyWeight`}
                  value={formData.discrepancyWeight}
                  type="number"
                  fullWidth
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                  disabled
                />
              </Grid>
            </Grid>

            {/* Warehoused Items */}
            <Grid item xs={12} ref={ref}>
              <h3>Warehoused Items</h3>
              {warehousedItemsRef.current.map((item, index) => (
                <Box key={index} id="item">
                  <Typography my={1}>Item {index + 1}</Typography>
                  <Box id={`warehoused-item-${index}`}>
                    <Grid container spacing={2}>
                      <TextField
                        name={`id-${index}`}
                        id={`id-${index}`}
                        label="Id"
                        defaultValue={item.id}
                        fullWidth
                        autoComplete="off"
                        style={{ display: "none" }}
                      />
                      <Grid item xs={2.75}>
                        <FormControl fullWidth>
                          <InputLabel
                            id={`waste-type-select-label-${index}`}
                            sx={{
                              "&.MuiInputLabel-shrink": {
                                color: colors.grey[100], // color when shrunk
                              },
                            }}
                          >
                            Category
                          </InputLabel>
                          <Select
                            labelId={`waste-type-select-label-${index}`}
                            id={`quotationWasteId-${index}`}
                            name={`quotationWasteId-${index}`}
                            value={
                              formData?.warehousedItems[index]
                                ?.quotationWasteId || ""
                            }
                            onChange={(e) =>
                              handleCategoryChange(index, e.target.value)
                            }
                            label="Category"
                            fullWidth
                            required
                            disabled={formData.statusId === 4}
                          >
                            {quotations.map((quotation) =>
                              quotation.QuotationWaste.filter(
                                (waste) =>
                                  !["AHW", "ANHW", "AHNHW"].includes(
                                    waste.TypeOfWaste.wasteCode
                                  ) // Exclude these codes
                              ).map((waste) => (
                                <MenuItem key={waste.id} value={waste.id}>
                                  {waste.wasteName} {"("}
                                  {waste.TypeOfWaste.wasteCode}
                                  {")"} - {waste.unit}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={2.75}>
                        <TextField
                          name={`description-${index}`}
                          id={`description-${index}`}
                          label="Description"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          autoComplete="off"
                          defaultValue={item.description}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1.5}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`unit-label-${index}`}
                            sx={{
                              "&.MuiInputLabel-shrink": {
                                color: colors.grey[100], // color when shrunk
                              },
                            }}
                          >
                            Unit
                          </InputLabel>
                          <Select
                            name={`unit-${index}`}
                            defaultValue={item.unit}
                            labelId={`unit-label-${index}`}
                            shrink
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>Select</em>
                            </MenuItem>
                            <MenuItem value="KG">KG</MenuItem>
                            <MenuItem value="PC">PC</MenuItem>
                            <MenuItem value="CASE">CASE</MenuItem>
                            <MenuItem value="JUMBO">JUMBO</MenuItem>
                            <MenuItem value="POLYSACK">POLYSACK</MenuItem>
                            <MenuItem value="PALLET">PALLET</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1.5}>
                        <TextField
                          name={`quantity-${index}`}
                          label="Quantity"
                          type="number"
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          fullWidth
                          required
                          defaultValue={item.quantity}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1.5}>
                        <TextField
                          name={`weight-${index}`}
                          label="Weight"
                          type="number"
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          fullWidth
                          required
                          defaultValue={item.weight}
                          onChange={(e) =>
                            handleItemChange(index, `weight`, e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1.5}>
                        <TextField
                          name={`clientWeight-${index}`}
                          label="Client Weight"
                          type="number"
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          fullWidth
                          required
                          defaultValue={item.clientWeight}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={0.5}>
                        <IconButton
                          onClick={() => handleRemoveItem(index)}
                          color="error"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <TextField
                          name={`gatePass-${index}`}
                          label="Gate Pass"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          autoComplete="off"
                          defaultValue={item.gatePass}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`warehouse-label-${index}`}
                            sx={{
                              "&.MuiInputLabel-shrink": {
                                color: colors.grey[100], // color when shrunk
                              },
                            }}
                          >
                            Warehouse
                          </InputLabel>
                          <Select
                            name={`warehouse-${index}`}
                            defaultValue={item.warehouse}
                            labelId={`warehouse-label-${index}`}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>Select</em>
                            </MenuItem>
                            <MenuItem value="WAREHOUSE 1">WAREHOUSE 1</MenuItem>
                            <MenuItem value="WAREHOUSE 2">WAREHOUSE 2</MenuItem>
                            <MenuItem value="WAREHOUSE 3">WAREHOUSE 3</MenuItem>
                            <MenuItem value="WAREHOUSE A">WAREHOUSE A</MenuItem>
                            <MenuItem value="WAREHOUSE B">WAREHOUSE B</MenuItem>
                            <MenuItem value="WAREHOUSE C">WAREHOUSE C</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`area-label-${index}`}
                            sx={{
                              "&.MuiInputLabel-shrink": {
                                color: colors.grey[100], // color when shrunk
                              },
                            }}
                          >
                            Area
                          </InputLabel>
                          <Select
                            name={`area-${index}`}
                            defaultValue={item.area}
                            labelId={`area-label-${index}`}
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              <em>Select</em>
                            </MenuItem>
                            {/* New options */}
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="B">B</MenuItem>
                            <MenuItem value="C">C</MenuItem>
                            <MenuItem value="D">D</MenuItem>
                            <MenuItem value="E">E</MenuItem>
                            <MenuItem value="F">F</MenuItem>
                            <MenuItem value="G">G</MenuItem>
                            <MenuItem value="H">H</MenuItem>
                            <MenuItem value="I">I</MenuItem>
                            <MenuItem value="J">J</MenuItem>
                            <MenuItem value="K">K</MenuItem>
                            <MenuItem value="L">L</MenuItem>
                            <MenuItem value="M">M</MenuItem>
                            <MenuItem value="N">N</MenuItem>
                            <MenuItem value="O">O</MenuItem>
                            <MenuItem value="P">P</MenuItem>
                            <MenuItem value="Q">Q</MenuItem>
                            <MenuItem value="R">R</MenuItem>
                            <MenuItem value="S">S</MenuItem>
                            <MenuItem value="T">T</MenuItem>
                            <MenuItem value="U">U</MenuItem>
                            <MenuItem value="V">V</MenuItem>
                            <MenuItem value="W">W</MenuItem>
                            <MenuItem value="X">X</MenuItem>
                            <MenuItem value="Y">Y</MenuItem>
                            <MenuItem value="Z">Z</MenuItem>
                            <MenuItem value="AA">AA</MenuItem>
                            <MenuItem value="AB">AB</MenuItem>
                            <MenuItem value="AC">AC</MenuItem>
                            <MenuItem value="AD">AD</MenuItem>
                            <MenuItem value="AE">AE</MenuItem>
                            <MenuItem value="AF">AF</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`section-label-${index}`}
                            sx={{
                              "&.MuiInputLabel-shrink": {
                                color: colors.grey[100], // color when shrunk
                              },
                            }}
                          >
                            Section
                          </InputLabel>
                          <Select
                            name={`section-${index}`}
                            defaultValue={item.section}
                            labelId={`section-label-${index}`}
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              <em>Select</em>
                            </MenuItem>
                            {/* New options */}
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                            <MenuItem value="5">5</MenuItem>
                            <MenuItem value="6">6</MenuItem>
                            <MenuItem value="7">7</MenuItem>
                            <MenuItem value="8">8</MenuItem>
                            <MenuItem value="9">9</MenuItem>
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="11">11</MenuItem>
                            <MenuItem value="12">12</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`level-label-${index}`}
                            sx={{
                              "&.MuiInputLabel-shrink": {
                                color: colors.grey[100], // color when shrunk
                              },
                            }}
                          >
                            Level
                          </InputLabel>
                          <Select
                            name={`level-${index}`}
                            defaultValue={item.level}
                            labelId={`level-label-${index}`}
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              <em>Select</em>
                            </MenuItem>
                            {/* New options */}
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                            <MenuItem value="5">5</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <TextField
                          name={`palletNumber-${index}`}
                          label="Pallet #"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          autoComplete="off"
                          defaultValue={item.palletNumber}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <TextField
                          name={`steamNumber-${index}`}
                          label="Steam Number"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          autoComplete="off"
                          defaultValue={item.steamNumber}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={12 / 8}>
                        <TextField
                          name={`duration-${index}`}
                          label="Duration (Days)"
                          type="number"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                          autoComplete="off"
                          defaultValue={item.duration}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ))}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box mt={2}>
                  <Button
                    onClick={handleAddItem}
                    startIcon={<AddIcon />}
                    variant="contained"
                  >
                    Add Item
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {isDiscrepancy && (
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
            )}
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

export default WarehouseModal;
