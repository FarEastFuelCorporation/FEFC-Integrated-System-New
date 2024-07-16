import React from "react";
import { Box, useTheme, IconButton, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import { tokens } from "../theme";

const Attachments = ({
  row,
  user,
  handleOpenAttachmentModal,
  attachmentData,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  console.log(row);
  console.log(row.Attachment);

  const columns = [
    {
      field: "upload",
      headerName: "Upload",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.greenAccent[400], fontSize: "large" }}
          onClick={() => {
            const attachment = params.row.attachment; // Access the longblob data
            const fileName = params.row.fileName; // Assuming fileName is in the row data

            if (attachment) {
              const byteArray = new Uint8Array(attachment.data); // Convert binary data to a byte array
              const blob = new Blob([byteArray], { type: "application/pdf" }); // Adjust the MIME type as necessary
              const url = URL.createObjectURL(blob); // Create an object URL from the Blob
              window.open(url, "_blank"); // Open the URL in a new tab
            }
          }}
        >
          <PageviewIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "download",
      headerName: "Download",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.blueAccent[400], fontSize: "large" }}
          onClick={() => {
            const attachment = params.row.attachment; // Access the longblob data
            const fileName = params.row.fileName; // Access the file name

            if (attachment) {
              const byteArray = new Uint8Array(attachment.data); // Convert binary data to a byte array
              const blob = new Blob([byteArray], { type: "application/pdf" }); // Adjust the MIME type as necessary
              const url = URL.createObjectURL(blob); // Create an object URL from the Blob

              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", fileName); // Use the file name for the download
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
            }
          }}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "fileName",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "attachmentCreatedBy",
      headerName: "Uploaded By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const timestamp = new Date(params.value);
        const formattedTimestamp = timestamp.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return <div>{formattedTimestamp}</div>;
      },
    },
  ];

  return (
    <Box>
      <DataGrid
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            width: "100%",
            color: colors.grey[100],
          },
          "& .MuiDataGrid-overlayWrapper": {
            minHeight: "52px",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal !important",
            wordWrap: "break-word !important",
            lineHeight: "1.2 !important",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-toolbarContainer": {
            display: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
        }}
        rows={row.Attachment ? row.Attachment : []}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => (row.id ? row.id : [])}
        localeText={{ noRowsLabel: "No Files Uploded" }}
        initialState={{
          sortModel: [
            { field: "treatedDate", sort: "asc" },
            { field: "treatedTime", sort: "asc" },
            { field: "machineName", sort: "asc" },
          ],
        }}
      />
      <br />
    </Box>
  );
};

export default Attachments;
