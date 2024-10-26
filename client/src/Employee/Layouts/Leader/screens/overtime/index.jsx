import { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import { DataGrid } from "@mui/x-data-grid";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";

const Overtime = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/overtime/subordinate/${user.id}`
      );

      console.log(response.data.overtimes);
      setRecords(response.data.overtimes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprovedClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Approve this Overtime Request?");
    setDialogAction(() => () => handleConfirmApproved(id));
  };

  const handleConfirmApproved = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/api/overtime/subordinateApproved/${id}`, {
        approvedBy: user.id,
      });

      fetchData();
      setSuccessMessage("Overtime Request Approved Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const handleDisapprovedClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Disapprove this Overtime Request?");
    setDialogAction(() => () => handleConfirmDisapproved(id));
  };

  const handleConfirmDisapproved = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/api/overtime/subordinateDisapproved/${id}`, {
        approvedBy: user.id,
      });

      fetchData();
      setSuccessMessage("Overtime Request Disapproved Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "employeeId",
      headerName: "Employee ID",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      valueGetter: (params) => {
        return params.row.employeeId;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        return `${params.row.Employee.lastName}, ${params.row.Employee.firstName} ${params.row.Employee.affix}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        return params.row.Employee.designation;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "start",
      headerName: "Start",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.dateStart) return "";
        if (!params.row.timeStart) return "";

        // Format departure date
        const date = new Date(params.row.dateStart);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeStart.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = timeFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24:30 PM"

        return `${dateFormat} ${timeString}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "end",
      headerName: "End",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.dateStart) return "";
        if (!params.row.timeEnd) return "";

        // Format departure date
        const date = new Date(params.row.dateStart);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Format departure time
        const [hours, minutes, seconds] = params.row.timeEnd.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = timeFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24:30 PM"

        return `${dateFormat} ${timeString}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "Approval",
      headerName: "Approval",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      valueGetter: (params) => {
        if (!params.row.isApproved) {
          return (
            <>
              <IconButton
                color="success"
                onClick={() => handleApprovedClick(params.row.id)}
              >
                <i className="fa-solid fa-thumbs-up"></i>
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDisapprovedClick(params.row.id)}
              >
                <i className="fa-solid fa-thumbs-down"></i>
              </IconButton>
            </>
          );
        }
        return params.row.isApproved;
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box sx={{ display: "flex", gap: 2 }}>
        <IconButton
          color="error" // Set the color to error (red)
          onClick={handleBackClick}
          sx={{ m: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          sx={{ fontSize: 20, display: "flex", alignItems: "center" }}
        >
          Overtime Request
        </Typography>
      </Box>
      <hr />
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
      <CustomDataGridStyles height={"auto"}>
        <DataGrid
          rows={dataRecords ? dataRecords : []}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default Overtime;
