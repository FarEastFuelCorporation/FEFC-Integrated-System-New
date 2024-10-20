import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";

const TravelOrder = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dataRecords, setRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/travelOrder`);

      console.log(response.data.travelOrders);
      setRecords(response.data.travelOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprovedClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Approved this Travel Order?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.put(`${apiUrl}/api/travelOrder/subordinateApproved2/${id}`);

      fetchData();
      setSuccessMessage("Travel Order Approved Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDisapprovedClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Disapproved this Travel Order?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

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
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.Employee.designation;
      },
      renderCell: renderCellWithWrapText,
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
      valueGetter: (params) => {
        if (!params.row.departureDate) return "";
        if (!params.row.departureTime) return "";

        // Format departure date
        const date = new Date(params.row.departureDate);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Format departure time
        const [hours, minutes, seconds] = params.row.departureTime.split(":");
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
      field: "formattedArrival",
      headerName: "Arrival",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.arrivalDate) return "";
        if (!params.row.arrivalTime) return "";

        // Format arrival date
        const date = new Date(params.row.arrivalDate);
        const dateFormat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"

        // Extract hours, minutes, and seconds from arrivalTime
        const [hours, minutes, seconds] = params.row.arrivalTime.split(":");
        const timeFormat = new Date();
        timeFormat.setHours(hours);
        timeFormat.setMinutes(minutes);
        timeFormat.setSeconds(seconds); // Set seconds

        // Format arrival time with seconds
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
      field: "Approval",
      headerName: "Approval",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      valueGetter: (params) => {
        if (!params.row.isApproved) {
          return "FOR APPROVAL";
        }
        return params.row.isApproved;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "isNoted",
      headerName: "Noted",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      valueGetter: (params) => {
        if (!params.row.isNoted && params.row.isApproved) {
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
        return params.row.isNoted;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedOut",
      headerName: "Actual Out",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.out) return "";
        const date = new Date(params.row.out);
        const dateFomrat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"
        const timeFomrat = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24 PM"
        return `${dateFomrat} ${timeFomrat}`;
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "formattedIn",
      headerName: "Actual In",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params) => {
        if (!params.row.in) return "";
        const date = new Date(params.row.in);
        const dateFomrat = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format to "October 15, 2024"
        const timeFomrat = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }); // Format to "12:24 PM"
        return `${dateFomrat} ${timeFomrat}`;
      },
      renderCell: renderCellWithWrapText,
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
