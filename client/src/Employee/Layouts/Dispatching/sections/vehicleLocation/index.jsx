import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import Header from "../../../../../OtherComponents/Header";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const libraries = ["places"];

const DispatchedTransactions = ({ socket }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const defaultLatitude = 15.100583182992573;
  const defaultLongitude = 120.95124801411367;

  const [gpsData, setGpsData] = useState({
    latitude: defaultLatitude, // Default latitude
    longitude: defaultLongitude, // Default longitude
    plateNumber: "NBZ7675",
  });

  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const mapRef = useRef(null); // Store map instance

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  // Handle socket messages and update state
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received GPS Data:", message);

        if (message.type === "NEW_LOCATION") {
          setGpsData((prevGpsData) => ({
            latitude: parseFloat(message.data.latitude) || prevGpsData.latitude,
            longitude:
              parseFloat(message.data.longitude) || prevGpsData.longitude,
            plateNumber: "NBZ7675",
          }));
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/vehicleLocation`);
        setGpsData({
          latitude:
            response.data.latestLocation.latitude === 0
              ? defaultLatitude
              : response.data.latestLocation.latitude,
          longitude:
            response.data.latestLocation.longitude === 0
              ? defaultLongitude
              : response.data.latestLocation.longitude,
          plateNumber: "NBZ7675",
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [apiUrl]);

  // Update map center when GPS data changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: gpsData.latitude, lng: gpsData.longitude });
    }
  }, [gpsData]);

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
        center={{ lat: gpsData.latitude, lng: gpsData.longitude }}
        onLoad={(map) => (mapRef.current = map)} // Store map instance
      >
        <Marker
          position={{ lat: gpsData.latitude, lng: gpsData.longitude }}
          onClick={() => setShowInfoWindow(!showInfoWindow)}
        >
          {showInfoWindow && (
            <InfoWindow
              position={{ lat: gpsData.latitude, lng: gpsData.longitude }}
              onCloseClick={() => setShowInfoWindow(false)}
              options={{ pixelOffset: new window.google.maps.Size(0, -35) }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "black" }}
                >
                  {gpsData.plateNumber}
                </Typography>
              </Box>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </Box>
  );
};

export default DispatchedTransactions;
