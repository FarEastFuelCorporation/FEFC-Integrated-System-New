import React, { useState, useEffect } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import AttachmentModal from "../../TransactionModals/AttachmentModal";
import LoadingSpinner from "../../LoadingSpinner";

const Documents = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialAttachmentFormData = {
    id: "",
    fileName: "",
    attachment: "",
    createdBy: user.id,
  };

  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [attachmentFormData, setAttachmentFormData] = useState(
    initialAttachmentFormData
  );
  const [attachmentData, setAttachmentData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/document`);

      // Map over the fetched data to add the attachmentCreatedBy field
      const mappedAttachmentData = response.data.documents.map(
        (attachment) => ({
          ...attachment,
          attachmentCreatedBy: `${attachment.Employee.firstName} ${attachment.Employee.lastName}`, // Concatenate names
        })
      );

      setAttachmentData(mappedAttachmentData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseAttachmentModal = () => {
    setOpenAttachmentModal(false);
    clearAttachmentFormData();
  };

  const clearAttachmentFormData = () => {
    setAttachmentFormData(initialAttachmentFormData);
    setFileName("");
  };

  const handleOpenAttachmentModal = (row) => {
    setAttachmentFormData({
      id: "",
      bookedTransactionId: row.id,
      fileName: "",
      attachment: "",
      createdBy: user.id,
    });
    setOpenAttachmentModal(true);
  };

  const handleAttachmentFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleAttachmentInputChange = (e) => {
    const { name, value } = e.target;
    setAttachmentFormData({ ...attachmentFormData, [name]: value });
  };

  const handleAttachmentFormSubmit = async (e) => {
    e.preventDefault();

    attachmentFormData.attachment = selectedFile;

    // Perform client-side validation
    const { fileName, attachment } = attachmentFormData;

    // Check if all required fields are filled
    if (!fileName || !attachment) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      if (!attachmentFormData.id) {
        const newFormData = new FormData();
        newFormData.append(
          "bookedTransactionId",
          attachmentFormData.bookedTransactionId
        );
        newFormData.append("fileName", attachmentFormData.fileName);
        newFormData.append("attachment", attachmentFormData.attachment);
        newFormData.append("createdBy", attachmentFormData.createdBy);

        // Add new attachment
        await axios.post(`${apiUrl}/api/document`, newFormData);

        setSuccessMessage("Attachment Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseAttachmentModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Document?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      await axios.delete(`${apiUrl}/api/document`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Document Deleted Successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "fileName",
      headerName: "File Name",
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
    {
      field: "view",
      headerName: "View File",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.greenAccent[400], fontSize: "large" }}
          onClick={() => {
            const attachment = params.row.attachment; // Access the longblob data

            if (attachment) {
              const byteArray = new Uint8Array(attachment.data); // Convert binary data to a byte array

              // Determine the MIME type based on the file's magic number (first few bytes)
              let mimeType = "application/octet-stream"; // Default MIME type
              const magicNumbers = byteArray.slice(0, 4).join(",");

              // Common magic numbers
              if (magicNumbers.startsWith("255,216,255")) {
                mimeType = "image/jpeg";
              } else if (magicNumbers.startsWith("137,80,78,71")) {
                mimeType = "image/png";
              } else if (magicNumbers.startsWith("37,80,68,70")) {
                mimeType = "application/pdf";
              }
              // Add more magic numbers as necessary

              const blob = new Blob([byteArray], { type: mimeType });
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

              // Determine the MIME type based on the file's magic number (first few bytes)
              let mimeType = "application/octet-stream"; // Default MIME type
              const magicNumbers = byteArray.slice(0, 4).join(",");
              // Common magic numbers
              if (magicNumbers.startsWith("255,216,255")) {
                mimeType = "image/jpeg";
              } else if (magicNumbers.startsWith("137,80,78,71")) {
                mimeType = "image/png";
              } else if (magicNumbers.startsWith("37,80,68,70")) {
                mimeType = "application/pdf";
              }
              // Add more magic numbers as necessary

              const blob = new Blob([byteArray], { type: mimeType });
              const url = URL.createObjectURL(blob); // Create an object URL from the Blob

              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", fileName); // Use the file name for the download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 60,
    //   renderCell: (params) =>
    //     params.row.createdBy === user.id ? ( // Check if createdBy matches user.id
    //       <IconButton
    //         color="warning"
    //         // onClick={() => handleEditClick(params.row.id)} // Assuming you have a handleEditClick function
    //       >
    //         <EditIcon />
    //       </IconButton>
    //     ) : null, // Return null if the condition is not met
    // },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 60,
    //   renderCell: (params) =>
    //     params.row.createdBy === user.id ? ( // Check if createdBy matches user.id
    //       <IconButton
    //         color="error"
    //         onClick={() => handleDeleteClick(params.row.id)} // Assuming you have a handleDeleteClick function
    //       >
    //         <DeleteIcon />
    //       </IconButton>
    //     ) : null, // Return null if the condition is not met
    // },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Documnets" subtitle="List of FEFC Documents" />
        <Box display="flex">
          <IconButton onClick={handleOpenAttachmentModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomDataGridStyles>
        <DataGrid
          rows={attachmentData ? attachmentData : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "wasteCode", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <AttachmentModal
        user={user}
        open={openAttachmentModal}
        onClose={handleCloseAttachmentModal}
        attachmentFormData={attachmentFormData}
        setAttachmentFormData={setAttachmentFormData}
        handleAttachmentFileChange={handleAttachmentFileChange}
        fileName={fileName}
        handleAttachmentInputChange={handleAttachmentInputChange}
        handleAttachmentFormSubmit={handleAttachmentFormSubmit}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
      />
    </Box>
  );
};

export default Documents;
