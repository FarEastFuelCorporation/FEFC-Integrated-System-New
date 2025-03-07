import React, { useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import Header from "../../Header";

const guides = [
  {
    title: "Getting Started",
    description: "Learn how to set up your account and get started quickly.",
    pdfUrl: "/guides/ACCOUNT_REGISTRATION_PROCESS.pdf", // Public folder path
  },
  {
    title: "Booking Transactions",
    description: "Step-by-step guide on booking transactions efficiently.",
    pdfUrl: "/guides/BOOKED_TRANSACTION_PROCESS.pdf", // Public folder path
  },
  {
    title: "System Transaction Flow",
    description:
      "A comprehensive overview of the system's transaction processes.",
    pdfUrl: "/guides/SYSTEM_TRANSACTION_FLOW.pdf", // Public folder path
  },
  {
    title: "View/Download Certificates",
    description: "Guide on accessing and downloading Certificates Destruction.",
    pdfUrl: "/guides/VIEW_OR_DOWNLOAD_CERTIFICATES_GUIDE.pdf", // Public folder path
  },
  {
    title: "View/Download Billing Statement",
    description: "Guide on accessing and downloading Billing Statement.",
    pdfUrl: "/guides/VIEW_OR_DOWNLOAD_CERTIFICATES_GUIDE.pdf", // Public folder path
  },
  // {
  //   title: "FAQ",
  //   description: "Answers to frequently asked questions.",
  //   pdfUrl: "/guides/FAQ.pdf", // Public folder path
  // },
];

const Help = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  // Initialize the default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleCardClick = (url) => {
    setPdfUrl(url); // Display PDF inside the app
  };

  return (
    <Box p="20px" width="100% !important" position="relative">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Header title="Help" subtitle="List of Guides and Tutorials" />
      </Box>
      <Grid container spacing={3}>
        {guides.map((guide, index) => (
          <Grid item xs={12} sm={6} md={12 / 5} key={index}>
            <Card
              variant="outlined"
              onClick={() => handleCardClick(guide.pdfUrl)}
              sx={{ cursor: "pointer", ":hover": { boxShadow: 4 } }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {guide.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {guide.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pdfUrl && (
        <Box mt={4}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
                height: "600px",
              }}
            >
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Box>
          </Worker>
        </Box>
      )}
    </Box>
  );
};

export default Help;
