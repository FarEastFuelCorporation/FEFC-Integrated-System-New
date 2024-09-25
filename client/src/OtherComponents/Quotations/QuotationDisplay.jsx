import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import QRCode from "qrcode.react";
import letterhead from "../../images/letterhead.jpg";
import accountingManagerSignature from "../../images/CARDINEZ_DAISY.png";
import vicePresidentSignature from "../../images/DE_VERA_EXEQUIEL.png";
import { formatDateFull, formatNumber } from "../Functions";
import SignatureComponent from "../SignatureComponent ";
import axios from "axios";
import { useParams } from "react-router-dom";

const QuotationDisplay = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams(); // Extracting ID from the URL
  const [quotationData, setQuotationData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [quotationWaste, setQuotationWaste] = useState(null);
  const [quotationTransportation, setQuotationTransportation] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  // Get the date one month from today
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        console.log("Fetching quotation...");
        const response = await axios.get(`${apiUrl}/api/quotationForm/${id}`);
        console.log("Fetched Quotation Data:", response.data.quotation);

        // Ensure this data exists before setting
        if (response.data.quotation) {
          setQuotationData(response.data.quotation);
        } else {
          console.warn("Quotation data is undefined.");
        }
      } catch (error) {
        console.error("Error fetching the quotation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id, apiUrl]);

  useEffect(() => {
    if (quotationData) {
      console.log("Updated Quotation Data:", quotationData); // This should log the updated value
      setClientData(quotationData.Client);
      setQuotationWaste(quotationData.QuotationWaste);
      setQuotationTransportation(quotationData.QuotationTransportation);
    }
  }, [quotationData]); // This effect runs when quotationData changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quotationData) {
    return <div>No quotation found.</div>;
  }

  const qrCodeURL = `${apiUrl}/api/quotationForm/${quotationData.id}`;

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
        <Box mt={2} display="grid" gridTemplateColumns="50% 50%">
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            MAIN OFFICE ADDRESS
          </Typography>
          {clientData.billerName && (
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              FIELD OFFICE ADDRESS
            </Typography>
          )}
        </Box>
        <Box display="grid" gridTemplateColumns="50% 50%">
          <Box sx={{ height: "100%", border: "1px solid black", padding: 1 }}>
            <Typography fontWeight="bold">{clientData.clientName}</Typography>
            <Typography fontSize="12px">{clientData.address}</Typography>
            <Typography fontSize="12px"></Typography>
            <Box display="flex" fontSize="10px">
              <Typography>
                {clientData.contactNumber
                  ? "Contact #: " + clientData.contactNumber
                  : ""}
              </Typography>
              <Typography id="contact_number" pl={1}></Typography>
            </Box>
          </Box>

          {clientData.billerName && (
            <Box
              sx={{
                height: "100%",
                border: "1px solid black",
                borderLeft: "none",
                padding: 1,
              }}
            >
              <Typography fontWeight="bold">
                {clientData.billerName ? clientData.billerName : ""}
              </Typography>
              <Typography fontWeight="bold">
                {clientData.billerContactPerson}
              </Typography>
              <Typography fontSize="12px">
                {clientData.billerAddress}
              </Typography>
              <Typography fontSize="12px"></Typography>
              <Box display="flex" fontSize="10px">
                <Typography>
                  {clientData.billerContactNumber
                    ? "Contact #: " + clientData.billerContactPerson
                    : ""}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Scope of Work */}
        <Typography mt={1} variant="h5" fontWeight="bold" textAlign="center">
          SCOPE OF WORK
        </Typography>
        <Box sx={{ border: "1px solid black", padding: 0.5 }}>
          <Typography>{quotationData.scopeOfWork}</Typography>
        </Box>

        {/* Account Details */}
        {quotationWaste.length !== 0 && (
          <Box className="account_details" mt={1}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              WASTE DETAILS
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Item
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Qty.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "40px",
                    }}
                  >
                    Unit
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "70px",
                    }}
                  >
                    Unit Price
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "70px",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    Mode
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      color: "black",
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    Vat Calculation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody id="table_data">
                {quotationWaste.map((waste, index) => (
                  <TableRow key={index} sx={{ border: "black" }}>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {waste.wasteName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {waste.quantity ? waste.quantity : 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {waste.unit}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {formatNumber(waste.unitPrice)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {formatNumber(waste.unitPrice)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {waste.mode}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {waste.vatCalculation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
        {quotationTransportation.length !== 0 && (
          <Box className="account_details" mt={1}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              TRANSPORTATION DETAILS
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Item
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Vehicle
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Area
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Qty.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "40px",
                    }}
                  >
                    Unit
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "70px",
                    }}
                  >
                    Unit Price
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "70px",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      borderRight: "none",
                      color: "black",
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    Mode
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "2px",
                      border: "1px solid black",
                      color: "black",
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    Vat Calculation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody id="table_data">
                {quotationTransportation.map((transportation, index) => (
                  <TableRow key={index} sx={{ border: "black" }}>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderTop: "none",
                        borderRight: "none",
                        color: "black",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {transportation.VehicleType.typeOfVehicle}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {transportation.haulingArea}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {transportation.quantity ? transportation.quantity : 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {transportation.unit}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {formatNumber(transportation.unitPrice)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {formatNumber(transportation.unitPrice)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderRight: "none",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {transportation.mode}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid black",
                        borderTop: "none",
                        color: "black",
                      }}
                    >
                      {transportation.vatCalculation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Remarks */}
        <Box id="remarks_container" display="flex" gap="5px" mt={1}>
          <Typography variant="h6" fontWeight="bold">
            REMARKS:
          </Typography>
          <Typography fontSize="12px">{quotationData.remarks}</Typography>
        </Box>

        {/* Footer Details */}
        <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2} mt={1}>
          <Box border="1px solid black">
            <Typography variant="h6" fontWeight="bold" textAlign="center">
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

          <Box border="1px solid black">
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              TERMS OF PAYMENT
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              borderTop="1px solid black"
            >
              <Box display="flex" flexDirection="column" px={1}>
                CHARGE:
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  id="charge_input"
                  textAlign="center"
                >
                  {parseInt(quotationData.termsCharge)
                    ? `${parseInt(quotationData.termsCharge)} Days`
                    : quotationData.termsCharge}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                borderLeft="1px solid black"
                px={1}
              >
                BUYING:
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  id="buying_input"
                  textAlign="center"
                >
                  {" "}
                  {parseInt(quotationData.termsBuying)
                    ? `${parseInt(quotationData.termsBuying)} Days`
                    : quotationData.termsBuying === 0
                    ? "N/A"
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Requirements */}
        <Box mt={1} borderBottom="2px solid black">
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
        <Box
          mt={1}
          sx={{ display: "grid", gridTemplateColumns: "25% 22% 22% 19% 12%" }}
        >
          <Box sx={{ border: "1px solid black" }}>
            <Typography variant="h6" pl={2}>
              Prepared By:
            </Typography>
            <Box mt={3}>
              <Box>
                <Box></Box>
                <Typography
                  fontWeight="bold"
                  textDecoration=""
                  textAlign="center"
                  position="relative"
                  sx={{ textDecoration: "underline" }}
                >
                  <SignatureComponent
                    signature={quotationData.IdInformation.signature}
                    style={{ top: "-40px", left: "30px" }}
                  />
                  {quotationData.IdInformation.first_name}{" "}
                  {quotationData.IdInformation.last_name}
                </Typography>
              </Box>
              <Typography textAlign="center">Marketing Staff / CSR</Typography>
            </Box>
          </Box>

          <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
            <Typography variant="h6" pl={2}>
              Checked By:
            </Typography>
            <Box mt={3}>
              <Typography
                fontWeight="bold"
                id="noted_user"
                textAlign="center"
                position="relative"
                sx={{ textDecoration: "underline" }}
              >
                <SignatureComponent signature={accountingManagerSignature} />
                DAISY CARDINEZ
              </Typography>
            </Box>
            <Typography textAlign="center">Accounting Manager</Typography>
          </Box>
          <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
            <Typography variant="h6" pl={2}>
              Checked By:
            </Typography>
            <Box mt={3}>
              <Typography
                fontWeight="bold"
                id="noted_user"
                textAlign="center"
                position="relative"
                sx={{ textDecoration: "underline" }}
              >
                <SignatureComponent signature={vicePresidentSignature} />
                EXEQUIEL DE VERA
              </Typography>
            </Box>
            <Typography textAlign="center">Vice President</Typography>
          </Box>
          <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
            <Typography variant="h6" pl={2}>
              Conforme By:
            </Typography>
            <Box mt={2}>
              <Typography
                fontWeight="bold"
                id="noted_user"
                textDecoration="underline"
                textAlign="center"
              ></Typography>
            </Box>
            <Typography textAlign="center"></Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid black",
              borderLeft: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <QRCode value={qrCodeURL} size={80} />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        marginTop: "100px",
      }}
    >
      {/* Conditional rendering of generatePDFContent() */}
      {clientData ? (
        generatePDFContent() // Call only if quotationData is available
      ) : (
        <Typography variant="h6">No quotation data available</Typography>
      )}
    </Box>
  );
};

export default QuotationDisplay;
