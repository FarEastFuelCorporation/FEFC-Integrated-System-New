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
import CertificateOfDestruction from "./Certificates/Certificate";

const Transaction = ({
  user,
  buttonText,
  pendingTransactions,
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
    selectedTab === 0 ? pendingTransactions : finishedTransactions;

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
          }}
        >
          <Tab label="Pending" />
          <Tab label="Finished" />
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
                      {row.clientName} {" - "}
                      {format(new Date(row.haulingDate), "MMMM dd, yyyy")}
                    </Box>
                  )}
                </Typography>
                {selectedTab === 0 ? (
                  <Box>
                    {!(
                      Number.isInteger(user.userType) && user.userType === 6
                    ) && (
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
                  {row.statusId >= 7 && (
                    <CertifiedTransaction
                      row={row}
                      handleOpenModal={handleOpenModal}
                      handleDeleteClick={handleDeleteClick}
                      user={user}
                    />
                  )}
                  <CertificateOfDestruction row={row} />
                  {row.statusId >= 6 && (
                    <TreatedTransaction
                      row={row}
                      handleOpenModal={handleOpenModal}
                      handleDeleteClick={handleDeleteClick}
                      user={user}
                    />
                  )}
                  {row.statusId >= 5 && <SortedTransaction row={row} />}
                  {row.statusId >= 4 && <ReceivedTransaction row={row} />}
                  {row.statusId >= 3 && <DispatchedTransaction row={row} />}
                  {row.statusId >= 2 && <ScheduledTransaction row={row} />}
                  {row.statusId >= 1 && <BookedTransaction row={row} />}
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
