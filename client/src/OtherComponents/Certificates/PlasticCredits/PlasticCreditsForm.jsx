import React, { useRef } from "react";
import { Box, TableContainer, Paper, Button } from "@mui/material";

import letterhead from "../../../images/letterhead2.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateOfDestructionHeader from "./CertificateOfDestructionHeader";
import {
  CertificateOfDestructionFooter1,
  CertificateOfDestructionFooter2,
} from "./CertificateOfDestructionFooter";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const PlasticCreditsForm = ({ row, verify = null }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);
  const certificateRef = useRef();

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, pageHeight], // Page size in px
      });

      // Add the captured image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      // Save the generated PDF
      pdf.save(`FEFC-PCC-IP-241009001-100000KGS-IKANO PHILIPPINES.pdf`);
    });
  };

  const qrCodeURL = `${apiUrl}/certificate/`;

  const generatePDFContent = () => (
    <Box
      ref={certificateRef}
      sx={{
        position: "absolute",
        left: verify ? "0" : "-9999px",
        padding: "123px 38px 38px 76px",
        minHeight: "1056px", // Ensure at least one page height
        width: "816px",
        backgroundColor: "white",
        color: "black",
        // zIndex: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "816px",
          height: "1056px",
          zIndex: 0,
          backgroundImage: `url(${letterhead})`,
          backgroundSize: "cover",
          pointerEvents: "none", // Ensure the background image is not clickable
        }}
      />
      <Box sx={{ zIndex: 1, position: "relative" }}>
        <CertificateOfDestructionHeader
        // row={row}
        // certifiedTransaction={certifiedTransaction}
        />
        <TableContainer
          component={Paper}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "white",
              color: "black !important",
            },
            "& .MuiTableContainer-root": {
              backgroundColor: "white",
              color: "black !important",
            },
            fontFamily: "Times New Roman",
            backgroundColor: "white",
          }}
        ></TableContainer>
        <CertificateOfDestructionFooter1
          row={row}
          // sortedWasteTransaction={sortedWasteTransaction}
        />
        <CertificateOfDestructionFooter2 qrCodeURL={qrCodeURL} />
      </Box>
    </Box>
  );

  return (
    <Box>
      {verify ? (
        ""
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadPDF}
        >
          Download Certificate
        </Button>
      )}

      {generatePDFContent()}
    </Box>
  );
};

export default PlasticCreditsForm;
