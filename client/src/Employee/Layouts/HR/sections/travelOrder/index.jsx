import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import ConfirmationDialog from "../../../../../OtherComponents/ConfirmationDialog";
import {
  formatDate3,
  formatTime4,
} from "../../../../../OtherComponents/Functions";

const TravelOrder = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/travelOrder`);

      setRecords(response.data.travelOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprovedClick = (id) => {
    setOpenDialog(true);
    setDialog("Are you sure you want to Approve this Travel Order?");
    setDialogAction(() => () => handleConfirmApproved(id));
  };

  const handleConfirmApproved = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/api/travelOrder/subordinateApproved2/${id}`);

      fetchData();
      setSuccessMessage("Travel Order Approved Successfully!");
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
    setDialog("Are you sure you want to Disapprove this Travel Order?");
    setDialogAction(() => () => handleConfirmDisapproved(id));
  };

  const handleConfirmDisapproved = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `${apiUrl}/api/travelOrder/subordinateDisapproved2/${id}`
      );

      fetchData();
      setSuccessMessage("Travel Order Approved Successfully!");
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
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let value = {};
        value.value =
          `${params.row.Employee.lastName}, ${params.row.Employee.firstName} ${params.row.Employee.affix}` ||
          "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let value = {};
        value.value = params.row.Employee.designation || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "destination",
      headerName: "Destination",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
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
      field: "formattedDeparture",
      headerName: "Departure",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let departure;

        if (!params.row.departureDate) return (departure = "");
        if (!params.row.departureTime) return (departure = "");

        // Format departure date
        const date = new Date(params.row.departureDate);
        const dateFormat = formatDate3(date);

        // Format departure time
        const [hours, minutes, seconds] = params.row.departureTime.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = formatTime4(timeFormat);

        departure = `${dateFormat} ${timeString}`;

        let value = {};
        value.value = departure || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "formattedArrival",
      headerName: "Arrival",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let arrival;

        if (!params.row.arrivalDate) return (arrival = "");
        if (!params.row.arrivalTime) return (arrival = "");

        // Format arrival date
        const date = new Date(params.row.arrivalDate);
        const dateFormat = formatDate3(date);

        // Format arrival time
        const [hours, minutes, seconds] = params.row.arrivalTime.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds);

        const timeString = formatTime4(timeFormat);

        arrival = `${dateFormat} ${timeString}`;

        let value = {};
        value.value = arrival || "";

        return renderCellWithWrapText(value);
      },
    },

    {
      field: "Approval",
      headerName: "Approval",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let approval;
        if (!params.row.isApproved) {
          approval = "WAITING FOR APPROVAL";
        } else {
          approval = params.row.isApproved;
        }

        let value = {};
        value.value = approval || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "isNoted",
      headerName: "Noted",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        let isNoted = params.row.isNoted;

        // If isNoted is falsy and isApproved is truthy, show the buttons
        const buttonGroup = !isNoted && params.row.isApproved && (
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

        let value = {};
        value.value =
          (
            <div>
              {isNoted && <span>{isNoted}</span>}
              {buttonGroup}
            </div>
          ) || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "formattedOut",
      headerName: "Actual Out",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let out;

        if (!params.row.out) return (out = "");
        // Format out date
        const date = new Date(params.row.out);
        const dateFormat = formatDate3(date);
        const timeFomrat = formatTime4(date);

        out = `${dateFormat} ${timeFomrat}`;

        let value = {};
        value.value = out || "";

        return renderCellWithWrapText(value);
      },
    },
    {
      field: "formattedIn",
      headerName: "Actual In",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        let timeIn;

        if (!params.row.in) return (timeIn = "");
        // Format in date
        const date = new Date(params.row.in);
        const dateFormat = formatDate3(date);
        const timeFomrat = formatTime4(date);

        timeIn = `${dateFormat} ${timeFomrat}`;

        let value = {};
        value.value = timeIn || "";

        return renderCellWithWrapText(value);
      },
    },
  ];

  return (
    <Box m="20px" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Travel Order Records" subtitle="List of Travel Orders" />
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
          rows={dataRecords ? dataRecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default TravelOrder;
