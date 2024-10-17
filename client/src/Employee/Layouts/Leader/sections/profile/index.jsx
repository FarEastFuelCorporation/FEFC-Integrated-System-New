import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../../theme";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const Profile = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching employeeData:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const convertUint8ArrayToBlob = () => {
      if (
        !user ||
        !user.employeePicture ||
        !user.employeePicture.profile_picture
      ) {
        return;
      }

      const uint8Array = new Uint8Array(
        user.employeePicture.profile_picture.data
      );
      const blob = new Blob([uint8Array], { type: "image/jpeg" });

      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureSrc(reader.result);
      };
      reader.readAsDataURL(blob);
    };

    convertUint8ArrayToBlob();
  }, [user]);

  return (
    <Box m="20px">
      <LoadingSpinner isLoading={loading} />
      <Box
        sx={{
          mt: 3,
          backgroundColor: colors.blueAccent[700],
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <img
            alt="profile-user"
            width="50px"
            height="50px"
            src={profilePictureSrc}
            style={{ cursor: "pointer", borderRadius: "50%" }}
          />
          <Box>
            <Typography sx={{ fontSize: 20 }}>
              {user?.employeeDetails?.firstName}{" "}
              {user?.employeeDetails?.lastName} {user?.employeeDetails?.affix}
            </Typography>
            <Typography sx={{ fontSize: 12, color: colors.greenAccent[400] }}>
              {user?.employeeDetails?.designation}
            </Typography>
            <Typography sx={{ fontSize: 12 }}>
              {user?.employeeDetails?.department}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
