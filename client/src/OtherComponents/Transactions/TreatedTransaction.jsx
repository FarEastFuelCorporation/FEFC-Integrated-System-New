import React from "react";
import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const TreatedTransaction = ({
  row,
  handleOpenModal,
  handleDeleteClick,
  user,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const sortedWasteTransaction =
    row.ScheduledTransaction[0].DispatchedTransaction[0].ReceivedTransaction[0]
      .SortedTransaction[0].SortedWasteTransaction;

  // Loop through each SortedWasteTransaction
  sortedWasteTransaction.forEach((sortedTransaction) => {
    let treatedWeight = 0; // Initialize total treated weight

    // Check if the TreatedWasteTransaction exists and is an array
    if (Array.isArray(sortedTransaction.TreatedWasteTransaction)) {
      // Update each TreatedWasteTransaction by adding machineName and treatmentProcess
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
            };
          }
          return treatedTransaction; // Return as is if no TreatmentMachine is present
        });
    }

    // Add the treatedWeight to the SortedWasteTransaction
    sortedTransaction.treatedWeight = treatedWeight;
  });

  const totalSortedWeight = sortedWasteTransaction
    .map((transaction) => transaction.weight || 0)
    .reduce((total, weight) => total + weight, 0); // Sum the weights using reduce
  const statusId = row.statusId;

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

  const { latestTreatedDate, latestTreatedTime } = getLatestTreatedDateAndTime(
    sortedWasteTransaction
  );

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
          {formatWeight(params.value)}
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
        {statusId === 5 ? (
          <Box>
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Treatment
            </Typography>

            <Typography variant="h5">Pending</Typography>
          </Box>
        ) : (
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
              {`${latestTreatedDate} ${latestTreatedTime}`}
            </Typography>
          </Box>
        )}
      </Box>
      {sortedWasteTransaction && sortedWasteTransaction.length > 0 ? (
        sortedWasteTransaction.map((waste, index) => (
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
                {sortedWasteTransaction[index].treatedWeight !==
                  waste.weight && (
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
                      sortedWasteTransaction[index].treatedWeight ===
                      waste.weight
                        ? colors.greenAccent[700]
                        : "red",
                    color: "white",
                  }}
                >
                  <Typography variant="h6">
                    {formatWeight(sortedWasteTransaction[index].treatedWeight)}{" "}
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
                  { field: "machineName", sort: "asc" },
                ],
              }}
            />
          </Box>
        ))
      ) : (
        <Typography variant="h5">No Sorted Waste Transactions</Typography>
      )}
      {statusId === 6 && (
        <Box>
          {" "}
          <Typography variant="h5">
            Finished Treatment Date:{" "}
            {latestTreatedDate
              ? format(new Date(latestTreatedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Finished Treatment Time:{" "}
            {latestTreatedTime
              ? format(parseTimeString(latestTreatedTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Total Treated Weight: {formatWeight(totalSortedWeight)} Kg
          </Typography>
          {/* <Typography variant="h5">
        Remarks: {sortedRemarks ? sortedRemarks : "NO REMARKS"}
      </Typography> */}
          <Typography variant="h5">Treated By: {employeeNames}</Typography>
        </Box>
      )}
      <br />
      <hr />
    </Box>
  );
};

export default TreatedTransaction;
