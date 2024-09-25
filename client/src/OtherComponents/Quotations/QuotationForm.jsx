import React, { useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import QRCode from "qrcode.react";
import letterhead from "../../images/letterhead.jpg";
import pco_signature from "../../images/pco_signature.png";
import pm_signature from "../../images/pm_signature.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatDateFull } from "../Functions";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const QuotationForm = ({ row }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);
  const certificateRef = useRef();

  console.log(row);

  const quotationData = row.QuotationWaste[0].Quotation;

  const today = new Date();

  // Get the date one month from today
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);

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
      pdf.save(`-${row.Client.clientName}.pdf`);
    });
  };

  const qrCodeURL = `${apiUrl}/api/quotation/${quotationData.id}`;

  const generatePDFContent = () => (
    <Box
      sx={{
        position: "relative",
        minHeight: "1056px", // Ensure at least one page height
        width: "816px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "816px",
          height: "1056px",
          backgroundImage: `url(${letterhead})`,
          backgroundSize: "cover",
          pointerEvents: "none", // Ensure the background image is not clickable
        }}
      />
      {/* Content */}
      <Box
        className="pdf_container"
        sx={{
          position: "absolute",
          zIndex: 1,
          padding: "123px 38px 38px 76px",
          width: "100%",
          height: "100%",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box
            sx={{
              border: "1px solid black",
              width: "230px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              CLIENT'S COPY
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              QUOTATION
            </Typography>
          </Box>
          <Box display="flex" gap="20px">
            <Box>
              <Typography variant="h6" fontStyle="italic" textAlign="center">
                Quotation Number
              </Typography>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                {quotationData.quotationCode}
              </Typography>
              <Typography variant="h6" fontStyle="italic" textAlign="center">
                Date
              </Typography>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                {formatDateFull(today)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontStyle="italic" textAlign="center">
                Revision Number
              </Typography>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                {quotationData.revisionNumber}
              </Typography>
              <Typography variant="h6" fontStyle="italic" textAlign="center">
                Valid Until
              </Typography>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                {formatDateFull(datePlusOneMonth)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Customer Summary */}
        <Box mt={4} display="grid" gridTemplateColumns="50% 50%">
          <Box sx={{ height: "100%", border: "1px solid black", padding: 1 }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              MAIN OFFICE ADDRESS
            </Typography>
            <Typography fontWeight="bold">{row.Client.clientName}</Typography>
            <Typography fontSize="12px">{row.Client.address}</Typography>
            <Typography fontSize="12px"></Typography>
            <Box display="flex" fontSize="10px">
              <Typography>
                {row.Client.contactNumber
                  ? "Contact #: " + row.Client.contactNumber
                  : ""}
              </Typography>
              <Typography id="contact_number" pl={1}></Typography>
            </Box>
          </Box>

          <Box
            sx={{
              height: "100%",
              border: "1px solid black",
              borderLeft: "none",
              padding: 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              FIELD OFFICE ADDRESS
            </Typography>
            <Typography fontWeight="bold">{row.Client.billerName}</Typography>
            <Typography fontWeight="bold">
              {row.Client.billerContactPerson}
            </Typography>
            <Typography fontSize="12px">{row.Client.billerAddress}</Typography>
            <Typography fontSize="12px"></Typography>
            <Box display="flex" fontSize="10px">
              <Typography>
                {row.Client.billerContactNumber
                  ? "Contact #: " + row.Client.billerContactNumber
                  : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Scope of Work */}
        <Box sx={{ border: "1px solid black", padding: 0.5 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            SCOPE OF WORK
          </Typography>
          <Typography>{quotationData.scopeOfWork}</Typography>
        </Box>

        {/* Account Details */}
        <Box className="account_details" mt={4}>
          <Typography variant="h5" fontWeight="bold">
            DETAILS
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Qty.</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Vat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody id="table_data">
              {/* Dynamic rows will be inserted here */}
            </TableBody>
          </Table>
        </Box>

        {/* Remarks */}
        <Box id="remarks_container" display="flex" gap="5px" mt={2}>
          <Typography variant="h6" fontWeight="bold">
            REMARKS:
          </Typography>
          <Typography id="remarks_input" fontSize="12px"></Typography>
        </Box>

        {/* Footer Details */}
        <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2} mt={2}>
          <Box border="1px solid black" p={1}>
            <Typography variant="h6" fontWeight="bold">
              QUOTATION VALIDITY:
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="40px"
              borderTop="1px solid black"
            >
              <Typography variant="h6" fontWeight="bold" id="validity_input">
                30 DAYS
              </Typography>
            </Box>
          </Box>

          <Box border="1px solid black" p={1}>
            <Typography variant="h6" fontWeight="bold">
              TERMS OF PAYMENT
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              borderTop="1px solid black"
            >
              <Box display="flex" flexDirection="column">
                CHARGE:
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  id="charge_input"
                  textAlign="center"
                ></Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                borderLeft="1px solid black"
                pl={1}
              >
                BUYING:
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  id="buying_input"
                  textAlign="center"
                ></Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Requirements */}
        <Box mt={4} borderBottom="2px solid black">
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            REQUIREMENTS
          </Typography>
        </Box>
        <Box p={1}>
          <Typography>
            1. Memorandum of Agreement, VAT Exemption Certificate (if
            applicable)
          </Typography>
          <Typography>2. Copy of BIR Form 2303 and 2307</Typography>
        </Box>

        {/* Footer */}
        <Box className="footer" mt={4}>
          <Box>
            <Typography variant="h6">Prepared By:</Typography>
            <Box className="assignatory" mt={2}>
              <Box>
                <Box className="signature" id="marketing_signature"></Box>
                <Typography
                  fontWeight="bold"
                  id="marketing_user"
                  textDecoration="underline"
                ></Typography>
              </Box>
              <Typography>Marketing Staff / CSR</Typography>
            </Box>
          </Box>

          <Box className="footer_assignatory" mt={2}>
            <Box>
              <Box className="signature" id="noted_signature"></Box>
              <Typography
                fontWeight="bold"
                id="noted_user"
                textDecoration="underline"
              ></Typography>
            </Box>
            <Typography>General Manager</Typography>
            <QRCode value={qrCodeURL} size={80} />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      {generatePDFContent()}
      <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
        Download Quotation
      </Button>
    </Box>
  );
};

export default QuotationForm;
