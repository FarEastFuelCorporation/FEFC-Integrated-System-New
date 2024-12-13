import React from "react";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import {
  timestampDate,
  formatWeight,
  formatDate4,
  formatTime2,
  formatNumber,
} from "../Functions";

const WarehousedOutTransaction = ({ row, user, handleDeleteClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Extract received transaction data
  const receivedTransaction =
    row?.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};

  const warehousedTransaction =
    receivedTransaction.WarehousedTransaction?.[0] || {};

  const warehousedOutTransaction =
    receivedTransaction?.WarehousedTransaction?.[0]
      ?.WarehousedOutTransaction?.[0] || {};

  const warehousedTransactionItem =
    warehousedTransaction?.WarehousedTransactionItem
      ? warehousedTransaction?.WarehousedTransactionItem.sort((a, b) =>
          a.description.localeCompare(b.description)
        ).map((item) => ({
          ...item,
          WarehousedTransactionItemToOut:
            item.WarehousedTransactionItemToOut.map((child) => ({
              ...child,
              bookedTransactionId: row.id, // Assuming `row.id` is available
            })),
        }))
      : [];

  const rowHeight = 52; // Default row height in Material-UI DataGrid
  const headerHeight = 56; // Default header height

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "warehousedOutDate",
      headerName: "Warehoused Out Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return formatDate4(
          params.row.WarehousedOutTransaction.warehousedOutDate
        );
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "warehousedOutTime",
      headerName: "Warehoused Out Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return formatTime2(
          params.row.WarehousedOutTransaction.warehousedOutTime
        );
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "quantity",
      headerName: "Qty",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      valueGetter: (params) => {
        return formatNumber(params.row.quantity);
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  if (user?.userType === 15) {
    columns.push({
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
          <DeleteIcon />
        </IconButton>
      ),
    });
  }

  return (
    <Box>
      {row.statusId === 6 ? (
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
              For Warehouse Out
            </Typography>
          </Box>
          <Typography variant="subtitle1" gutterBottom>
            Warehoused Out Items
          </Typography>

          {warehousedTransactionItem &&
            warehousedTransactionItem.length > 0 &&
            warehousedTransactionItem.map((transaction, index) => {
              const warehousedTransactionOutItemHeight =
                transaction.WarehousedTransactionItemToOut.length === 0
                  ? rowHeight + headerHeight
                  : transaction.WarehousedTransactionItemToOut.length *
                      rowHeight +
                    headerHeight;

              return (
                <Box key={index}>
                  <Typography variant="subtitle1" gutterBottom>
                    {transaction.description}
                  </Typography>
                  <DataGrid
                    sx={{
                      "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard": {
                        height: warehousedTransactionOutItemHeight,
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
                      transaction.WarehousedTransactionItemToOut
                        ? transaction.WarehousedTransactionItemToOut
                        : []
                    }
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => (row.id ? row.id : [])}
                    localeText={{
                      noRowsLabel: "No Warehoused Out Transactions",
                    }}
                    initialState={{
                      sortModel: [
                        { field: "treatedDate", sort: "asc" },
                        { field: "treatedTime", sort: "asc" },
                        { field: "machineName", sort: "asc" },
                      ],
                    }}
                  />
                </Box>
              );
            })}

          <br />
          <Typography variant="h5">
            Batch Weight: {formatWeight(receivedTransaction.netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {warehousedOutTransaction?.remarks
              ? warehousedOutTransaction?.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Sorted By:{" "}
            {`${warehousedOutTransaction?.Employee?.firstName || ""} ${
              warehousedOutTransaction?.Employee?.lastName || ""
            }`}
          </Typography>
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
                Warehoused Out
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
                {warehousedOutTransaction.createdAt
                  ? timestampDate(warehousedOutTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" gutterBottom>
            Warehoused Out Items
          </Typography>

          {warehousedTransactionItem &&
            warehousedTransactionItem.length > 0 &&
            warehousedTransactionItem.map((transaction, index) => {
              const warehousedTransactionOutItemHeight =
                transaction.WarehousedTransactionItemToOut.length === 0
                  ? rowHeight + headerHeight
                  : transaction.WarehousedTransactionItemToOut.length *
                      rowHeight +
                    headerHeight;

              return (
                <Box key={index}>
                  <Typography variant="subtitle1" gutterBottom>
                    {transaction.description}
                  </Typography>
                  <DataGrid
                    sx={{
                      "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard": {
                        height: warehousedTransactionOutItemHeight,
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
                      transaction.WarehousedTransactionItemToOut
                        ? transaction.WarehousedTransactionItemToOut
                        : []
                    }
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => (row.id ? row.id : [])}
                    localeText={{
                      noRowsLabel: "No Warehoused Out Transactions",
                    }}
                    initialState={{
                      sortModel: [
                        { field: "treatedDate", sort: "asc" },
                        { field: "treatedTime", sort: "asc" },
                        { field: "machineName", sort: "asc" },
                      ],
                    }}
                  />
                </Box>
              );
            })}

          <br />
          <Typography variant="h5">
            Batch Weight: {formatWeight(receivedTransaction?.netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {warehousedOutTransaction?.remarks
              ? warehousedOutTransaction?.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Sorted By:{" "}
            {`${warehousedOutTransaction?.Employee?.firstName || ""} ${
              warehousedOutTransaction?.Employee?.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default WarehousedOutTransaction;
