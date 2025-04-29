// components/Quotations.js

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PageviewIcon from "@mui/icons-material/Pageview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../../Header";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import QuotationForm from "../../Quotations/QuotationForm";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmationDialog from "../../ConfirmationDialog";
import SectionModal from "./SectionModal";
import SuccessMessage from "../../SuccessMessage";
import { validateTransactionForm } from "./Validation";

// Define a sorting function for QuotationWaste
const sortQuotationWaste = (a, b) => {
  // First sort by mode
  if (a.mode < b.mode) return -1;
  if (a.mode > b.mode) return 1;

  // If modes are equal, sort by wasteName
  if (a.wasteName < b.wasteName) return -1;
  if (a.wasteName > b.wasteName) return 1;

  return 0; // They are equal
};

// Define a sorting function for QuotationTransportation
const sortQuotationTransportation = (a, b) => {
  // First sort by mode
  if (a.mode < b.mode) return -1;
  if (a.mode > b.mode) return 1;

  // If modes are equal, sort by typeOfVehicle from VehicleType
  const vehicleTypeA = a.VehicleType?.typeOfVehicle || "";
  const vehicleTypeB = b.VehicleType?.typeOfVehicle || "";

  if (vehicleTypeA < vehicleTypeB) return -1;
  if (vehicleTypeA > vehicleTypeB) return 1;

  return 0; // They are equal
};

