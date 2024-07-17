import React, { useRef, useEffect, useState } from "react";
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
import letterhead from "../../images/letterhead.jpg";
import pco_signature from "../../images/pco_signature.png";
import pm_signature from "../../images/pm_signature.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certificate = () => {
  const certificateRef = useRef();
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    // Calculate page count based on content height
    const input = certificateRef.current;
    if (input) {
      const contentHeight = input.offsetHeight;
      const pageHeight = 1056;
      const calculatedPageCount = Math.ceil(contentHeight / pageHeight) || 1; // Ensure at least one page
      setPageCount(calculatedPageCount);
    }
  }, []);

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;
    const margin = 10;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, pageHeight], // Page size in px
      });

      let yPosition = 0;
      let contentHeight = input.offsetHeight;

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageContentHeight = Math.min(pageHeight, contentHeight);

        // Add background image for each page
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -(i * pageHeight),
          pageWidth,
          pageHeight
        );

        // Add page number
        const pageNumber = `Page ${i + 1}/${pageCount}`;
        pdf.setFontSize(12);
        pdf.text(pageNumber, pageWidth - 50, pageHeight - 10);

        contentHeight -= pageHeight;
      }

      pdf.save("certificate.pdf");
    });
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
        Download Certificate
      </Button>
      <Box
        ref={certificateRef}
        sx={{
          position: "relative",
          padding: "123px 38px 38px 76px",
          minHeight: "1056px", // Ensure at least one page height
          width: "816px",
          backgroundColor: "white",
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
            C E R T I F I C A T I O N
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
            <Typography variant="h6" component="h4">
              C. No.{" "}
            </Typography>
            <Typography id="df_no" sx={{ fontWeight: "bold" }}>
              COD-2024-0001
            </Typography>
          </Box>
          <Box sx={{ textAlign: "justify", mt: 2 }}>
            <Typography
              sx={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "15px",
                margin: 0,
              }}
            >
              Pursuant to the provisions of Republic Act 9003 also known as
              Ecological Solid Waste Management Act of 2000 we are issuing this
              certificate of destruction to:
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography
              variant="h2"
              id="table_company"
              sx={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "18px",
                margin: "0px 0px 8px",
              }}
            >
              Company Name
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
              Company Address
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "13px",
              margin: "16px 0 8px",
            }}
          >
            For the waste(s) processed/ treated as follows:
          </Typography>
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
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ border: "white" }}>
                  <TableCell align="center">Column 1</TableCell>
                  <TableCell align="center">Column 2</TableCell>
                  <TableCell align="center">Column 3</TableCell>
                  <TableCell align="center">Column 4</TableCell>
                  <TableCell align="center">Column 5</TableCell>
                  <TableCell align="center">Column 6</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Example of more rows */}
                {[...Array(5).keys()].map((index) => (
                  <TableRow key={index} sx={{ border: "white" }}>
                    <TableCell align="center">Data {index + 1}</TableCell>
                    <TableCell align="center">Data {index + 2}</TableCell>
                    <TableCell align="center">Data {index + 3}</TableCell>
                    <TableCell align="center">Data {index + 4}</TableCell>
                    <TableCell align="center">Data {index + 5}</TableCell>
                    <TableCell align="center">Data {index + 6}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            id="certification_text"
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "14px",
              textAlign: "justify",
              marginTop: 2,
            }}
          >
            A Total of 4,396.00 Kgs. That is/are transported by{" "}
            <b>FAR EAST FUEL CORPORATION</b> to our TSD facility located at No.
            888 Purok 5, Irabagon St., Barangay Anyatam, San Ildefonso, Bulacan
            with <b>TSD No. OL-TR-R3-14-000152.</b>
          </Typography>
          <Box sx={{ display: "flex", mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Certified this
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", margin: "0 5px" }}
              id="certification"
            >
              Date
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
              Month
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold" }}
              id="certification3"
            >
              Year
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Certified By:
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "660px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
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
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                <u>CRIS DURAN</u>
              </Typography>
              <Typography
                sx={{
                  fontFamily:
                    "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                  fontSize: "13px",
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
                  left: "420px",
                  width: "150px",
                }}
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: "10px" }}>
              Not Valid Without FEFC Dry Seal.
            </Typography>
            <Typography sx={{ fontSize: "10px" }}>Cc</Typography>
            <Typography sx={{ fontSize: "10px" }}>DENR-EMB R3</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Certificate;
