import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import RestoreIcon from "@mui/icons-material/Restore";
import { tokens } from "../../../../../theme";
import Header from "../../../../../OtherComponents/Header";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import NavIcon from "../../../../../OtherComponents/NavIcon";

const Home = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state

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

  console.log(user);

  return (
    <Box m="20px">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: 20, fontStyle: "italic" }}>
          Hello {user?.employeeDetails.firstName}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 3,
          backgroundColor: colors.blueAccent[700],
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <Typography sx={{ fontSize: 20 }}>Shortcuts</Typography>
        <hr />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            flexWrap: "wrap",
            columnGap: "30px",
          }}
        >
          <NavIcon
            icon={<i className="fa-solid fa-clipboard-user"></i>}
            label={"Attendance"}
          />
          <NavIcon
            icon={<MoreTimeIcon sx={{ fontSize: "30px" }} />}
            label={"Overtime"}
          />
          <NavIcon
            icon={<RestoreIcon sx={{ fontSize: "30px" }} />}
            label={"Undertime"}
          />
          <NavIcon
            icon={<i className="fa-solid fa-right-from-bracket"></i>}
            label={"Leave"}
          />
          <NavIcon
            icon={<i className="fa-solid fa-car-side"></i>}
            label={"Travel Order"}
          />
          <NavIcon
            icon={<i className="fa-solid fa-sack-dollar"></i>}
            label={"Cash Advance"}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 3,
          backgroundColor: colors.blueAccent[700],
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <Typography sx={{ fontSize: 20 }}>Announcements</Typography>
        <hr />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 12 }}>
            No Announcements for today
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
