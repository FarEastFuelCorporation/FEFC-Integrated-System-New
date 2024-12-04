import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

import Header from "../../Header";

const guides = [
  {
    title: "Getting Started",
    description: "Learn how to set up your account and get started quickly.",
    pdfUrl: "/pdfs/getting-started.pdf",
  },
  {
    title: "Managing Transactions",
    description: "Step-by-step guide on managing transactions efficiently.",
    pdfUrl: "/pdfs/managing-transactions.pdf",
  },
  {
    title: "FAQ",
    description: "Answers to frequently asked questions.",
    pdfUrl: "/pdfs/faq.pdf",
  },
];

const HelpNew = ({ user }) => {
  const handleCardClick = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <Box p="20px" width="100% !important" position="relative">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Header title="Help" subtitle="List of Guides and Tutorials" />
      </Box>
      <Grid container spacing={3}>
        {guides.map((guide, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
    </Box>
  );
};

export default HelpNew;
