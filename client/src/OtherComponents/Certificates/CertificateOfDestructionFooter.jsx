import React from "react";
import { Box, Typography } from "@mui/material";
import {
  formatDateWithSuffix,
  formatNumber,
  getLatestTreatedDate,
} from "../Functions";
import QRCode from "qrcode.react";
import pco_signature from "../../images/pco_signature.png";
import pm_signature from "../../images/pm_signature.png";

export const CertificateOfDestructionFooter1 = ({
  row,
  sortedWasteTransaction,
}) => {
  const certifiedTransaction = row.CertifiedTransaction[0];

  const typeOfWeight = certifiedTransaction.typeOfWeight;

  const weightsByUnit = sortedWasteTransaction.reduce((acc, waste) => {
    const unit = waste.QuotationWaste?.unit;

    const weight =
      typeOfWeight === "CLIENT WEIGHT" ? waste.clientWeight : waste.weight;

    acc[unit] = (acc[unit] || 0) + (parseFloat(weight) || 0); // Group by unit
    return acc;
  }, {});

  return (
    <Box>
      <Typography
        id="certification_text"
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "14px",
          textAlign: "justify",
          marginTop: 1,
        }}
      >
        A Total of{" "}
        <b>
          {Object.entries(weightsByUnit)
            .map(([unit, weight]) => `${formatNumber(weight)} ${unit}`)
            .reduce((acc, curr, index, arr) => {
              if (index === 0) return curr; // First item
              if (index === arr.length - 1) return `${acc} and ${curr}`; // Last item
              return `${acc}, ${curr}`; // Middle items
            }, "")}
        </b>
        That is/are transported by <b>FAR EAST FUEL CORPORATION</b> to our TSD
        facility located at No. 888 Purok 5, Irabagon St., Barangay Anyatam, San
        Ildefonso, Bulacan with <b>TSD No. OL-TR-R3-14-000152.</b>
      </Typography>
      <Box sx={{ display: "flex", mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Certified this
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginLeft: "5px" }}
          id="certification"
        >
          {
            formatDateWithSuffix(getLatestTreatedDate(sortedWasteTransaction))
              .day
          }
        </Typography>
        <Typography
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontSize: "8px",
            marginRight: "3px",
            fontWeight: "bold",
          }}
          id="certification2"
        >
          {
            formatDateWithSuffix(getLatestTreatedDate(sortedWasteTransaction))
              .suffix
          }
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          id="certification3"
        >
          {
            formatDateWithSuffix(getLatestTreatedDate(sortedWasteTransaction))
              .dateString
          }
        </Typography>
      </Box>
    </Box>
  );
};

export const CertificateOfDestructionFooter2 = ({ qrCodeURL }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Certified By:
      </Typography>
      <Box
        sx={{
          position: "relative",
          width: "700px",
          display: "grid",
          gridTemplateColumns: "320px 1fr 100px",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <u>LAWRENCE R. ANTONIO</u>
          </Typography>
          <Typography
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "13px",
            }}
          >
            Pollution Control Officer
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "13px",
            }}
          >
            COA No. 2023-RIII-5575
          </Typography>
          <Box
            component="img"
            src={pco_signature}
            alt="PCO Signature"
            sx={{
              position: "absolute",
              top: "-70px",
              left: "90px",
              width: "150px",
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", paddingRight: "50px" }}
          >
            <u>CRIS DURAN</u>
          </Typography>
          <Typography
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "13px",
              paddingRight: "50px",
            }}
          >
            Plant Manager
          </Typography>
          <Box
            component="img"
            src={pm_signature}
            alt="PM Signature"
            sx={{
              position: "absolute",
              top: "-70px",
              left: "360px",
              width: "150px",
            }}
          />
        </Box>
        <Box sx={{ marginTop: -5 }}>
          <QRCode value={qrCodeURL} size={80} />
        </Box>
      </Box>
      <Box mt={2}>
        <Typography sx={{ fontSize: "10px" }}>
          Note: This is a system generated certificate. To verify the
          authenticity of this file, kindly scan the generated QR Code using
          your QR Code scanner / reader
        </Typography>
      </Box>
    </Box>
  );
};
