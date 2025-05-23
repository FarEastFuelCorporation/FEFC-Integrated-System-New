import React from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";
import {
  timestampDate,
  parseTimeString,
  formatWeight,
  formatWeightWithNA,
  formatWeight2,
} from "../Functions";

const TreatedTransaction = ({
  row,
  handleOpenModal,
  handleDeleteClick,
  user,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const sortedTransaction =
    row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.SortedTransaction;

  const sortedWasteTransaction =
    row.ScheduledTransaction[0]?.ReceivedTransaction?.[0]?.SortedTransaction[0]
      ?.SortedWasteTransaction;

  const sortedWasteTransactionSorted = sortedWasteTransaction
    .filter((item) => item.weight > 0) // Remove items with weight 0
    .sort((a, b) => a.wasteName.localeCompare(b.wasteName));

  // Get the bookedTransactionId from ScheduledTransaction
  const bookedTransactionId = row.ScheduledTransaction[0].bookedTransactionId;
  const submitTo =
    row.ScheduledTransaction[0]?.ReceivedTransaction?.[0]?.submitTo;

  // Loop through each SortedWasteTransaction
  sortedWasteTransactionSorted.forEach((sortedTransaction) => {
    let treatedWeight = 0; // Initialize total treated weight

    // Check if the TreatedWasteTransaction exists and is an array
    if (Array.isArray(sortedTransaction.TreatedWasteTransaction)) {
      // Update each TreatedWasteTransaction by adding machineName, treatmentProcess, and bookedTransactionId
      sortedTransaction.TreatedWasteTransaction =
        sortedTransaction.TreatedWasteTransaction.map((treatedTransaction) => {
          // Add weight to the total treatedWeight
          treatedWeight += treatedTransaction.weight || 0; // Add weight, default to 0 if undefined

          if (treatedTransaction.TreatmentMachine) {
            return {
              ...treatedTransaction,
              machineName: treatedTransaction.TreatmentMachine.machineName, // Add machineName attribute
              treatmentProcess:
                treatedTransaction.TreatmentMachine.TreatmentProcess
                  .treatmentProcess, // Add treatmentProcess attribute
              bookedTransactionId: bookedTransactionId, // Add bookedTransactionId attribute
              submitTo: submitTo,
            };
          }
          return treatedTransaction; // Return as is if no TreatmentMachine is present
        });
    }

    // Add the treatedWeight to the SortedWasteTransaction
    sortedTransaction.treatedWeight = treatedWeight;
  });

  const totalSortedWeight = sortedWasteTransactionSorted
    .map((transaction) => transaction.weight || 0)
    .reduce((total, weight) => total + weight, 0); // Sum the weights using reduce

  const totalTreatedWeight = sortedWasteTransactionSorted
    .map((transaction) => transaction.treatedWeight || 0)
    .reduce((total, treatedWeight) => total + treatedWeight, 0); // Sum the weights using reduce

  const statusId = row.statusId;

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

  function getLatestTreatedDateAndTime(sortedWasteTransactions) {
    let latestTreatedDate = null;
    let latestTreatedTime = null;

    if (sortedWasteTransactions && Array.isArray(sortedWasteTransactions)) {
      sortedWasteTransactions.forEach((transaction) => {
        if (
          transaction &&
          transaction.TreatedWasteTransaction &&
          Array.isArray(transaction.TreatedWasteTransaction)
        ) {
          transaction.TreatedWasteTransaction.forEach((treated) => {
            if (treated && treated.treatedDate && treated.treatedTime) {
              if (!latestTreatedDate && !latestTreatedTime) {
                latestTreatedDate = treated.treatedDate;
                latestTreatedTime = treated.treatedTime;
              } else {
                const isLaterDate =
                  treated.treatedDate.localeCompare(latestTreatedDate) > 0;
                const isSameDateAndLaterTime =
                  treated.treatedDate === latestTreatedDate &&
                  treated.treatedTime.localeCompare(latestTreatedTime) > 0;

                if (isLaterDate || isSameDateAndLaterTime) {
                  latestTreatedDate = treated.treatedDate;
                  latestTreatedTime = treated.treatedTime;
                }
              }
            }
          });
        }
      });
    }

    return { latestTreatedDate, latestTreatedTime };
  }

  function getLatestTreatedDateAndTimeSubmitted(sortedTransaction) {
    let latestTreatedDateTime = null;

    if (sortedTransaction && Array.isArray(sortedTransaction)) {
      sortedTransaction.forEach((transaction) => {
        if (
          transaction &&
          transaction.TreatedTransaction &&
          Array.isArray(transaction.TreatedTransaction)
        ) {
          transaction.TreatedTransaction.forEach((treated) => {
            if (treated && treated.createdAt) {
              // If no latestTreatedDateTime or the current treated.createdAt is later, update it
              if (
                !latestTreatedDateTime ||
                new Date(treated.createdAt) > new Date(latestTreatedDateTime)
              ) {
                latestTreatedDateTime = treated.createdAt;
              }
            }
          });
        }
      });
    }

    return { latestTreatedDateTime };
  }

  const { latestTreatedDate, latestTreatedTime } = getLatestTreatedDateAndTime(
    sortedWasteTransactionSorted
  );

  const { latestTreatedDateTime } =
    getLatestTreatedDateAndTimeSubmitted(sortedTransaction);

  function consolidateEmployeeNames(sortedWasteTransactions) {
    const employeeNames = new Set();

    if (sortedWasteTransactions && Array.isArray(sortedWasteTransactions)) {
      sortedWasteTransactions.forEach((sortedTransaction) => {
        if (
          sortedTransaction &&
          Array.isArray(sortedTransaction.TreatedWasteTransaction)
        ) {
          sortedTransaction.TreatedWasteTransaction.forEach(
            (treatedWasteTransaction) => {
              if (
                treatedWasteTransaction &&
                treatedWasteTransaction.TreatedTransaction &&
                treatedWasteTransaction.TreatedTransaction.Employee
              ) {
                const { firstName, lastName } =
                  treatedWasteTransaction.TreatedTransaction.Employee;
                if (firstName && lastName) {
                  employeeNames.add(`${firstName} ${lastName}`);
                }
              }
            }
          );
        }
      });
    }
    return Array.from(employeeNames);
  }

  const employeeNames = consolidateEmployeeNames(sortedWasteTransaction);

  const rowHeight = 52; // Default row height in Material-UI DataGrid
  const headerHeight = 56; // Default header height

  const columns = [
    {
      field: "treatedDate",
      headerName: "Treated Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithFormattedDate,
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
      field: "treatmentProcess",
      headerName: "Treatment Process",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "machineName",
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
          {formatWeightWithNA(params.value)}
        </div>
      ),
    },
  ];

  if (user.userType === 6) {
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
    <Box sx={{ my: 3, position: "relative" }}>
      <CircleLogo pending={statusId === 5 && true}>
        <FactoryIcon
          sx={{
            fontSize: "30px",
            color: `${statusId === 5 ? colors.grey[500] : colors.grey[100]}`,
          }}
        />
      </CircleLogo>
      <Box>
        {statusId === 5 || statusId === 7 ? (
          <Box>
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Treatment
            </Typography>

            <Typography variant="h5">Pending</Typography>
          </Box>
        ) : (
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
                Treated
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
                {latestTreatedDateTime
                  ? timestampDate(latestTreatedDateTime)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
      {sortedWasteTransactionSorted &&
      sortedWasteTransactionSorted.length > 0 ? (
        sortedWasteTransactionSorted.map((waste, index) => {
          const treatedWasteTransactionHeight =
            waste.TreatedWasteTransaction.length === 0
              ? rowHeight + headerHeight
              : waste.TreatedWasteTransaction.length * rowHeight + headerHeight;
          return (
            <Box key={index} sx={{ my: 2 }}>
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
                  {sortedWasteTransactionSorted[index].treatedWeight !==
                    waste.weight &&
                    user.userType === 6 && (
                      <Button
                        sx={{
                          backgroundColor: `${colors.greenAccent[700]}`,
                          color: `${colors.grey[100]}`,
                        }}
                        onClick={() => handleOpenModal(row, waste)}
                      >
                        Treat
                      </Button>
                    )}
                  <Box
                    sx={{
                      padding: "5px",
                      borderRadius: "5px",
                      backgroundColor:
                        sortedWasteTransactionSorted[index].treatedWeight ===
                        waste.weight
                          ? colors.greenAccent[700]
                          : "red",
                      color: "white",
                    }}
                  >
                    <Typography variant="h6">
                      {formatWeight2(
                        sortedWasteTransactionSorted[index].treatedWeight
                      )}{" "}
                      Kg Treated /{formatWeight2(waste.weight)} Kg
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <DataGrid
                sx={{
                  "&.MuiDataGrid-root.MuiDataGrid-root--densityStandard": {
                    height: treatedWasteTransactionHeight,
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
                    { field: "machineName", sort: "asc" },
                  ],
                }}
              />
            </Box>
          );
        })
      ) : (
        <Typography variant="h5">No Sorted Waste Transactions</Typography>
      )}
      <Box>
        {" "}
        <Typography variant="h5">
          Finished Treatment Date:{" "}
          {sortedTransaction[0]?.isFinishTreated
            ? latestTreatedDate &&
              format(new Date(latestTreatedDate), "MMMM dd, yyyy")
            : totalTreatedWeight > 0
            ? "In Progress"
            : "Pending"}
        </Typography>
        <Typography variant="h5">
          Finished Treatment Time:{" "}
          {sortedTransaction[0]?.isFinishTreated
            ? latestTreatedDate &&
              format(parseTimeString(latestTreatedTime), "hh:mm aa")
            : totalTreatedWeight > 0
            ? "In Progress"
            : "Pending"}
        </Typography>
        <Typography variant="h5">
          Total Sorted Weight: {formatWeight(totalSortedWeight)} Kg
        </Typography>
        <Typography variant="h5">
          Total Treated Weight: {formatWeight(totalTreatedWeight)} Kg
        </Typography>
        {/* <Typography variant="h5">
        Remarks: {sortedRemarks ? sortedRemarks : "NO REMARKS"}
      </Typography> */}
        <Typography variant="h5">Submitted By: {employeeNames}</Typography>
      </Box>
      <br />
      <hr />
    </Box>
  );
};

export default TreatedTransaction;
