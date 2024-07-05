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
import BookedTransaction from "./Transactions/BookedTransaction";
import ScheduledTransaction from "./Transactions/ScheduledTransaction";
import DispatchedTransaction from "./Transactions/DispatchedTransaction";
import { tokens } from "../theme";

const Transaction = ({
  user,
  buttonText,
  pendingTransactions,
  finishedTransactions,
  handleOpenModal,
  handleEditClick,
  handleDeleteClick,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const transactions =
    selectedTab === 0 ? pendingTransactions : finishedTransactions;

  return (
    <Box mt="40px">
      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
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
                    {!Number.isInteger(user.userType) ? (
                      <Box></Box>
                    ) : (
                      <Button
                        onClick={() =>
                          handleOpenModal(
                            row.id,
                            row.bookedTransactionId,
                            row.BookedTransaction.QuotationTransportation
                              .vehicleTypeId
                          )
                        }
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
                  <div style={{ display: "flex" }}>
                    <IconButton onClick={() => handleEditClick(row.id)}>
                      <EditIcon sx={{ color: "#ff9800" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(row.id)}>
                      <DeleteIcon sx={{ color: "#f44336" }} />
                    </IconButton>
                  </div>
                )}
              </AccordionSummary>
              <CustomAccordionDetails>
                <BookedTransaction row={row} />
                {row.statusId >= 1 && <ScheduledTransaction row={row} />}
                {row.statusId >= 2 && <DispatchedTransaction row={row} />}
              </CustomAccordionDetails>
            </Accordion>
          ))}
        </CustomAccordionStyles>
      </Card>
    </Box>
  );
};

export default Transaction;
