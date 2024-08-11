import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import io from "socket.io-client";
import Header from "../../../../../OtherComponents/Header";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const libraries = ["places"]; // Load only the libraries you need

const DispatchedTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl);
  const [gpsData, setGpsData] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Use your environment variable
    libraries,
  });

  useEffect(() => {
    const socket = io(apiUrl); // Replace with your server URL

    socket.on("gpsUpdate", (data) => {
      setGpsData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="Vehicle Location" subtitle="List of Vehicle Location" />
      </Box>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={
          gpsData
            ? { lat: gpsData.lat, lng: gpsData.lng }
            : { lat: 15.1004537, lng: 120.948715 }
        }
      >
        {/* {gpsData && <Marker position={{ lat: 15.1004537, lng: 120.948715 }} />} */}
        <Marker position={{ lat: 15.1004537, lng: 120.948715 }} />
      </GoogleMap>
    </Box>
  );
};

export default DispatchedTransactions;
