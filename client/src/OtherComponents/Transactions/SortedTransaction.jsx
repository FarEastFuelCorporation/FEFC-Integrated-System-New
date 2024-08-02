import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";

const SortedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    statusId,
    sortedCreatedDate,
    sortedCreatedTime,
    netWeight,
    totalSortedWeight,
    discrepancyWeight,
    sortedRemarks,
    SortedWasteTransaction,
    SortedScrapTransaction,
    sortedCreatedBy,
  } = row;

  const formatTimeToHHMMSS = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}:00`;
  };

  const formatWeight = (weight) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(weight);
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

  const columns = [
    {
      field: "sortedDate",
      headerName: "Sorted Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithFormattedDate,
    },
    {
      field: "sortedTime",
      headerName: "Sorted Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
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
      field: "weight",
      headerName: "Weight",
      headerAlign: "center",
      align: "center",
      flex: 1,
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
      flex: 1,
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
      {statusId === 4 ? (
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              Sorted
            </Typography>
            <Typography variant="h5">
              {sortedCreatedDate} {sortedCreatedTime}
            </Typography>
          </Box>
          {SortedWasteTransaction && SortedWasteTransaction.length > 0 && (
            <DataGrid
              sx={{
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
              rows={SortedWasteTransaction ? SortedWasteTransaction : []}
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
          {SortedScrapTransaction && SortedScrapTransaction.length > 0 && (
            <DataGrid
              sx={{
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
              rows={SortedScrapTransaction ? SortedScrapTransaction : []}
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
            Batch Weight: {formatWeight(netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Total Sorted Weight: {formatWeight(totalSortedWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Weight: {formatWeight(discrepancyWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Discrepancy Remarks: {sortedRemarks ? sortedRemarks : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">Sorted By: {sortedCreatedBy}</Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default SortedTransaction;
