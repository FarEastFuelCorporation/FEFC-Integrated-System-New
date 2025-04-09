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
    field: "equipmentName",
    headerName: "Equipment Name",
    headerAlign: "center",
    align: "center",
    flex: 2,
    minWidth: 250,
    renderCell: renderCellWithWrapText,
  },
  {
    field: "amount",
    headerName: "Original Amount",
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
    field: "updatedAmount",
    headerName: "Depreciated Amount",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
    valueGetter: (params) => {
      return formatNumber(params.row.updatedAmount);
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
        return formatDate3(params.row.EquipmentJD?.transactionDate);
      } else {
        return formatDate3(params.row.transactionDate);
      }
    },
    renderCell: renderCellWithWrapText,
  },
  {
    field: "equipmentName2",
    headerName: "Equipment Name",
    headerAlign: "center",
    align: "center",
    flex: 2,
    minWidth: 250,
    valueGetter: (params) => {
      return params.row.EquipmentJD?.equipmentName;
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
