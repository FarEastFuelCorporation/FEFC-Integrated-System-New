import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";

const Clients = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/certificationDashboard/clients`
        );
        const clientRecords = response.data;

        if (clientRecords && Array.isArray(clientRecords.clients)) {
          setClientData(clientRecords.clients);
        } else {
          console.error(
            "clientRecords or clientRecords.clients is undefined or not an array"
          );
        }
      } catch (error) {
        console.error("Error fetching clientData:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const columns = [
    {
      field: "clientId",
      headerName: "Client ID",
      headerAlign: "center",
      align: "center",
      width: 100, // Set a minimum width or initial width
    },
    {
      field: "clientPicture",
      headerName: "Logo",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 50,
      renderCell: (params) => {
        // Check if params.value is valid
        if (params.value && params.value.data && params.value.type) {
          try {
            // Convert Buffer to Uint8Array
            const uint8Array = new Uint8Array(params.value.data);
            // Create Blob from Uint8Array
            const blob = new Blob([uint8Array], { type: params.value.type });
            // Create object URL from Blob
            const imageUrl = URL.createObjectURL(blob);

            return (
              <img
                src={imageUrl}
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          } catch (error) {
            console.error("Error creating image URL:", error);
            return (
              <img
                src="/assets/unknown.png"
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          }
        } else {
          return (
            <img
              src="/assets/unknown.png"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          );
        }
      },
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "natureOfBusiness",
      headerName: "Nature of Business",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
    },
    {
      field: "clientType",
      headerName: "Client Type",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="Clients" subtitle="List of Clients" />
        <Box display="flex"></Box>
      </Box>
      <CustomDataGridStyles>
        <DataGrid
          rows={clientData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "clientId", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default Clients;
