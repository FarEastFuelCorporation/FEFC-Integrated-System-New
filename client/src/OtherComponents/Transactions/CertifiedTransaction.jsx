import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ApprovalIcon from "@mui/icons-material/Approval";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

const CertifiedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    statusId,
    certifiedCreatedDate,
    certifiedCreatedTime,
    certifiedDate,
    certifiedTime,
    certifiedRemarks,
    certifiedCreatedBy,
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

  return (
    <Box>
      {statusId === 6 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <ApprovalIcon
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
              For Certification
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <ApprovalIcon
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
              Certified
            </Typography>
            <Typography variant="h5">
              {certifiedCreatedDate} {certifiedCreatedTime}
            </Typography>
          </Box>
          <Typography variant="h5">
            Certified Date:{" "}
            {certifiedDate
              ? format(new Date(certifiedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Certified Time:{" "}
            {certifiedTime
              ? format(parseTimeString(certifiedTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks: {certifiedRemarks ? certifiedRemarks : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Certified By: {certifiedCreatedBy}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default CertifiedTransaction;
