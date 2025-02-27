import React from "react";
import { Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";
import accountingManagerSignature from "../../images/CARDINEZ_DAISY.png";
import presidentSignature from "../../images/MANGARON_RUEL_NEW.png";
import SignatureComponent from "../SignatureComponent ";

const QuotationFooter = ({ quotationData, qrCodeURL }) => {
  const today = new Date();
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);

  return (
    <Box>
      {/* Remarks */}
      <Box id="remarks_container" display="flex" gap="5px" mt={1}>
        <Typography variant="h6" fontWeight="bold">
          REMARKS:
        </Typography>
        <Box fontSize="12px">
          {quotationData?.remarks ? (
            quotationData?.remarks.split("*").map(
              (remark, index) =>
                remark.trim() && (
                  <Typography key={index} fontSize="12px">
                    • {remark.trim()}
                  </Typography>
                )
            )
          ) : (
            <Typography fontSize="12px">No remarks available.</Typography>
          )}
        </Box>
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
                {quotationData?.termsCharge !== "N/A"
                  ? quotationData?.termsChargeDays === 0
                    ? `CASH ${quotationData?.termsCharge}`
                    : quotationData?.termsChargeDays === 1
                    ? `${quotationData?.termsChargeDays} DAY ${quotationData?.termsCharge}`
                    : `${quotationData?.termsChargeDays} DAYS ${quotationData?.termsCharge}`
                  : "N/A"}

                {quotationData?.termsCharge !== "N/A" && quotationData?.isPDC
                  ? ` (${quotationData?.termsPDCDays} ${
                      quotationData?.termsPDCDays === 1 ? "DAY PDC" : "DAYS PDC"
                    })`
                  : ""}
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
                {quotationData?.termsBuying !== "N/A"
                  ? quotationData?.termsBuying === "OFFSET ON CHARGE WASTE"
                    ? quotationData?.termsBuying
                    : quotationData?.termsBuyingDays === 0
                    ? `CASH ${quotationData?.termsBuying}`
                    : quotationData?.termsBuyingDays === 1
                    ? `${quotationData?.termsBuyingDays} DAY ${quotationData?.termsBuying}`
                    : `${quotationData?.termsBuyingDays} DAYS ${quotationData?.termsBuying}`
                  : "N/A"}

                {quotationData?.termsBuying !== "N/A" && quotationData?.isPDC
                  ? ` (${quotationData?.termsPDCDays} ${
                      quotationData?.termsPDCDays === 1 ? "DAY PDC" : "DAYS PDC"
                    })`
                  : ""}
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
          1. Memorandum of Agreement, VAT Exemption Certificate (if applicable)
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
          <Box mt={3} position="relative">
            <SignatureComponent
              signature={quotationData?.IdInformation?.signature}
              style={{ top: "-40px", left: "30px" }}
            />
            <Typography
              fontWeight="bold"
              textDecoration=""
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              {quotationData?.IdInformation?.first_name}{" "}
              {quotationData?.IdInformation?.middle_name.charAt(0)}{" "}
              {quotationData?.IdInformation?.last_name}
            </Typography>
            <Typography textAlign="center">Marketing Staff / CSR</Typography>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
          <Typography variant="h6" pl={2}>
            Checked By:
          </Typography>
          <Box mt={3} position="relative">
            <SignatureComponent signature={accountingManagerSignature} />
            <Typography
              fontWeight="bold"
              id="noted_user"
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              DAISY M. CARDINEZ
            </Typography>
          </Box>
          <Typography textAlign="center">Accounting Head</Typography>
        </Box>
        <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
          <Typography variant="h6" pl={2}>
            Noted By:
          </Typography>
          <Box mt={3} position="relative">
            <SignatureComponent
              style={{ top: "-50px" }}
              signature={presidentSignature}
            />
            <Typography
              fontWeight="bold"
              id="noted_user"
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              RUEL S. MANGARON
            </Typography>
          </Box>
          <Typography textAlign="center">President</Typography>
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
      <Typography sx={{ fontSize: "10px" }}>
        Note: This is a system generated quotation. To verify the authenticity
        of this file, kindly scan the generated QR Code using your QR Code
        scanner / reader
      </Typography>
    </Box>
  );
};

export default QuotationFooter;
