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

const CertificateOfDestruction = ({ row }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);
  const certificateRef = useRef();

  const certifiedTransaction =
    row.ScheduledTransaction[0].DispatchedTransaction[0].ReceivedTransaction[0]
      .SortedTransaction[0].CertifiedTransaction[0];

  const sortedWasteTransaction =
    row.ScheduledTransaction[0].DispatchedTransaction[0].ReceivedTransaction[0]
      .SortedTransaction[0].SortedWasteTransaction;

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
      pdf.save(
        `${certifiedTransaction.certificateNumber}-${row.Client.clientName}.pdf`
      );
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

  const totalWeight = sortedWasteTransaction.reduce((total, waste) => {
    // Add the weight of the current waste to the total
    return total + (parseFloat(waste.weight) || 0); // parseFloat to ensure it's a number
  }, 0);

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

  const qrCodeURL = `${apiUrl}/certificate/${certifiedTransaction.id}`;

  const generatePDFContent = () => (
    <Box
      ref={certificateRef}
      sx={{
        position: "absolute",
        left: "-9999px", // Move off-screen
        padding: "123px 38px 38px 76px",
        minHeight: "1056px", // Ensure at least one page height
        width: "816px",
        backgroundColor: "white",
        color: "black",
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
            {certifiedTransaction.certificateNumber}
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
            {row.Client.clientName}
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
            {row.Client.address}
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
            fontFamily: "Times New Roman",
            backgroundColor: "white",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ border: "black" }}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "4px",
                    border: "2px solid black",
                    color: "black",
                  }}
                >
                  Date Hauled
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "4px",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    borderBottom: "2px solid black",
                    color: "black",
                  }}
                >
                  Class and Description of Waste
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "4px",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    borderBottom: "2px solid black",
                    color: "black",
                  }}
                >
                  Waste Code
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "4px",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    borderBottom: "2px solid black",
                    color: "black",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "4px",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    borderBottom: "2px solid black",
                    color: "black",
                  }}
                >
                  Destruction Process
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "4px",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    borderBottom: "2px solid black",
                    color: "black",
                  }}
                >
                  Date of Completion
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWasteTransaction.map((waste, index) => (
                <TableRow key={index} sx={{ border: "black" }}>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "4px",
                      border: "2px solid black",
                      color: "black",
                    }}
                  >
                    {formatDate(row.haulingDate)}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "4px",
                      borderTop: "2px solid black",
                      borderRight: "2px solid black",
                      borderBottom: "2px solid black",
                      color: "black",
                    }}
                  >
                    {waste.wasteName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "4px",
                      borderTop: "2px solid black",
                      borderRight: "2px solid black",
                      borderBottom: "2px solid black",
                      color: "black",
                    }}
                  >
                    {row.QuotationWaste.TypeOfWaste.wasteCode}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "4px",
                      borderTop: "2px solid black",
                      borderRight: "2px solid black",
                      borderBottom: "2px solid black",
                      color: "black",
                    }}
                  >
                    {`${formatNumber(waste.weight)} ${row.QuotationWaste.unit}`}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "4px",
                      borderTop: "2px solid black",
                      borderRight: "2px solid black",
                      borderBottom: "2px solid black",
                      color: "black",
                    }}
                  >
                    {
                      waste.TreatedWasteTransaction[0].TreatmentMachine
                        .TreatmentProcess.treatmentProcess
                    }
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "4px",
                      borderTop: "2px solid black",
                      borderRight: "2px solid black",
                      borderBottom: "2px solid black",
                      color: "black",
                    }}
                  >
                    {waste.TreatedWasteTransaction.reduce(
                      (latest, transaction) => {
                        const treatedDate = new Date(transaction.treatedDate);
                        return treatedDate > new Date(latest)
                          ? formatDate(transaction.treatedDate)
                          : formatDate(latest);
                      },
                      new Date(0)
                    )}
                  </TableCell>
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
            marginTop: 1,
          }}
        >
          A Total of{" "}
          <b>{`${formatNumber(totalWeight)} ${row.QuotationWaste.unit}`}</b>{" "}
          That is/are transported by <b>FAR EAST FUEL CORPORATION</b> to our TSD
          facility located at No. 888 Purok 5, Irabagon St., Barangay Anyatam,
          San Ildefonso, Bulacan with <b>TSD No. OL-TR-R3-14-000152.</b>
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
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Certified By:
        </Typography>
        <Box
          sx={{
            position: "relative",
            width: "700px",
            display: "grid",
            gridTemplateColumns: "320px 1fr 210px",
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
                left: "310px",
                width: "150px",
              }}
            />
          </Box>
          <Box sx={{ marginTop: -2, display: "flex" }}>
            <QRCode value={qrCodeURL} size={80} />
            <Box>
              <Typography sx={{ fontSize: "10px" }}>
                This is a computer generated certificate.
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                To verify the authenticity of this file, kindly scan the
                generated QR Code using your QR Code scanner / reader
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
        Download Certificate
      </Button>
      {generatePDFContent()}
    </Box>
  );
};

export default CertificateOfDestruction;
