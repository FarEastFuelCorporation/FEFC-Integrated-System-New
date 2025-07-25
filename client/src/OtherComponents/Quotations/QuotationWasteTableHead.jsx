import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

// Define common styles for table cells
const cellStyles = (isLastCell) => ({
  fontWeight: "bold",
  fontSize: "14px",
  padding: "2px",
  border: "1px solid black",
  borderRight: isLastCell ? "1px solid black" : "none",
  color: "black",
  textAlign: "center",
});

const QuotationWasteTableHead = ({ row }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ ...cellStyles(false), width: "40px" }}>Item</TableCell>
        <TableCell sx={cellStyles(false)}>Description</TableCell>
        <TableCell sx={cellStyles(false)}>Code</TableCell>
        {row.isOneTime && (
          <TableCell sx={{ ...cellStyles(false), width: "40px" }}>
            Qty.
          </TableCell>
        )}
        <TableCell sx={{ ...cellStyles(false), width: "40px" }}>Unit</TableCell>
        <TableCell sx={{ ...cellStyles(false), width: "70px" }}>
          Unit Price
        </TableCell>
        {row.isOneTime && (
          <TableCell sx={{ ...cellStyles(false), width: "70px" }}>
            Amount
          </TableCell>
        )}
        <TableCell sx={{ ...cellStyles(false), width: "100px" }}>
          Mode
        </TableCell>
        <TableCell sx={{ ...cellStyles(true), width: "100px" }}>
          Vat Calculation
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default QuotationWasteTableHead;
