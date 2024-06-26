import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import axios from "axios";
import { tokens } from "../../../../../theme";

const TypeOfWastes = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/marketingDashboard/typeOfWastes`
        );
        const typeOfWastesRecords = response.data;
        console.log(typeOfWastesRecords);
        if (
          typeOfWastesRecords &&
          Array.isArray(typeOfWastesRecords.typeOfWastes)
        ) {
          const flattenedData = typeOfWastesRecords.typeOfWastes.map(
            (item) => ({
              ...item,
              treatmentProcess: item.TreatmentProcess
                ? item.TreatmentProcess.treatmentProcess
                : null,
            })
          );
          console.log(flattenedData);
          setClientData(flattenedData);
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
      field: "wasteCategory",
      headerName: "Waste Category",
      headerAlign: "center",
      align: "center",
      width: 150, // Set a minimum width or initial width
    },
    {
      field: "wasteCode",
      headerName: "Waste Code",
      headerAlign: "center",
      align: "center",
      flex: 1, // Use flex to allow content to dictate width
      minWidth: 150, // Minimum width
    },
    {
      field: "wasteDescription",
      headerName: "Waste Description",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "treatmentProcess",
      headerName: "Treatment Process",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <Box p="20px" width="100% !important">
      <Box display="flex" justifyContent="space-between">
        <Header title="Clients" subtitle="List of Clients" />
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        width="100% !important"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            width: "100%",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
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
      </Box>
    </Box>
  );
};

export default TypeOfWastes;
