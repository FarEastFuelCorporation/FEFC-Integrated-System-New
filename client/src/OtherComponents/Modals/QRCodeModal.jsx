import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";

const QRCodeModal = ({ open, handleClose, qrCodeUrl }) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom color="black">
        QR Code
      </Typography>
      {qrCodeUrl && <QRCode value={qrCodeUrl} size={200} />}
    </Box>
  </Modal>
);

export default QRCodeModal;