const Commissions = ({ user }) => {
  const certificateRef = useRef();
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    clientId: "",
    employeeId: "",
    commissionCode: "",
    transactionDate: "",
    remarks: "",
    createdBy: user.id,
    items: [
      {
        id: "",
        quotationWasteId: "",
        amount: 0,
      },
    ],
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [commissionsData, setCommissionsData] = useState([]);
  const [clients, setClients] = useState([]);
  const [allQuotationWaste, setAllQuotationWaste] = useState([]);
  const [quotationWaste, setQuotationWaste] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPicture, setLoadingPicture] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isDownloadContentReady, setDownloadIsContentReady] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const [showQuotationForm, setShowQuotationForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/commission`);

      setCommissionsData(response.data.commissions);

      const [clientsResponse, quotationWasteResponse, employeeResponse] =
        await Promise.all([
          axios.get(`${apiUrl}/api/client`),
          axios.get(`${apiUrl}/api/quotation/waste`),
          axios.get(`${apiUrl}/api/employeeRecord`),
        ]);

      setClients(clientsResponse.data.clients);
      setAllQuotationWaste(quotationWasteResponse.data.clients); // store full list
      setQuotationWaste([]); // start empty
      setEmployees(employeeResponse.data.employees); // start empty

      setLoading(false);
    } catch (error) {
      console.error("Error fetching commissionsData:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter when clientId changes
  useEffect(() => {
    if (formData.clientId) {
      const filteredItem = allQuotationWaste.find(
        (item) => item.clientId === formData.clientId
      );
      const filteredWastes = filteredItem?.quotationWaste || [];
      setQuotationWaste(filteredWastes);
    }
  }, [formData.clientId, allQuotationWaste]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewClick = (row) => {
    setLoading(true);

    if (Array.isArray(row.QuotationWaste)) {
      row.QuotationWaste.sort(sortQuotationWaste);
    }
    if (Array.isArray(row.QuotationTransportation)) {
      row.QuotationTransportation.sort(sortQuotationTransportation);
    }

    setSelectedQuotation(row); // Set the selected quotation

    setIsDownload(false);
    // Set the flag to show the form
    setShowQuotationForm(true);

    setLoading(false);
  };

  const handleViewPDF = () => {
    const input = certificateRef.current;

    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, generate the PDF
        const pdfOutput = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  useEffect(() => {
    if (isContentReady) {
      handleViewPDF();
    }
  }, [isContentReady]);

  const handleDownloadClick = (row) => {
    setSelectedQuotation(row); // Set the selected quotation
    // Use a timeout to allow the component to render before downloading

    setIsDownload(true);
    // Set the flag to show the form
    setShowQuotationForm(true);

    if (showQuotationForm) {
      handleDownloadPDF(row);
    }
  };

  const handleDownloadPDF = (quotationData) => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, save the PDF
        pdf.save(
          `${quotationData.quotationCode}-${quotationData.revisionNumber}-${quotationData.Client.clientName}.pdf`
        );
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg");

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  useEffect(() => {
    if (isDownloadContentReady) {
      handleDownloadPDF(selectedQuotation);
    }
  }, [isDownloadContentReady, selectedQuotation]);

  const handleEditClick = (row) => {
    if (row) {
      setFormData({
        id: row.id || "",
        clientId: row.clientId || "",
        employeeId: row.employeeId || "",
        commissionCode: row.commissionCode || "",
        transactionDate: row.transactionDate || "",
        remarks: row.remarks || "",
        createdBy: user.id,
        items: row.CommissionWaste
          ? row.CommissionWaste.map((item) => ({
              id: item.id || "",
              quotationWasteId: item.quotationWasteId || "",
              amount: item.amount || 0,
            }))
          : [],
      });

      handleOpenModal();
    } else {
      console.error(`Commission with ID ${row?.id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Commission?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/commission/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Commission Deleted Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateTransactionForm(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing commission
        await axios.put(`${apiUrl}/api/commission/${formData.id}`, formData);

        setSuccessMessage("Commission Updated Successfully!");
      } else {
        // Add new commission
        await axios.post(`${apiUrl}/api/commission`, formData);

        setSuccessMessage("Commission Added Successfully!");
      }
      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
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
      field: "commissionCode",
      headerName: "Commission Code",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "transactionDate",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      renderCell: (params) => {
        let validity;

        if (!params.value) validity = "";
        validity = format(new Date(params.value), "MMMM dd yyyy");

        let value = {};
        value.value = validity || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "employeeId",
      headerName: "Agent",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return `${params.row.EmployeeRecord?.firstName} ${params.row.EmployeeRecord?.lastName}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.Client?.clientName;
      },
      renderCell: renderCellWithWrapText,
    },
    // {
    //   field: "view",
    //   headerName: "View File",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 80,
    //   renderCell: (params) => (
    //     <IconButton
    //       color="secondary"
    //       onClick={async () => {
    //         try {
    //           const id = params.row.id; // Get the document ID

    //           // Fetch the attachment from the API using the document ID
    //           const response = await axios.get(
    //             `${apiUrl}/api/quotation/full/${id}`
    //           );

    //           // Call the view handler with the fetched data

    //           handleViewClick(response.data.commissions[0]);
    //         } catch (error) {
    //           console.error("Error fetching document file:", error);
    //           // Optional: Show error message to the user
    //         }
    //       }}
    //     >
    //       <PageviewIcon sx={{ fontSize: "2rem" }} />
    //     </IconButton>
    //   ),
    // },
    // {
    //   field: "download",
    //   headerName: "Download",
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   width: 80,
    //   renderCell: (params) => (
    //     <IconButton
    //       color="secondary"
    //       onClick={async () => {
    //         try {
    //           const id = params.row.id; // Get the document ID

    //           // Fetch the attachment from the API using the document ID
    //           const response = await axios.get(
    //             `${apiUrl}/api/quotation/full/${id}`
    //           );

    //           // Call the download handler with the fetched data
    //           handleDownloadClick(response.data.commissions[0]);
    //         } catch (error) {
    //           console.error("Error fetching document file:", error);
    //           // Optional: Show error message to the user
    //         }
    //       }}
    //     >
    //       <DownloadIcon sx={{ fontSize: "2rem" }} />
    //     </IconButton>
    //   ),
    // },
  ];

  if (user.userType === 2) {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    );
  }

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Commissions" subtitle="List of Agent's Commissions" />
        {user.userType === 2 && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
      </Box>
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction}
        text={dialog}
      />
      <CustomDataGridStyles>
        <DataGrid
          rows={commissionsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "clientName", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <SectionModal
        user={user.id}
        open={openModal}
        handleCloseModal={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
        clients={clients}
        quotationWaste={quotationWaste}
        setQuotationWaste={setQuotationWaste}
        employees={employees}
      />
      {showQuotationForm && (
        <Box sx={{ position: "absolute", left: "-9999px", zIndex: 9999 }}>
          <QuotationForm
            ref={certificateRef}
            row={selectedQuotation}
            setIsContentReady={
              isDownload ? setDownloadIsContentReady : setIsContentReady
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default Commissions;
