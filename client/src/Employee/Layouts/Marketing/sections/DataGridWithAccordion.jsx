import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const rows = [
  { id: 1, clientId: "001", clientName: "Client A", address: "Address A" },
  { id: 2, clientId: "002", clientName: "Client B", address: "Address B" },
  // Add more rows as needed
];

const columns = [
  { field: "clientId", headerName: "Client ID", width: 150 },
  { field: "clientName", headerName: "Client Name", width: 150 },
  { field: "address", headerName: "Address", width: 250 },
];

const DataGridWithAccordion = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {rows.map((row) => (
        <Accordion
          key={row.id}
          expanded={expanded === row.id}
          onChange={handleChange(row.id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${row.id}-content`}
            id={`${row.id}-header`}
          >
            <Typography>{row.clientName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={[row]}
                columns={columns}
                getRowId={(row) => row.id}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default DataGridWithAccordion;
