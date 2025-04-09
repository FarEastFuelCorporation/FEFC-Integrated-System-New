// Column.jsx

import {
  formatDate3,
  formatNumber,
  renderCellWithWrapText,
} from "../../Functions";

export const columns = [
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return formatDate3(params.row.transactionDate);
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "item",
    headerName: "Item",
    headerAlign: "center",
    align: "center",
    flex: 2,
    minWidth: 250,
    renderCell: renderCellWithWrapText,
  },

  {
    field: "transactionCategory",
    headerName: "Transaction Category",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 150,
    renderCell: renderCellWithWrapText,
  },
  {
    field: "unit",
    headerName: "Unit",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    renderCell: renderCellWithWrapText,
  },
  {
    field: "updatedQuantity",
    headerName: "Stock",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    renderCell: renderCellWithWrapText,
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return formatNumber(params.row.unitPrice);
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "amount",
    headerName: "Amount",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return formatNumber(params.row.updatedQuantity * params.row.unitPrice);
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "remarks",
    headerName: "Remarks",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 150,
    renderCell: renderCellWithWrapText,
  },
];

export const columns2 = [
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      if (params.row.transaction === "IN") {
        return formatDate3(params.row.InventoryJD?.transactionDate);
      } else {
        return formatDate3(params.row.transactionDate);
      }
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "item2",
    headerName: "Item",
    headerAlign: "center",
    align: "center",
    flex: 2,
    minWidth: 250,
    valueGetter: (params) => {
      return params.row.InventoryJD?.item;
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "transaction",
    headerName: "Transaction",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    renderCell: renderCellWithWrapText,
  },
  {
    field: "transactionCategory2",
    headerName: "Transaction Category",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 150,
    valueGetter: (params) => {
      return params.row.InventoryJD?.transactionCategory;
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "unit2",
    headerName: "Unit",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueGetter: (params) => {
      return params.row.InventoryJD?.unit;
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueGetter: (params) => {
      return params.row.quantity;
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return formatNumber(params.row.InventoryJD?.unitPrice);
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "amount",
    headerName: "Amount",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return formatNumber(
        params.row.quantity * params.row.InventoryJD?.unitPrice
      );
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "remarks",
    headerName: "Remarks",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 150,
    renderCell: renderCellWithWrapText,
  },
];
