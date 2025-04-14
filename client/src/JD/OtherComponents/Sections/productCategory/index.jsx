import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  Card,
  Tabs,
  Tab,
  Badge,
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
import { ModalJD, ModalJD2 } from "./Modal";
import { Validation, Validation2 } from "./Validation";
import { renderCellWithWrapText } from "../../Functions";

const ProductCategoryJD = ({ user, socket }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    productCategory: "",
    createdBy: user.id,
  };

  const initialFormData2 = {
    id: "",
    productCategoryId: "",
    productName: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formData2, setFormData2] = useState(initialFormData2);

  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const responseProductCategory = await axios.get(
        `${apiUrl}/apiJD/productCategory`
      );

      const responseProduct = await axios.get(`${apiUrl}/apiJD/product`);

      setProductCategories(responseProductCategory.data.productCategory);

      setProducts(responseProduct.data.product);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "NEW_PRODUCT_CATEGORY_JD") {
          setProductCategories((prevData) => [...prevData, message.data]);
        } else if (message.type === "UPDATED_PRODUCT_CATEGORY_JD") {
          setProductCategories((prevData) => {
            // Find the index of the data to be updated
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              // Replace the updated data data
              const updatedData = [...prevData];
              updatedData[index] = message.data; // Update the data at the found index
              return updatedData;
            } else {
              // If the data is not found, just return the previous state
              return prevData;
            }
          });
          setProducts((prevData) =>
            prevData.map((product) =>
              product.productCategoryId === message.data.id
                ? {
                    ...product,
                    ProductCategoryJD: {
                      ...product.ProductCategoryJD,
                      productCategory: message.data.productCategory,
                    },
                  }
                : product
            )
          );
        } else if (message.type === "DELETED_PRODUCT_CATEGORY_JD") {
          setProductCategories((prevData) => {
            const updatedData = prevData.filter(
              (prev) => prev.id !== message.data // Remove the data with matching ID
            );
            return updatedData;
          });
        } else if (message.type === "NEW_PRODUCT_JD") {
          const newProduct = message.data;
          const newCategory = newProduct.ProductCategoryJD?.productCategory;

          // 1. Add new product
          setProducts((prevData) => [...prevData, newProduct]);

          // 2. Update category count if it exists
          setProductCategories((prevCategories) =>
            prevCategories.map((category) => {
              if (category.productCategory === newCategory) {
                return {
                  ...category,
                  productCount: (category.productCount || 0) + 1,
                };
              }
              return category;
            })
          );
        } else if (message.type === "UPDATED_PRODUCT_JD") {
          setProducts((prevData) => {
            // Find the index of the data to be updated
            const index = prevData.findIndex(
              (prev) => prev.id === message.data.id
            );

            if (index !== -1) {
              // Replace the updated data data
              const updatedData = [...prevData];
              updatedData[index] = message.data; // Update the data at the found index
              return updatedData;
            } else {
              // If the data is not found, just return the previous state
              return prevData;
            }
          });
        } else if (message.type === "DELETED_PRODUCT_JD") {
          setProducts((prevData) => {
            const deletedProduct = prevData.find((p) => p.id === message.data); // message.data is ID
            const deletedCategory =
              deletedProduct?.ProductCategoryJD?.productCategory;

            // 1. Update product list (remove the deleted product)
            const updatedProducts = prevData.filter(
              (p) => p.id !== message.data
            );

            // 2. Update product category count
            setProductCategories((prevCategories) =>
              prevCategories.map((category) => {
                if (category.productCategory === deletedCategory) {
                  return {
                    ...category,
                    productCount: Math.max((category.productCount || 0) - 1, 0),
                  };
                }
                return category;
              })
            );

            return updatedProducts;
          });
        }
      };
    }
  }, [socket]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage("");
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
    setFormData2(initialFormData2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
  };

  const handleEditClick = (row) => {
    if (row) {
      setFormData({
        id: row.id,
        productCategory: row.productCategory,
        createdBy: user.id,
      });

      setFormData2({
        id: row.id,
        productCategoryId: row.productCategoryId,
        productName: row.productName,
        createdBy: user.id,
      });

      handleOpenModal();
    } else {
      console.error(
        `Product Category with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = (id) => {
    const message =
      selectedTab === 1
        ? `Are you sure you want to Delete this Product Category?`
        : `Are you sure you want to Delete this Product?`;

    setOpenDialog(true);
    setDialog(message);
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    const url = selectedTab === 1 ? "productCategory" : "product";
    const message =
      selectedTab === 1
        ? "Product Category Deleted Successfully!"
        : "Product Deleted Successfully!";

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/apiJD/${url}/${id}`, {
        data: { deletedBy: user.id },
      });

      setSuccessMessage(message);
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = Validation(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing Product Category
        await axios.put(
          `${apiUrl}/apiJD/productCategory/${formData.id}`,
          formData
        );

        setSuccessMessage("Product Category Updated Successfully!");
      } else {
        // Add new Product Category
        await axios.post(`${apiUrl}/apiJD/productCategory`, formData);

        setSuccessMessage("Product Category Added Successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit2 = async (e) => {
    e.preventDefault();

    const validationErrors = Validation2(formData2);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData2.id) {
        // Update existing Product
        await axios.put(`${apiUrl}/apiJD/product/${formData2.id}`, formData2);

        setSuccessMessage("Product Updated Successfully!");
      } else {
        // Add new Product
        await axios.post(`${apiUrl}/apiJD/product`, formData2);

        setSuccessMessage("Product Added Successfully!");
      }

      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "productCategory",
      headerName: "Product Category",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.productCategory;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "productCount",
      headerName: "Product Count",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.productCount || 0;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
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
    },
  ];

  const columns2 = [
    {
      field: "productName",
      headerName: "Product Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "productCategory",
      headerName: "Product Category",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.ProductCategoryJD?.productCategory;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "updatedQuantity",
      headerName: "Stocks",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      valueGetter: (params) => {
        return params.row.updatedQuantity || 0;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
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
    },
  ];

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Products"
          subtitle="List of Products and Product Categories"
        />
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
      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          sx={{
            "& .Mui-selected": {
              backgroundColor: colors.greenAccent[400],
              boxShadow: "none",
              borderBottom: `1px solid ${colors.grey[100]}`,
            },
            "& .MuiTab-root > span": {
              paddingRight: "10px",
            },
          }}
        >
          <Tab
            label={
              <Badge
                // badgeContent={pendingCount}
                color="error"
                max={9999}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Products
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                // badgeContent={pendingCount}
                color="error"
                max={9999}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Product Categories
              </Badge>
            }
          />
        </Tabs>
      </Card>

      <CustomDataGridStyles margin={0}>
        <DataGrid
          rows={selectedTab === 1 ? productCategories : products}
          columns={selectedTab === 1 ? columns : columns2}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel:
                selectedTab === 1
                  ? [{ field: "productCategory", sort: "asc" }]
                  : [{ field: "productName", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      {selectedTab === 1 ? (
        <ModalJD
          user={user}
          open={openModal}
          onClose={handleCloseModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      ) : (
        <ModalJD2
          user={user}
          open={openModal}
          onClose={handleCloseModal}
          formData={formData2}
          handleInputChange={handleInputChange2}
          handleFormSubmit={handleFormSubmit2}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
          productCategories={productCategories}
        />
      )}
    </Box>
  );
};

export default ProductCategoryJD;
