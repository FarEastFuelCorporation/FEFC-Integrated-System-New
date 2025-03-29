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
    field: "transaction",
    headerName: "Transaction",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
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
    field: "quantity",
    headerName: "Quantity",
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
      return formatNumber(params.row.amount);
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
