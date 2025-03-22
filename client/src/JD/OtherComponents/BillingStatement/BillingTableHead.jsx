import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

// Define common styles for table cells
const headerCellStyles = (isLastCell) => ({
  fontWeight: "bold",
  fontSize: "12px",
  padding: "2px",
  border: "1px solid black",
  borderRight: isLastCell ? "1px solid black" : "none",
  color: "black",
  textAlign: "center",
  fontFamily: "'Poppins', sans-serif",
});

const BillingTableHead = () => {
  return (
    <TableHead>
      <TableRow sx={{ border: "black" }}>
        <TableCell sx={headerCellStyles(false)}>Date</TableCell>
        <TableCell sx={headerCellStyles(false)}>D.R.#</TableCell>
        <TableCell sx={headerCellStyles(false)}>S.I.#</TableCell>
        <TableCell sx={headerCellStyles(false)}>Description</TableCell>
        <TableCell sx={headerCellStyles(false)}>Qty</TableCell>
        <TableCell sx={headerCellStyles(false)}>Unit</TableCell>
        <TableCell sx={headerCellStyles(false)}>Unit Price</TableCell>
        <TableCell sx={headerCellStyles(false)}>Amount</TableCell>
        <TableCell sx={headerCellStyles(true)}>Vat Calculation</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default BillingTableHead;
