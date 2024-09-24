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

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const QuotationForm = ({ row }) => {
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
      pdf.save(`-${row.Client.clientName}.pdf`);
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const formatNumber = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getLatestTreatedDate = (transactions) => {
    return transactions.reduce((latest, waste) => {
      if (waste.TreatedWasteTransaction.length > 0) {
        const latestInWaste = waste.TreatedWasteTransaction.reduce(
          (latestDate, transaction) => {
            const treatedDate = new Date(transaction.treatedDate);
            return treatedDate > new Date(latestDate)
              ? treatedDate
              : new Date(latestDate);
          },
          new Date(0)
        );
        return latestInWaste > new Date(latest)
          ? latestInWaste
          : new Date(latest);
      }
      return new Date(latest);
    }, new Date(0));
  };

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Determine suffix
    const suffix = (day) => {
      if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const suffixStr = suffix(day);

    // Return an object with day, suffix, and the rest of the date string
    return {
      day: day,
      suffix: suffixStr,
      dateString: `day of ${month} ${year}`,
    };
  };

  //   const qrCodeURL = `${apiUrl}/api/certificate/${certifiedTransaction.id}`;

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
          <Box>
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
              <Typography variant="h6" fontStyle="italic">
                Quotation Number
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                id="qlf_form_no_container"
              ></Typography>
              <Typography variant="h6" fontStyle="italic">
                Date
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                id="date_made_container"
              ></Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontStyle="italic">
                Revision Number
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                id="revision_number_container"
              ></Typography>
              <Typography variant="h6" fontStyle="italic">
                Valid Until
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                id="valid_until_container"
              ></Typography>
            </Box>
          </Box>
        </Box>

        {/* Customer Summary */}
        <Box className="customer_summary" mt={4}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              MAIN OFFICE ADDRESS
            </Typography>
            <Typography
              id="client_name_container"
              fontWeight="bold"
            ></Typography>
            <Typography id="address_container" fontSize="10px"></Typography>
            <Typography id="tin_id_container" fontSize="10px"></Typography>
            <Typography
              id="nature_of_business_container"
              fontSize="10px"
            ></Typography>
            <Box display="flex" fontSize="10px">
              <Typography>Contact #:</Typography>
              <Typography id="contact_number" pl={1}></Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="h5" fontWeight="bold">
              FIELD OFFICE ADDRESS
            </Typography>
            <Typography
              id="client_name_container2"
              fontWeight="bold"
            ></Typography>
            <Typography id="address_container2" fontSize="10px"></Typography>
            <Typography id="tin_id_container2" fontSize="10px"></Typography>
            <Typography
              id="nature_of_business_container2"
              fontSize="10px"
            ></Typography>
          </Box>
        </Box>

        {/* Scope of Work */}
        <Box className="scope" mt={4}>
          <Typography variant="h5" fontWeight="bold">
            SCOPE OF WORK
          </Typography>
          <Typography id="scope_of_work_input"></Typography>
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
