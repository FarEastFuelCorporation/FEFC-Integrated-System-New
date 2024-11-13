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
import { DataGrid } from "@mui/x-data-grid";
import { calculateRemainingDays } from "./Functions";
import axios from "axios";

const Transaction = ({
  user,
  buttonText,
  pendingTransactions,
  inProgressTransactions,
  finishedTransactions,
  handleOpenModal,
  handleEditClick,
  handleDeleteClick,
  setSuccessMessage,
  setShowSuccessMessage,
  openTransactionModal,
  setOpenTransactionModal,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubTab, setSelectedSubTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const [row, setRow] = useState(null);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeSubTab = (event, newValue) => {
    setSelectedSubTab(newValue);
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
      minWidth: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        return params.row.Client.clientName;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "haulingDate",
      headerName: "Hauling Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        if (params.row.ScheduledTransaction[0]) {
          return format(
            new Date(params.row.ScheduledTransaction[0].scheduledDate),
            "MMMM dd, yyyy"
          );
        } else {
          return format(new Date(params.row.haulingDate), "MMMM dd, yyyy");
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
      minWidth: 150,
      valueGetter: (params) => {
        const scheduledTime = params.row.ScheduledTransaction[0]
          ? params.row.ScheduledTransaction[0].scheduledTime
          : params.row.haulingTime;

        const parsedTime = parse(scheduledTime, "HH:mm:ss", new Date());

        return format(parsedTime, "hh:mm a");
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        switch (params.row.statusId) {
          case 1:
            return "BOOKED";
          case 2:
            return "SCHEDULED";
          case 3:
            return "DISPATCHED";
          case 4:
            return "RECEIVED";
          case 5:
            return "SORTED";
          case 6:
            return "TREATED";
          case 7:
            return "CERTIFIED";
          case 8:
            return "BILLED";
          case 9:
            return "APPROVED";
          case 10:
            return "DISTRIBUTED";
          case 11:
            return "COLLECTED";
          default:
            return "UNKNOWN"; // Optional: Handle unexpected status IDs
        }
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "view",
      headerName: "View",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 200,
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

              // Fetch the attachment from the API using the document ID
              const response = await axios.get(
                `${apiUrl}/api/bookedTransaction/full/${id}`
              );
              setRow(response.data.transaction.transaction);
              handleOpenTransactionModal(response.data.transaction.transaction);
            } catch (error) {
              console.error("Error fetching document file:", error);
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
            // rows={[]}
            rows={transactions ? transactions : []}
            columns={columns}
            getRowId={(row) => row.id}
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
                        lg={9}
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
                          lg={1}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "end",
                          }}
                        >
                          {Number.isInteger(user.userType) &&
                            user.userType !== 6 && (
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
                          {Number.isInteger(user.userType) &&
                            user.userType !== 6 && (
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
                      <BookedTransaction row={row} />
                    )}
                    {user.userType === 2 && <ScheduledTransaction row={row} />}
                    {user.userType === 3 && <DispatchedTransaction row={row} />}
                    {user.userType === 4 && <ReceivedTransaction row={row} />}
                    {user.userType === 5 && <SortedTransaction row={row} />}
                    {user.userType === 14 && (
                      <WarehousedTransaction row={row} />
                    )}

                    {user.userType === 6 && (
                      <TreatedTransaction
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
                      />
                    )}
                    {user.userType === 9 && (
                      <BillingApprovalTransaction
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
                      {row.statusId >= 10 && (
                        <CollectedTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 9 && (
                        <BillingDistributionTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 8 && (
                        <BillingApprovalTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 7 && (
                        <BilledTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 6 && (
                        <CertifiedTransaction
                          row={row}
                          handleOpenModal={handleOpenModal}
                          handleDeleteClick={handleDeleteClick}
                          user={user}
                        />
                      )}
                      {row.statusId >= 5 && (
                        <TreatedTransaction
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
                      {row.statusId >= 4 &&
                        row.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
                          ?.submitTo === "WAREHOUSE" && (
                          <WarehousedTransaction row={row} />
                        )}
                      {row.statusId >= 2 && <ReceivedTransaction row={row} />}
                      {row.statusId >= 2 && <DispatchedTransaction row={row} />}
                      {row.statusId >= 1 && <ScheduledTransaction row={row} />}
                      {Number.isInteger(user.userType) && (
                        <>
                          <BookedTransaction row={row} />
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
