import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, formatWeight } from "../Functions";

const SortedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Extract received transaction data
  const sortedTransaction =
    row?.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
      .SortedTransaction?.[0] || {};

  // Extract received transaction data
  const receivedTransaction =
    row?.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};

  const sortedWasteTransaction = sortedTransaction.SortedWasteTransaction
    ? sortedTransaction.SortedWasteTransaction.map((item) => ({
        ...item,
        sortedDate: sortedTransaction.sortedDate,
        sortedTime: sortedTransaction.sortedTime,
      }))
        .filter((item) => item.weight > 0) // Remove items with weight 0
        .sort((a, b) => a.wasteName.localeCompare(b.wasteName))
    : [];

  const sortedScrapTransaction = sortedTransaction.SortedScrapTransaction
    ? sortedTransaction.SortedScrapTransaction.map((item) => ({
        ...item,
        sortedDate: sortedTransaction.sortedDate,
        sortedTime: sortedTransaction.sortedTime,
        wasteName: item.ScrapType.typeOfScrap, // Assigning wasteName
      })).sort((a, b) => a.wasteName.localeCompare(b.wasteName))
    : [];

  const formatTimeToHHMMSS = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}:00`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const renderCellWithFormattedDate = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {formatDate(params.value)}
    </div>
  );

  const renderCellWithFormattedTime = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {formatTimeToHHMMSS(params.value)}
    </div>
  );

  const rowHeight = 52; // Default row height in Material-UI DataGrid
  const headerHeight = 56; // Default header height
  const sortedWasteTransactionHeight =
    sortedWasteTransaction.length * rowHeight + headerHeight;
  const sortedScrapTransactionHeight =
    sortedScrapTransaction.length * rowHeight + headerHeight;

  const columns = [
    {
      field: "sortedDate",
      headerName: "Sorted Date",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithFormattedDate,
    },
    {
      field: "sortedTime",
      headerName: "Sorted Time",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithFormattedTime,
    },
    {
      field: "wasteName",
      headerName: "Waste Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "treatmentProcess",
      headerName: "Treatment Process",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,

      renderCell: (params) => {
        let value = {};
        value.value = params.row.TreatmentProcess.treatmentProcess || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "weight",
      headerName: "Weight",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <div className={"wrap-text"} style={{ textAlign: "center" }}>
          {formatWeight(params.value)}
        </div>
      ),
    },
    {
      field: "clientWeight",
      headerName: "Client Weight",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <div className={"wrap-text"} style={{ textAlign: "center" }}>
          {formatWeight(params.value)}
        </div>
      ),
    },
    {
      field: "clientUnit",
      headerName: "Client Unit",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <div className={"wrap-text"} style={{ textAlign: "center" }}>
          {params.value}
        </div>
      ),
    },
  ];

  const columns2 = [
    {
      field: "sortedDate",
      headerName: "Sorted Date",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithFormattedDate,
    },
    {
      field: "sortedTime",
      headerName: "Sorted Time",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithFormattedTime,
    },
    {
      field: "wasteName",
      headerName: "Scrap Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "weight",
      headerName: "Weight",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <div className={"wrap-text"} style={{ textAlign: "center" }}>
          {formatWeight(params.value)}
        </div>
      ),
    },
  ];

  return (
    <Box>
      {row.statusId === 4 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <SwapVertIcon
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
              For Sorting
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <SwapVertIcon
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
                Sorted
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
                {sortedTransaction.createdAt
                  ? timestampDate(sortedTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>

          {sortedWasteTransaction && sortedWasteTransaction.length > 0 && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Sorted Wastes
              </Typography>
              <DataGrid
                sx={{
                  "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard": {
                    height: sortedWasteTransactionHeight,
                  },
                  "& .MuiDataGrid-root": {
                    border: "none",
                    width: "100%",
                    minHeight: "52px",
                  },
                  "&.MuiDataGrid-overlayWrapper": {
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
                rows={sortedWasteTransaction ? sortedWasteTransaction : []}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => (row.id ? row.id : [])}
                localeText={{ noRowsLabel: "No Sorted Waste Transactions" }}
                initialState={{
                  sortModel: [{ field: "wasteName", sort: "asc" }],
                }}
              />
            </>
          )}

          {sortedScrapTransaction && sortedScrapTransaction.length > 0 && (
            <>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ marginTop: "20px" }}
              >
                Sorted Scraps
              </Typography>
              <DataGrid
                sx={{
                  "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard": {
                    height: sortedScrapTransactionHeight,
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
                rows={sortedScrapTransaction ? sortedScrapTransaction : []}
                columns={columns2}
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => (row.id ? row.id : [])}
                localeText={{ noRowsLabel: "No Sorted Scrap Transactions" }}
                initialState={{
                  sortModel: [{ field: "wasteName", sort: "asc" }],
                }}
              />
            </>
          )}
          <br />
          <Typography variant="h5">
            Batch Weight: {formatWeight(receivedTransaction.netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Total Sorted Weight:{" "}
            {formatWeight(sortedTransaction.totalSortedWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Weight:{" "}
            {formatWeight(sortedTransaction.discrepancyWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Remarks:{" "}
            {sortedTransaction.remarks
              ? sortedTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Sorted By:{" "}
            {`${sortedTransaction.Employee.firstName || ""} ${
              sortedTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default SortedTransaction;
