import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import {
  timestampDate,
  formatWeight,
  formatTime2,
  formatDate4,
} from "../Functions";

const WarehousedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Extract received transaction data
  const receivedTransaction =
    row?.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};

  const warehousedTransaction =
    receivedTransaction.WarehousedTransaction?.[0] || {};

  const warehousedTransactionItem =
    warehousedTransaction.WarehousedTransactionItem
      ? warehousedTransaction.WarehousedTransactionItem.map((item) => ({
          ...item,
          warehousedDate: warehousedTransaction.warehousedDate,
          warehousedTime: warehousedTransaction.warehousedTime,
        })).sort((a, b) => a.description.localeCompare(b.description))
      : [];

  const rowHeight = 52; // Default row height in Material-UI DataGrid
  const headerHeight = 56; // Default header height
  const warehousedTransactionItemHeight =
    warehousedTransactionItem.length * rowHeight + headerHeight;

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "warehousedDate",
      headerName: "Warehoused Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return formatDate4(params.row.warehousedDate);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "warehousedTime",
      headerName: "Warehoused Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return formatTime2(params.row.warehousedTime);
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "description",
      headerName: "Description",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "unit",
      headerName: "Unit",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "quantity",
      headerName: "Qty",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "weight",
      headerName: "Weight",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientWeight",
      headerName: "Client Weight",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "gatePass",
      headerName: "Gate Pass #",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "warehouse",
      headerName: "Warehouse",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "section",
      headerName: "Section",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "area",
      headerName: "Area",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "level",
      headerName: "Level",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "palletNumber",
      headerName: "Pallet #",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "steamNumber",
      headerName: "Steam #",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box>
      {row.statusId === 4 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <WarehouseIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[500]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Warehouse In
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <WarehouseIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
              }}
            />
          </CircleLogo>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color={colors.greenAccent[400]}>
                Warehoused In
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: {
                  xs: "start",
                  md: "end",
                },
              }}
            >
              <Typography variant="h5">
                {warehousedTransaction.createdAt
                  ? timestampDate(warehousedTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" gutterBottom>
            Warehoused Items
          </Typography>
          {warehousedTransactionItem &&
            warehousedTransactionItem.length > 0 && (
              <DataGrid
                sx={{
                  "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard": {
                    height: warehousedTransactionItemHeight,
                  },
                  "& .MuiDataGrid-root": {
                    border: "none",
                    width: "100%",
                  },
                  "& .MuiDataGrid-overlayWrapper": {
                    minHeight: "52px",
                  },
                  "& .name-column--cell": {
                    color: colors.greenAccent[300],
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    whiteSpace: "normal !important",
                    wordWrap: "break-word !important",
                    lineHeight: "1.2 !important",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                  },
                  "& .MuiDataGrid-toolbarContainer": {
                    display: "none",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    display: "none",
                  },
                }}
                rows={
                  warehousedTransactionItem ? warehousedTransactionItem : []
                }
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => (row.id ? row.id : [])}
                localeText={{ noRowsLabel: "No Treated Transactions" }}
                initialState={{
                  sortModel: [
                    { field: "treatedDate", sort: "asc" },
                    { field: "treatedTime", sort: "asc" },
                    { field: "machineName", sort: "asc" },
                  ],
                }}
              />
            )}
          <br />
          <Typography variant="h5">
            Batch Weight: {formatWeight(receivedTransaction.netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Total Warehoused Weight:{" "}
            {formatWeight(warehousedTransaction.totalWarehousedWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Weight:{" "}
            {formatWeight(warehousedTransaction.discrepancyWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Remarks:{" "}
            {warehousedTransaction.remarks
              ? warehousedTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Warehoused In By:{" "}
            {`${warehousedTransaction?.Employee?.firstName || ""} ${
              warehousedTransaction?.Employee?.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default WarehousedTransaction;
