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
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Badge from "@mui/material/Badge";
import { format } from "date-fns";
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
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubTab, setSelectedSubTab] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeSubTab = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  const transactions =
    selectedTab === 0
      ? pendingTransactions
      : selectedTab === 1
      ? inProgressTransactions
      : finishedTransactions;

  const pendingCount = pendingTransactions.filter(
    (transaction) => transaction.statusId === 1
  ).length;
  const inProgressCount = inProgressTransactions.filter(
    (transaction) => transaction.statusId === 2
  ).length;
  const finishedCount = finishedTransactions.filter(
    (transaction) => transaction.statusId === 3
  ).length;

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
                color="danger"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                Pending
              </Badge>
            }
          />
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
        <CustomAccordionStyles>
          {transactions.map((row) => (
            <Accordion key={row.id}>
              <AccordionSummary sx={{}}>
                <Typography variant="h4">
                  Transaction ID: {row.transactionId}
                  {!Number.isInteger(user.userType) ? (
                    <Box>
                      {" - "}
                      {format(new Date(row.haulingDate), "MMMM dd, yyyy")}
                    </Box>
                  ) : (
                    <Box>
                      {" - "}
                      {format(new Date(row.haulingDate), "MMMM dd, yyyy")}
                      {" - "}
                      {row.Client.clientName}
                    </Box>
                  )}
                </Typography>
                {selectedTab === 0 ? (
                  <Box>
                    {Number.isInteger(user.userType) && user.userType !== 6 && (
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
                        <IconButton onClick={() => handleDeleteClick(row)}>
                          <DeleteIcon sx={{ color: "#f44336" }} />
                        </IconButton>
                      </div>
                    )}
                  </Box>
                ) : selectedTab === 1 ? (
                  <Box>
                    {Number.isInteger(user.userType) && user.userType !== 6 && (
                      <div style={{ display: "flex" }}>
                        <IconButton onClick={() => handleEditClick(row)}>
                          <EditIcon sx={{ color: "#ff9800" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)}>
                          <DeleteIcon sx={{ color: "#f44336" }} />
                        </IconButton>
                      </div>
                    )}
                  </Box>
                ) : (
                  <Box>
                    {!(user.userType === 6) && (
                      <div style={{ display: "flex" }}>
                        <IconButton onClick={() => handleEditClick(row)}>
                          <EditIcon sx={{ color: "#ff9800" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)}>
                          <DeleteIcon sx={{ color: "#f44336" }} />
                        </IconButton>
                      </div>
                    )}
                  </Box>
                )}
              </AccordionSummary>

              <CustomAccordionDetails>
                {!Number.isInteger(user.userType) && (
                  <BookedTransaction row={row} />
                )}
                {user.userType === 2 && <ScheduledTransaction row={row} />}
                {user.userType === 3 && <DispatchedTransaction row={row} />}
                {user.userType === 4 && <ReceivedTransaction row={row} />}
                {user.userType === 5 && <SortedTransaction row={row} />}
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
                  {row.statusId >= 4 && <SortedTransaction row={row} />}
                  {row.statusId >= 3 && <ReceivedTransaction row={row} />}
                  {row.statusId >= 2 &&
                    row.ScheduledTransaction[0].logisticsId !==
                      "0577d985-8f6f-47c7-be3c-20ca86021154" && (
                      <DispatchedTransaction row={row} />
                    )}
                  {/* {row.statusId >= 2 && <DispatchedTransaction row={row} />} */}
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
          ))}
        </CustomAccordionStyles>
      </Card>
    </Box>
  );
};

export default Transaction;
