import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const Certificate = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [attachmentData, setAttachmentData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificateResponse = await axios.get(
          `${apiUrl}/certificate/${id}`
        );
        const attachment = certificateResponse.data.certificateAttachment;
        setAttachmentData(attachment);

        // Convert the attachment data to a base64 string
        const byteArray = new Uint8Array(attachment.attachment.data);
        const base64String = btoa(
          byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        // Determine the MIME type based on the file's magic number (first few bytes)
        let mimeType = "application/octet-stream"; // Default MIME type
        const magicNumbers = byteArray.slice(0, 4).join(",");

        if (magicNumbers.startsWith("255,216,255")) {
          mimeType = "image/jpeg";
        } else if (magicNumbers.startsWith("137,80,78,71")) {
          mimeType = "image/png";
        } else if (magicNumbers.startsWith("37,80,68,70")) {
          mimeType = "application/pdf";
        }

        setImageSrc(`data:${mimeType};base64,${base64String}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, id]);

  const handleDownload = () => {
    if (attachmentData) {
      const byteArray = new Uint8Array(attachmentData.attachment.data);
      const mimeType =
        imageSrc?.split(";")[0].split(":")[1] || "application/octet-stream";
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    }
  };

  return (
    <Box>
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt="Certificate"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownload}
          >
            Download Certificate
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
};

export default Certificate;
