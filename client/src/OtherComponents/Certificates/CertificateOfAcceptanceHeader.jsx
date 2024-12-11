import React from "react";
import { Box, Typography } from "@mui/material";

const CertificateOfAcceptanceHeader = ({ row, certifiedTransaction }) => {
  return (
    <Box>
      <Typography
        variant="h2"
        align="center"
        sx={{
          fontSize: "2rem",
          fontFamily: "'Times New Roman', Times, serif",
          textAlign: "center",
          margin: 0,
        }}
      >
        CERTIFICATE OF ACCEPTANCE
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          mt: 2,
        }}
      >
        <Typography id="df_no" sx={{ fontWeight: "bold" }}>
          {certifiedTransaction.certificateNumber}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", my: 2 }}>
        <Typography
          variant="h2"
          id="table_company"
          sx={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "18px",
            margin: "0px 0px 8px",
          }}
        >
          {row.TransporterClient
            ? row.TransporterClient.clientName
            : row.Client.clientName}
        </Typography>
        <Typography
          id="table_company_address"
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontSize: "13px",
            margin: 0,
          }}
        >
          {row.TransporterClient
            ? row.TransporterClient.address
            : row.Client.address}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "justify", my: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "15px",
            margin: 0,
          }}
        >
          This is to certify that {row.Client.clientName}, located at{" "}
          {row.TransporterClient
            ? row.TransporterClient.address
            : row.Client.address}
          , has reviewed and officially accepted the following items provided by
          FAR EAST FUEL CORPORATION
        </Typography>
      </Box>
    </Box>
  );
};

export default CertificateOfAcceptanceHeader;
