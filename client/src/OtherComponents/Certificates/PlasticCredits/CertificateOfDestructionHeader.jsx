import React from "react";
import { Box, Typography } from "@mui/material";

const CertificateOfDestructionHeader = ({ row, certifiedTransaction }) => {
  return (
    <Box>
      <Typography variant="h6" component="h4" sx={{ textAlign: "right" }}>
        FEFC-PCC-IP-241009001-100000KGS
      </Typography>
      <Typography
        variant="h2"
        align="center"
        mt={3}
        sx={{
          fontSize: "2rem",
          fontFamily: "'Times New Roman', Times, serif",
          textAlign: "center",
        }}
      >
        PLASTIC CREDIT CERTIFICATE
      </Typography>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="h2"
          id="table_company"
          sx={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "2rem",
            fontWeight: "bold",
            margin: "0px 0px 8px",
          }}
        >
          IKANO PHILIPPINES
          {/* {row.Client.clientName} */}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "22px",
          margin: "16px 0 8px",
        }}
      >
        Far East Fuel Corporation certificates that:
      </Typography>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "22px",
          margin: "16px 0 8px",
        }}
      >
        The Volume of plastic waste amounting to 100,000.00 Kgs has been
        recovered and diverted on behalf of IKANO PHILIPPINES and has been
        awarded with equivalent volume as Plastic Credits
      </Typography>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "22px",
          margin: "16px 0 8px",
        }}
      >
        The Plastic Credits are designated by the following serial number on the
        <br />
        FEFC Plastic Credit Registry: FEFC-PCC-IP-241009001-100000KGS
      </Typography>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "20px",
        }}
      ></Typography>
    </Box>
  );
};

export default CertificateOfDestructionHeader;
