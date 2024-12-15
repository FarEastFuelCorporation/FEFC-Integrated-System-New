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
import SuccessMessage from "../../SuccessMessage";
import QuotationFormModal from "../../Modals/QuotationFormModal";
import QuotationForm from "../../Quotations/QuotationForm";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmationDialog from "../../ConfirmationDialog";

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

const Quotations = ({ user }) => {
  const certificateRef = useRef();
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    clientId: "",
    quotationCode: "",
    validity: "",
    termsChargeDays: 0,
    termsCharge: "",
    termsBuyingDays: 0,
    termsBuying: "",
    scopeOfWork: "",
    contactPerson: "",
    remarks: "",
    isOneTime: false,
    isRevised: false,
    createdBy: user.id,
    quotationWastes: [
      {
        id: null,
        quotationId: null,
        wasteId: "",
        treatmentProcessId: "",
        wasteName: "",
        mode: "",
        quantity: 1,
        unit: "",
        unitPrice: 0,
        vatCalculation: "",
        hasTransportation: true,
        hasFixedRate: false,
        fixedWeight: 0,
        fixedPrice: 0,
        isMonthly: false,
      },
    ],
    quotationTransportation: [
      {
        id: null,
        quotationId: null,
        vehicleTypeId: "",
        haulingArea: "",
        mode: "",
        quantity: 1,
        unit: "",
        unitPrice: 0,
        vatCalculation: "",
        hasFixedRate: false,
        fixedWeight: 0,
        fixedPrice: 0,
        isMonthly: false,
      },
    ],
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [quotationsData, setQuotationsData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
      setLoadingPicture(true);
      let response;
      if (
        user.userType === "GEN" ||
        user.userType === "TRP" ||
        user.userType === "CUS" ||
        user.userType === "IFM"
      ) {
        response = await axios.get(`${apiUrl}/api/quotation/${user.id}`);
      } else {
        response = await axios.get(`${apiUrl}/api/quotation`);
      }

      setQuotationsData(response.data.quotations);
      setLoading(false);

      let fullResponse;
      if (
        user.userType === "GEN" ||
        user.userType === "TRP" ||
        user.userType === "CUS" ||
        user.userType === "IFM"
      ) {
      } else {
        fullResponse = await axios.get(`${apiUrl}/api/quotation/full`);

        setQuotationsData(fullResponse.data.quotations);
      }
      setLoadingPicture(false);
    } catch (error) {
      console.error("Error fetching quotationsData:", error);
    }
  }, [apiUrl, user.id, user.userType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    const formattedDate = new Date(row.validity).toISOString().split("T")[0];
    if (row) {
      setFormData({
        id: row.id,
        clientId: row.clientId,
        quotationCode: row.quotationCode,
        validity: formattedDate,
        termsCharge: row.termsCharge,
        termsChargeDays: row.termsChargeDays,
        termsBuying: row.termsBuying,
        termsBuyingDays: row.termsBuyingDays,
        scopeOfWork: row.scopeOfWork,
        contactPerson: row.contactPerson,
        remarks: row.remarks,
        isOneTime: row.isOneTime,
        isRevised: row.isRevised,
        createdBy: user.id,
        quotationWastes: row.QuotationWaste ? row.QuotationWaste : [], // Ensure quotationWastes is an array
        quotationTransportation: row.QuotationTransportation
          ? row.QuotationTransportation
          : [], // Ensure quotationWastes is an array
      });
      handleOpenModal();
    } else {
      console.error(`Quotation with ID ${row.id} not found for editing.`);
    }
  };

  const handleDeleteClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Delete this Quotation?");
    setDialogAction(() => () => handleConfirmDelete(id));
  };

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/quotation/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Quotation Deleted Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing quotation
        await axios.put(`${apiUrl}/api/quotation/${formData.id}`, formData);

        setSuccessMessage("Quotation Updated Successfully!");
      } else {
        // Add new quotation
        await axios.post(`${apiUrl}/api/quotation`, formData);

        setSuccessMessage("Quotation Added Successfully!");
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
      field: "quotationCode",
      headerName: "Quotation Code",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "revisionNumber",
      headerName: "Revision Number",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      renderCell: renderCellWithWrapText,
    },
    // Conditionally render "Logo" column based on userType
    ...(Number.isInteger(user?.userType)
      ? [
          {
            field: "clientPicture",
            headerName: "Logo",
            headerAlign: "center",
            align: "center",
            sortable: false,
            width: 50,
            renderCell: (params) => {
              if (loadingPicture) {
                return <CircularProgress size={20} color="secondary" />; // Spinner while loading pictures
              }
              return (
                <img
                  src={params.value || "/assets/unknown.png"}
                  alt="Logo"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              );
            },
          },
        ]
      : []), // Exclude the column if userType is not an integer
    // Conditionally render "Client Name" column based on userType
    ...(Number.isInteger(user?.userType)
      ? [
          {
            field: "clientName",
            headerName: "Client Name",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
            renderCell: renderCellWithWrapText,
          },
        ]
      : []), // Exclude the column if userType is not an integer
    {
      field: "termsCharge",
      headerName: "Terms (Charge)",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      renderCell: (params) => {
        let termsCharge;

        if (params.row?.termsCharge) {
          if (params.row?.termsCharge === "N/A") {
            termsCharge = "N/A";
          } else {
            let days = params.row.termsChargeDays;
            days =
              days === 0 ? "CASH" : days === 1 ? `${days} DAY` : `${days} DAYS`;

            termsCharge = `${days} ${params.row.termsCharge}`;
          }
        }

        let value = {};
        value.value = termsCharge || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "termsBuying",
      headerName: "Terms (Buying)",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (params) => {
        let termsBuying;

        if (params.row?.termsBuying) {
          if (params.row?.termsBuying === "N/A") {
            termsBuying = "N/A";
          } else {
            let days = params.row.termsBuyingDays;
            days =
              days === 0 ? "CASH" : days === 1 ? `${days} DAY` : `${days} DAYS`;

            termsBuying = `${days} ${params.row.termsBuying}`;
          }
        }

        let value = {};
        value.value = termsBuying || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "scopeOfWork",
      headerName: "Scope Of Work",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "validity",
      headerName: "Validity",
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
      field: "view",
      headerName: "View File",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={async () => {
            try {
              const id = params.row.id; // Get the document ID

              // Fetch the attachment from the API using the document ID
              const response = await axios.get(
                `${apiUrl}/api/quotation/full/${id}`
              );

              // Call the view handler with the fetched data

              handleViewClick(response.data.quotations[0]);
            } catch (error) {
              console.error("Error fetching document file:", error);
              // Optional: Show error message to the user
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
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={async () => {
            try {
              const id = params.row.id; // Get the document ID

              // Fetch the attachment from the API using the document ID
              const response = await axios.get(
                `${apiUrl}/api/quotation/full/${id}`
              );

              // Call the download handler with the fetched data
              handleDownloadClick(response.data.quotations[0]);
            } catch (error) {
              console.error("Error fetching document file:", error);
              // Optional: Show error message to the user
            }
          }}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
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
            onClick={async () => {
              try {
                const id = params.row.id; // Get the document ID

                // Fetch the attachment from the API using the document ID
                const response = await axios.get(
                  `${apiUrl}/api/quotation/full/${id}`
                );

                // Call the download handler with the fetched data
                handleEditClick(response.data.quotations[0]);
              } catch (error) {
                console.error("Error fetching document file:", error);
                // Optional: Show error message to the user
              }
            }}
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
        <Header title="Quotations" subtitle="List of Quotations" />
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
          rows={quotationsData}
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
      <QuotationFormModal
        user={user.id}
        open={openModal}
        handleCloseModal={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
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

export default Quotations;
