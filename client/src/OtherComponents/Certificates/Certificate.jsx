import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/webpack";

import { useMode } from "./../../theme";
import LoadingSpinner from "../LoadingSpinner";

const Certificate = () => {
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [theme, colorMode] = useMode();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [attachmentData, setAttachmentData] = useState(null);
  const [fileSrc, setFileSrc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); // Navigate back to the previous page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificateResponse = await axios.get(
          `${apiUrl}/api/certificate/${id}`
        );
        const attachment = certificateResponse.data.certificateAttachment;
        console.log("Fetched attachment:", attachment);

        if (!attachment || !attachment.attachment.data) {
          console.error("Attachment data is missing.");
          setLoading(false);
          return;
        }

        setAttachmentData(attachment);

        const byteArray = new Uint8Array(attachment.attachment.data);
        const base64String = btoa(
          byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const magicNumbers = byteArray.slice(0, 4).join(",");
        let mimeType = "application/octet-stream";

        if (magicNumbers.startsWith("255,216,255")) {
          mimeType = "image/jpeg";
          setFileSrc(`data:${mimeType};base64,${base64String}`);
        } else if (magicNumbers.startsWith("137,80,78,71")) {
          mimeType = "image/png";
          setFileSrc(`data:${mimeType};base64,${base64String}`);
        } else if (magicNumbers.startsWith("37,80,68,70")) {
          mimeType = "application/pdf";
          convertPdfToImage(byteArray);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const convertPdfToImage = async (pdfData) => {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1);
      const scale = 0.75;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      const imageUrl = canvas.toDataURL("image/png");
      setFileSrc(imageUrl);
    };

    fetchData();
  }, [apiUrl, id]);

  return (
    <Box sx={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
      {loading && <LoadingSpinner theme={theme} />}
      {fileSrc ? (
        <>
          <img
            src={fileSrc}
            alt="Certificate"
            style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
          />
        </>
      ) : (
        <Box
          sx={{
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
          }}
        >
          <Typography variant="h4" color="textSecondary" gutterBottom>
            No Certificate Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We couldn't find the certificate you're looking for.
          </Typography>
          <Button variant="contained" color="error" onClick={handleGoBack}>
            Go Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Certificate;
