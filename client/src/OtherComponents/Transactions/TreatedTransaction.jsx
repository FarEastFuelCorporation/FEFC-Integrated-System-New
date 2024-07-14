import React from "react";
import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const TreatedTransaction = ({ row, handleDeleteClick, handleOpenModal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    statusId,
    sortedCreatedDate,
    sortedCreatedTime,
    sortedDate,
    sortedTime,
    netWeight,
    totalSortedWeight,
    discrepancyWeight,
    sortedRemarks,
    sortedWasteTransaction,
    sortedScrapTransaction,
    sortedCreatedBy,
  } = row;

  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const formatWeight = (weight) => {
    // Check if weight is NaN
    if (isNaN(weight)) {
      return ""; // Return empty string if weight is NaN
    }

    // Format the number if it's a valid number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(weight);
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "treatedDate",
      headerName: "Treated Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "treatedTime",
      headerName: "Treated Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "treatmentProcessId",
      headerName: "Treatment Process",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "treatmentMachineId",
      headerName: "Treatment Machine",
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
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
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
    <Box>
      {statusId === 5 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <FactoryIcon
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
              For Treatment
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          {sortedWasteTransaction && sortedWasteTransaction.length > 0 ? (
            sortedWasteTransaction.map((waste, index) => (
              <Box key={index}>
                {console.log(waste)}
                {console.log(waste.TreatedWasteTransaction)}
                <Box
                  sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "end",
                  }}
                >
                  <Typography variant="h5">
                    Waste Name: {waste.wasteName}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      sx={{
                        backgroundColor: `${colors.greenAccent[700]}`,
                        color: `${colors.grey[100]}`,
                      }}
                      onClick={() => handleOpenModal(row, waste)}
                    >
                      Treat
                    </Button>
                    <Box
                      sx={{
                        padding: "5px",
                        borderRadius: "5px",
                        backgroundColor:
                          sortedWasteTransaction[index].treatedWeight ===
                          waste.weight
                            ? colors.greenAccent[700]
                            : "red",
                        color: "white",
                      }}
                    >
                      <Typography variant="h6">
                        {formatWeight(
                          sortedWasteTransaction[index].treatedWeight
                        )}{" "}
                        Kg Treated /{formatWeight(waste.weight)} Kg
                      </Typography>
                    </Box>
                  </Box>
                </Box>
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
                  rows={
                    waste.TreatedWasteTransaction
                      ? waste.TreatedWasteTransaction
                      : []
                  }
                  columns={columns}
                  components={{ Toolbar: GridToolbar }}
                  getRowId={(row) => (row.id ? row.id : [])}
                  localeText={{ noRowsLabel: "No Treated Transactions" }}
                  initialState={{
                    sortModel: [
                      { field: "treatedDate", sort: "asc" },
                      { field: "treatedTime", sort: "asc" },
                    ],
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography variant="h5">No Sorted Waste Transactions</Typography>
          )}

          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <FactoryIcon
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
              Treated
            </Typography>
            <Typography variant="h5">
              {sortedCreatedDate} {sortedCreatedTime}
            </Typography>
          </Box>
          {sortedWasteTransaction && sortedWasteTransaction.length > 0 ? (
            sortedWasteTransaction.map((waste, index) => (
              <Box key={index} sx={{ my: 2 }}>
                <Typography variant="h5">Item {index + 1}</Typography>
                <Typography variant="h5">
                  Waste Name: {waste.wasteName}
                </Typography>
                <Typography variant="h5">
                  Weight: {formatWeight(waste.weight)} Kg
                </Typography>
                <Typography variant="h5">Form No: {waste.formNo}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="h5">No Sorted Waste Transactions</Typography>
          )}
          {sortedScrapTransaction && sortedScrapTransaction.length > 0 ? (
            sortedScrapTransaction.map((scrap, index) => (
              <Box key={index} sx={{ my: 2 }}>
                <Typography variant="h5">Scrap {index + 1}</Typography>
                <Typography variant="h5">
                  Waste Name: {scrap.ScrapType.typeOfScrap}
                </Typography>
                <Typography variant="h5">
                  Weight: {formatWeight(scrap.weight)} Kg
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="h5">No Sorted Waste Transactions</Typography>
          )}
          <Typography variant="h5">
            Sorted Date:{" "}
            {sortedDate
              ? format(new Date(sortedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Sorted Time:{" "}
            {sortedTime
              ? format(parseTimeString(sortedTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Net Weight: {formatWeight(netWeight)} Kg
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

export default TreatedTransaction;
