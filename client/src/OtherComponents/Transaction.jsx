import React, { useState } from "react";
import {
  Box,
  Card,
  IconButton,
  Typography,
  Button,
  useTheme,
  Tabs,
  Tab,
  Grid,
  Modal,
  useMediaQuery,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Badge from "@mui/material/Badge";
import { format, parse } from "date-fns";
import {
  CustomAccordionDetails,
  CustomAccordionStyles,
} from "./CustomAccordionStyles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccordionSummary from "@mui/material/AccordionSummary";
import { tokens } from "../theme";
import BookedTransaction from "./Transactions/BookedTransaction";
import ScheduledTransaction from "./Transactions/ScheduledTransaction";
import DispatchedTransaction from "./Transactions/DispatchedTransaction";
import ReceivedTransaction from "./Transactions/ReceivedTransaction";
import SortedTransaction from "./Transactions/SortedTransaction";
import TreatedTransaction from "./Transactions/TreatedTransaction";
import CertifiedTransaction from "./Transactions/CertifiedTransaction";
import Attachments from "./Attachments";
import BilledTransaction from "./Transactions/BilledTransaction";
import BillingApprovalTransaction from "./Transactions/BillingApprovalTransaction";
import CollectedTransaction from "./Transactions/CollectedTransaction";
import BillingDistributionTransaction from "./Transactions/BillingDistributionTransaction";
import WarehousedTransaction from "./Transactions/WarehousedTransaction";
import CustomDataGridStyles from "./CustomDataGridStyles";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import {
  calculateRemainingDays,
  formatNumber,
  formatTimestamp,
} from "./Functions";
import axios from "axios";
import WarehousedOutTransaction from "./Transactions/WarehousedOutTransaction";
import TreatedWarehouseTransaction from "./Transactions/TreatedWarehouseTransaction";
import CommissionTransaction from "./Transactions/CommissionTransaction";
import CommissionApprovalTransaction from "./Transactions/CommissionApprovalTransaction";

const Transaction = ({
  user,
  buttonText,
  pendingTransactions,
  inProgressTransactions,
  finishedTransactions,
  handleOpenModal,
  handleEditClick,
  handleDeleteClick,
  handleDeleteClickBook,
  setSuccessMessage,
  setShowSuccessMessage,
  openTransactionModal,
  setOpenTransactionModal,
  selectedIds,
  setSelectedIds,
  discount,
  hasCancel,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubTab, setSelectedSubTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState(null);

  const apiRef = useGridApiRef();

  const apiUrl = process.env.REACT_APP_API_URL;

  const [row, setRow] = useState(null);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeSubTab = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  const handleSelection = (newSelection) => {
    if (JSON.stringify(selectedIds) !== JSON.stringify(newSelection)) {
      setSelectedIds(newSelection);
    }
  };

  const transactions =
    selectedTab === 0
      ? pendingTransactions
      : selectedTab === 1 && user.userType !== 11
      ? inProgressTransactions
      : finishedTransactions;

  const pendingCount = pendingTransactions.length;
  const inProgressCount = inProgressTransactions.length;
  const finishedCount = finishedTransactions.length;

  const handleOpenTransactionModal = (data) => {
    setOpenTransactionModal(true);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "transactionId",
      headerName: "Transaction ID",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "haulingDate",
      headerName: "Hauling Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        // Check if ScheduledTransaction exists and has scheduledDate
        if (params.row.ScheduledTransaction[0]) {
          const scheduledDate =
            params.row.ScheduledTransaction[0].scheduledDate;
          if (scheduledDate && !isNaN(new Date(scheduledDate))) {
            return format(new Date(scheduledDate), "MMMM dd, yyyy");
          } else {
            return ""; // Invalid or missing date
          }
        } else {
          const haulingDateValue = params.row.haulingDate;
          if (haulingDateValue && !isNaN(new Date(haulingDateValue))) {
            return format(new Date(haulingDateValue), "MMMM dd, yyyy");
          } else {
            return ""; // Invalid or missing date
          }
        }
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "haulingTime",
      headerName: "Hauling Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const scheduledTime = params.row.ScheduledTransaction[0]
          ? params.row.ScheduledTransaction[0].scheduledTime
          : params.row.haulingTime;

        const parsedTime = parse(scheduledTime, "HH:mm:ss", new Date());

        let haulingTime;

        haulingTime = format(parsedTime, "hh:mm a");

        let value = {};
        value.value = haulingTime;

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 250,
      valueGetter: (params) => {
        return params.row.Client.clientName;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "wasteName",
      headerName: "Waste Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.QuotationWaste?.wasteName;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "typeOfVehicle",
      headerName: "Type Of Vehicle",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return (
          params.row.QuotationTransportation?.VehicleType?.typeOfVehicle ||
          "CLIENT VEHICLE"
        );
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "plateNumber",
      headerName: "Plate Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      valueGetter: (params) => {
        if (
          params.row?.ScheduledTransaction?.[0]?.DispatchedTransaction &&
          params.row?.ScheduledTransaction?.[0]?.DispatchedTransaction.length >
            0
        ) {
          return params.row?.ScheduledTransaction?.[0]
            ?.DispatchedTransaction?.[0]?.Vehicle?.plateNumber;
        } else if (
          params.row?.ScheduledTransaction?.[0]?.ReceivedTransaction &&
          params.row?.ScheduledTransaction?.[0]?.ReceivedTransaction.length > 0
        ) {
          return params.row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.vehicle.toUpperCase();
        } else {
          return "PENDING";
        }
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "pullOutFormNo",
      headerName: "Pull Out Form",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      valueGetter: (params) => {
        if (
          params.row?.ScheduledTransaction?.[0]?.ReceivedTransaction &&
          params.row?.ScheduledTransaction?.[0]?.ReceivedTransaction.length > 0
        ) {
          return params.row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]?.pullOutFormNo.toUpperCase();
        } else {
          return "PENDING";
        }
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "status",
      headerName: "Transaction Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        let status;

        if (params.row.statusId === 1) {
          status = "BOOKED";
        } else if (params.row.statusId === 2) {
          status = "SCHEDULED";
        } else if (params.row.statusId === 3) {
          status = "DISPATCHED";
        } else if (
          params.row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.submitTo === "FOUL TRIP"
        ) {
          status = "FOUL TRIP";
        } else if (params.row.statusId === 4) {
          status = "RECEIVED";
        } else if (params.row.statusId === 5) {
          status = "SORTED";
        } else if (params.row.statusId === 6) {
          status = "WARHOUSED IN";
        } else if (params.row.statusId === 7) {
          status = "WARHOUSED OUT";
        } else if (params.row.statusId === 8) {
          status = "TREATED";
        } else if (params.row.statusId >= 9) {
          status = "CERTIFIED";
        }

        return status;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "billingStatus",
      headerName: "Billing Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        let status;

        if (
          params.row.BilledTransaction?.length > 0 &&
          !params.row.BilledTransaction?.[0]?.BillingApprovalTransaction
        ) {
          status = "BILLED";
        } else if (
          params.row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.submitTo === "FOUL TRIP"
        ) {
          status = "FOUL TRIP";
        } else if (
          params.row.statusId === 11 &&
          params.row.BilledTransaction?.length > 0 &&
          params.row.BilledTransaction?.[0]?.BillingApprovalTransaction
        ) {
          status = "BILLING APPROVED";
        } else if (params.row.statusId === 12) {
          status = "BILLING DISTRIBUTED";
        } else if (params.row.statusId === 13) {
          status = "COLLECTED";
        } else {
          status = "PENDING";
        }

        return status;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "billingNumber", // Same field name as in the original columns
      headerName: "Billing Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        if (
          params.row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
            ?.submitTo === "FOUL TRIP"
        ) {
          return "FOUL TRIP";
        }
        return params.row.BilledTransaction?.[0]?.billingNumber || "PENDING";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "collectedAmount", // Same field name as in the original columns
      headerName: "Collected Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return params.row.BilledTransaction?.[0]?.BillingApprovalTransaction
          ?.BillingDistributionTransaction?.CollectedTransaction
          ?.collectedAmount
          ? formatNumber(
              params.row.BilledTransaction?.[0]?.BillingApprovalTransaction
                ?.BillingDistributionTransaction?.CollectedTransaction
                ?.collectedAmount
            )
          : "PENDING";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdAt", // Same field name as in the original columns
      headerName: "Created At",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        return params.row.CertifiedTransaction?.[0]?.createdAt
          ? formatTimestamp(params.row.CertifiedTransaction?.[0]?.createdAt)
          : "";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "view",
      headerName: "View",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Button
          color="secondary"
          variant="contained"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              const id = params.row.id; // Get the document ID
              setLoadingRowId(id);

              const submitTo =
                params.row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                  ?.submitTo;

              const response = await axios.get(
                `${apiUrl}/api/bookedTransaction/full/${id}`,
                {
                  params: {
                    submitTo: submitTo,
                  },
                }
              );

              // Check for errors in the response
              if (response.data?.error) {
                throw new Error(response.data.error);
              }

              // Ensure the data structure is valid
              if (!response.data?.transaction?.transaction) {
                throw new Error("Invalid data received from the server.");
              }
              // Only call these functions if there are no errors
              if (response.data.transaction.transaction) {
                // console.log(response.data.transaction.transaction);
                setRow(response.data.transaction.transaction);
                handleOpenTransactionModal(
                  response.data.transaction.transaction
                );
              }
            } catch (error) {
              console.error("Error fetching document file:", error);
              alert(
                error.response?.data?.message ||
                  "An error occurred while fetching the transaction. Please try again."
              );
            } finally {
              setLoading(false);
              setLoadingRowId(null); // Reset the loading row ID after the API call completes
            }
          }}
        >
          {loadingRowId === params.row.id ? "Loading..." : "View Transaction"}
        </Button>
      ),
    },
  ];

  const filteredColumns = columns.filter((column) => {
    // Hide the 'clientName' column if user.userType is not an integer
    if (column.field === "clientName" && !Number.isInteger(user.userType)) {
      return false; // Exclude the column
    }
    if (
      column.field === "collectedAmount" &&
      !Number.isInteger(user.userType)
    ) {
      return false; // Exclude the column
    }
    if (user.userType !== 7 && column.field === "createdAt") {
      return false; // Exclude the column
    }
    return true; // Include the column
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mt="40px">
      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          sx={{
            "& .Mui-selected": {
              backgroundColor: colors.greenAccent[400],
              boxShadow: "none",
              borderBottom: `1px solid ${colors.grey[100]}`,
            },
            "& .MuiTab-root > span": {
              paddingRight: "10px",
            },
          }}
        >
          <Tab
            label={
              <Badge
                badgeContent={pendingCount}
                color="error"
                max={9999}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Pending
              </Badge>
            }
          />
          {user.userType !== 11 && (
            <Tab
              label={
                <Badge
                  badgeContent={inProgressCount}
                  color="warning"
                  max={9999}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  In Progress
                </Badge>
              }
            />
          )}
          <Tab
            label={
              <Badge
                badgeContent={finishedCount}
                color="success"
                max={9999}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Finished
              </Badge>
            }
          />
        </Tabs>
        <CustomDataGridStyles height={"70vh"} margin={0}>
          <DataGrid
            apiRef={apiRef}
            rows={transactions ? transactions : []}
            columns={filteredColumns}
            checkboxSelection={
              user.userType === 8 || (user.userType === 2 && !hasCancel)
            }
            onSelectionModelChange={
              user.userType === 8 || (user.userType === 2 && !hasCancel)
                ? handleSelection
                : undefined
            }
            getRowClassName={(params) => {
              const daysRemaining = params.row.ScheduledTransaction?.[0]
                ?.scheduledDate
                ? calculateRemainingDays(
                    params.row.ScheduledTransaction[0].scheduledDate
                  )
                : calculateRemainingDays(params.row.haulingDate);
              if (user.userType === 2 && selectedTab === 0) {
                if (daysRemaining !== null) {
                  if (daysRemaining < 0) {
                    return "blink-red"; // Expired
                  } else if (daysRemaining === 0) {
                    return "blink-yellow"; // Near expired
                  }
                }
              } else if (user.userType === 3 && selectedTab === 0) {
                if (daysRemaining !== null) {
                  if (daysRemaining < 0) {
                    return "blink-red"; // Expired
                  } else if (daysRemaining === 0) {
                    return "blink-yellow"; // Near expired
                  }
                }
              } else if (user.userType === 4 && selectedTab === 0) {
                if (daysRemaining !== null) {
                  if (daysRemaining < -1) {
                    return "blink-red"; // Expired
                  } else if (daysRemaining < 0) {
                    return "blink-yellow"; // Near expired
                  }
                }
              } else if (user.userType === 5 && selectedTab === 0) {
                if (daysRemaining !== null) {
                  if (daysRemaining < -1) {
                    return "blink-red"; // Expired
                  } else if (daysRemaining < 0) {
                    return "blink-yellow"; // Near expired
                  }
                }
              } else if (user.userType === 6 && selectedTab === 0) {
                if (daysRemaining !== null) {
                  if (daysRemaining < -2) {
                    return "blink-red"; // Expired
                  } else if (daysRemaining < -1) {
                    return "blink-yellow"; // Near expired
                  }
                }
              } else if (user.userType === 7 && selectedTab === 0) {
                if (daysRemaining !== null) {
                  if (daysRemaining < -2) {
                    return "blink-red"; // Expired
                  } else if (daysRemaining < -1) {
                    return "blink-yellow"; // Near expired
                  }
                }
              }
              return ""; // Default class if no blinking is needed
            }}
            initialState={
              user.userType === 7
                ? {
                    sorting: {
                      sortModel: [{ field: "createdAt", sort: "desc" }],
                    },
                  }
                : undefined
            }
          />
        </CustomDataGridStyles>
        <Modal
          open={openTransactionModal}
          onClose={handleCloseTransactionModal}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: `${isMobile ? "100%" : "80vw"}`,
              width: "100%",
              height: "80vh",
              overflowY: "scroll",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {row && (
              <CustomAccordionStyles>
                <Accordion defaultExpanded={true}>
                  <AccordionSummary>
                    <Grid container>
                      <Grid
                        item
                        md={3}
                        lg={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h4">
                          Transaction ID: {row.transactionId}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={9}
                        lg={8}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {!Number.isInteger(user.userType) ? (
                          <Box>
                            {row.ScheduledTransaction[0] ? (
                              <Typography>
                                {format(
                                  new Date(
                                    row.ScheduledTransaction[0].scheduledDate
                                  ),
                                  "MMMM dd, yyyy"
                                )}
                              </Typography>
                            ) : (
                              <Typography>
                                {format(
                                  new Date(row.haulingDate),
                                  "MMMM dd, yyyy"
                                )}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Box>
                            {row.ScheduledTransaction[0] ? (
                              <Typography>
                                {format(
                                  new Date(
                                    row.ScheduledTransaction[0].scheduledDate
                                  ),
                                  "MMMM dd, yyyy"
                                )}
                              </Typography>
                            ) : (
                              <Typography>
                                {format(
                                  new Date(row.haulingDate),
                                  "MMMM dd, yyyy"
                                )}
                              </Typography>
                            )}
                            <Typography>{row.Client.clientName}</Typography>
                          </Box>
                        )}
                      </Grid>
                      {selectedTab === 0 ? (
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={2}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "end",
                            gap: 1,
                          }}
                        >
                          {user.userType === 2 && hasCancel && (
                            <Button
                              onClick={() => handleDeleteClickBook(row)}
                              sx={{
                                backgroundColor: "#f44336",
                                color: `${colors.grey[100]}`,
                              }}
                            >
                              CANCEL
                            </Button>
                          )}
                          {Number.isInteger(user.userType) && (
                            <Button
                              onClick={() => handleOpenModal(row)}
                              sx={{
                                backgroundColor: `${colors.greenAccent[700]}`,
                                color: `${colors.grey[100]}`,
                              }}
                            >
                              {buttonText}
                            </Button>
                          )}
                          {!Number.isInteger(user.userType) && (
                            <div style={{ display: "flex" }}>
                              <IconButton onClick={() => handleEditClick(row)}>
                                <EditIcon sx={{ color: "#ff9800" }} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteClick(row)}
                              >
                                <DeleteIcon sx={{ color: "#f44336" }} />
                              </IconButton>
                            </div>
                          )}
                        </Grid>
                      ) : selectedTab === 1 ? (
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={1}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {(() => {
                            if (
                              Number.isInteger(user.userType) &&
                              user.userType !== 6
                            ) {
                              if (
                                (user.userType === 2 &&
                                  buttonText === "Schedule" &&
                                  row.statusId === 2) ||
                                (user.userType === 2 &&
                                  buttonText === "Commission" &&
                                  row.statusId >= 10) ||
                                (user.userType === 3 && row.statusId === 3) ||
                                (user.userType === 4 && row.statusId === 4) ||
                                // (user.userType === 5 && row.statusId === 5) ||
                                user.userType === 5 ||
                                (user.userType === 7 &&
                                  (row.statusId === 9 ||
                                    row.statusId === 10 ||
                                    row.statusId === 11 ||
                                    row.statusId === 12)) ||
                                (user.userType === 8 &&
                                  (row.statusId === 5 ||
                                    row.statusId === 6 ||
                                    row.statusId === 7 ||
                                    row.statusId === 8 ||
                                    row.statusId === 9 ||
                                    row.statusId === 10 ||
                                    row.statusId === 11 ||
                                    row.statusId === 12 ||
                                    row.statusId === 13)) ||
                                (user.userType === 9 &&
                                  buttonText === "Billing Approve" &&
                                  row.statusId === 11) ||
                                (user.userType === 9 &&
                                  buttonText === "Commission Approve" &&
                                  row.statusId === 11) ||
                                (user.userType === 10 && row.statusId === 12) ||
                                (user.userType === 11 && row.statusId === 13) ||
                                (user.userType === 11 && row.statusId === 13) ||
                                user.userType === 14
                                // (user.userType === 14 && row.statusId === 6)
                              ) {
                                return (
                                  <div style={{ display: "flex" }}>
                                    <IconButton
                                      onClick={() => handleEditClick(row)}
                                    >
                                      <EditIcon sx={{ color: "#ff9800" }} />
                                    </IconButton>

                                    <IconButton
                                      onClick={() => handleDeleteClick(row)}
                                    >
                                      <DeleteIcon sx={{ color: "#f44336" }} />
                                    </IconButton>
                                  </div>
                                );
                              }
                            }
                            return null; // Default case to return nothing
                          })()}
                          {!Number.isInteger(user.userType) &&
                            row.statusId < 3 && (
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  onClick={() => handleEditClick(row)}
                                >
                                  <EditIcon sx={{ color: "#ff9800" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteClick(row)}
                                >
                                  <DeleteIcon sx={{ color: "#f44336" }} />
                                </IconButton>
                              </div>
                            )}
                        </Grid>
                      ) : (
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={1}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {!(user.userType === 6) && (
                            <div style={{ display: "flex" }}>
                              <IconButton onClick={() => handleEditClick(row)}>
                                <EditIcon sx={{ color: "#ff9800" }} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteClick(row)}
                              >
                                <DeleteIcon sx={{ color: "#f44336" }} />
                              </IconButton>
                            </div>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </AccordionSummary>

                  <CustomAccordionDetails>
                    {!Number.isInteger(user.userType) && (
                      <BookedTransaction row={row} user={user} />
                    )}
                    {user.userType === 2 && buttonText === "Schedule" && (
                      <ScheduledTransaction row={row} />
                    )}
                    {Number.isInteger(user.userType) &&
                      user.userType === 2 &&
                      buttonText === "Commission" && (
                        <CommissionTransaction row={row} user={user} />
                      )}
                    {user.userType === 3 && <DispatchedTransaction row={row} />}
                    {user.userType === 4 && <ReceivedTransaction row={row} />}
                    {user.userType === 5 && <SortedTransaction row={row} />}
                    {user.userType === 14 && (
                      <WarehousedTransaction row={row} />
                    )}
                    {user.userType === 15 && (
                      <WarehousedOutTransaction
                        row={row}
                        user={user}
                        handleDeleteClick={handleDeleteClick}
                      />
                    )}
                    {user.userType === 6 &&
                      row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                        ?.submitTo === "SORTING" && (
                        <TreatedTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                    {user.userType === 6 &&
                      row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                        ?.submitTo === "WAREHOUSE" && (
                        <TreatedWarehouseTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                    {user.userType === 7 && (
                      <CertifiedTransaction
                        row={row}
                        handleOpenModal={handleOpenModal}
                        handleDeleteClick={handleDeleteClick}
                        user={user}
                      />
                    )}
                    {user.userType === 8 && (
                      <BilledTransaction
                        row={row}
                        handleOpenModal={handleOpenModal}
                        handleDeleteClick={handleDeleteClick}
                        user={user}
                        discount={discount}
                      />
                    )}
                    {user.userType === 9 &&
                      buttonText === "Billing Approve" && (
                        <BillingApprovalTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                    {Number.isInteger(user.userType) &&
                      user.userType === 9 &&
                      buttonText === "Commission Approve" && (
                        <CommissionApprovalTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                    {user.userType === 10 && (
                      <BillingDistributionTransaction
                        row={row}
                        handleOpenModal={handleOpenModal}
                        handleDeleteClick={handleDeleteClick}
                        user={user}
                      />
                    )}
                    {user.userType === 11 && (
                      <CollectedTransaction
                        row={row}
                        handleOpenModal={handleOpenModal}
                        handleDeleteClick={handleDeleteClick}
                        user={user}
                      />
                    )}
                  </CustomAccordionDetails>
                  <Tabs
                    value={selectedSubTab}
                    onChange={handleChangeSubTab}
                    sx={{
                      "& .Mui-selected": {
                        backgroundColor: colors.greenAccent[400],
                        boxShadow: "none",
                        borderBottom: `1px solid ${colors.grey[100]}`,
                      },
                    }}
                  >
                    <Tab label="Tracking" />
                    <Tab label="Attachments" />
                  </Tabs>
                  {selectedSubTab === 0 ? (
                    <CustomAccordionDetails>
                      {row.statusId >= 12 && (
                        <CollectedTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 11 && (
                        <BillingDistributionTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {Number.isInteger(user.userType) &&
                        row.statusId >= 10 && (
                          <CommissionApprovalTransaction
                            row={row}
                            handleOpenModal={handleOpenModal}
                            handleDeleteClick={handleDeleteClick}
                            user={user}
                          />
                        )}
                      {row.statusId >= 10 && (
                        <BillingApprovalTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 10 &&
                        Number.isInteger(user.userType) && (
                          <CommissionTransaction
                            row={row}
                            handleOpenModal={handleOpenModal}
                            handleDeleteClick={handleDeleteClick}
                            user={user}
                          />
                        )}
                      {(row.statusId >= 9 ||
                        row.BilledTransaction.length > 0) && (
                        <BilledTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                          discount={discount}
                        />
                      )}
                      {row.statusId >= 8 && (
                        <CertifiedTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {(row.statusId >= 7 || row.statusId === 5) &&
                        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                          ?.submitTo === "SORTING" && (
                          <TreatedTransaction
                            row={row}
                            handleOpenModal={handleOpenModal}
                            handleDeleteClick={handleDeleteClick}
                            user={user}
                          />
                        )}
                      {(row.statusId >= 7 || row.statusId === 5) &&
                        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                          ?.submitTo === "WAREHOUSE" && (
                          <TreatedWarehouseTransaction
                            row={row}
                            handleOpenModal={handleOpenModal}
                            handleDeleteClick={handleDeleteClick}
                            user={user}
                          />
                        )}
                      {row.statusId >= 4 &&
                        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                          ?.submitTo === "SORTING" && (
                          <SortedTransaction row={row} />
                        )}
                      {row.statusId >= 6 &&
                        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                          ?.submitTo === "WAREHOUSE" && (
                          <WarehousedOutTransaction
                            row={row}
                            user={user}
                            handleDeleteClick={handleDeleteClick}
                          />
                        )}
                      {row.statusId >= 4 &&
                        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                          ?.submitTo === "WAREHOUSE" && (
                          <WarehousedTransaction row={row} />
                        )}
                      {row.statusId >= 2 && <ReceivedTransaction row={row} />}
                      {row.statusId >= 2 && <DispatchedTransaction row={row} />}
                      {row.statusId >= 1 && (
                        <ScheduledTransaction row={row} user={user} />
                      )}
                      {Number.isInteger(user.userType) && (
                        <>
                          <BookedTransaction row={row} user={user} />
                        </>
                      )}
                    </CustomAccordionDetails>
                  ) : (
                    <Box>
                      <Attachments
                        row={row}
                        setSuccessMessage={setSuccessMessage}
                        setShowSuccessMessage={setShowSuccessMessage}
                        user={user}
                      />
                    </Box>
                  )}
                </Accordion>
              </CustomAccordionStyles>
            )}
          </Box>
        </Modal>
      </Card>
    </Box>
  );
};

export default Transaction;
