import React, { useState, useEffect, useMemo } from "react";
import { Box, useTheme, Paper, Typography } from "@mui/material";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Header from "../../../../../OtherComponents/Header";
import axios from "axios";
import { tokens } from "../../../../../theme";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const libraries = ["places"]; // Load only the libraries you need

const DispatchedTransactions = () => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [gpsData, setGpsData] = useState({
    latitude: null,
    longitude: null,
    plateNumber: "NBZ7675",
  });
  const [showInfoWindow, setShowInfoWindow] = useState(false); // Control info window visibility
  console.log(process.env.REACT_APP_GOOGLE_API_KEY);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Use your environment variable
    libraries,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/vehicleLocation`);
        console.log(`${apiUrl}/api/vehicleLocation`);
        console.log(response.data.latestLocation);

        setGpsData({
          latitude: response.data.latestLocation.latitude,
          longitude: response.data.latestLocation.longitude,
          plateNumber: "NBZ7675", // Static for now, but can be fetched dynamically
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, [apiUrl]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // Default to fallback coordinates if latitude or longitude are not valid
  // 15.100583182992573, 120.95124801411367
  const { latitude, longitude, plateNumber } = gpsData;
  const validLatitude =
    parseFloat(latitude) === 0 ? 15.100583182992573 : parseFloat(latitude); // Fallback value for latitude
  const validLongitude =
    parseFloat(longitude) === 0 ? 120.95124801411367 : parseFloat(longitude); // Fallback value for longitude

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="Vehicle Location" subtitle="List of Vehicle Location" />
      </Box>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={{ lat: validLatitude, lng: validLongitude }}
      >
        {validLatitude && validLongitude && (
          <Marker
            position={{ lat: validLatitude, lng: validLongitude }}
            onClick={() => setShowInfoWindow(!showInfoWindow)} // Toggle InfoWindow
          >
            {showInfoWindow && (
              <InfoWindow onCloseClick={() => setShowInfoWindow(false)}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "black" }}
                  >
                    {plateNumber}
                  </Typography>
                </Box>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>
    </Box>
  );
};

export default DispatchedTransactions;
