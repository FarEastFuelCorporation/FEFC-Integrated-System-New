import React, { useRef } from "react";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";
import BillingStatementForm from "../BillingStatement/BillingStatementForm";
import { timestampDate, parseTimeString } from "../Functions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BillingApprovalTransaction = ({ row, user }) => {
  const certificateRef = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingApprovalTransaction =
    row.BilledTransaction[0].BillingApprovalTransaction;

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, save the PDF
        pdf.save(
          `${row.BilledTransaction[0].billingNumber}-${row.Client.clientName}.pdf`
        );
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  const handleOpenPDFInNewTab = () => {
    console.log(certificateRef);
    const input = certificateRef.current;

    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, generate the PDF
        const pdfOutput = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  return (
    <Box>
      {row.statusId === 8 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <AssignmentTurnedInIcon
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
              For Billing Approval
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <AssignmentTurnedInIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
              }}
            />
          </CircleLogo>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color={colors.greenAccent[400]}>
                Billing Approved
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: {
                  xs: "start",
                  md: "end",
                },
              }}
            >
              <Typography variant="h5">
                {billingApprovalTransaction.createdAt
                  ? timestampDate(billingApprovalTransaction.createdAt)
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h5">
            Approved Date:{" "}
            {billingApprovalTransaction.approvedDate
              ? format(
                  new Date(billingApprovalTransaction.approvedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Approved Time:{" "}
            {billingApprovalTransaction.approvedTime
              ? format(
                  parseTimeString(billingApprovalTransaction.approvedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {billingApprovalTransaction.remarks
              ? billingApprovalTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Approved By:{" "}
            {`${billingApprovalTransaction.Employee.firstName || ""} ${
              billingApprovalTransaction.Employee.lastName || ""
            }`}
          </Typography>
          {row.statusId > 8 && (
            <>
              <Box sx={{ position: "absolute", left: "-9999px", zIndex: 9999 }}>
                <BillingStatementForm statementRef={certificateRef} row={row} />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownloadPDF}
                >
                  Download Billing Statement
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOpenPDFInNewTab}
                >
                  View Billing Statement
                </Button>
              </Box>
            </>
          )}
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default BillingApprovalTransaction;
