import { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../../../theme";
import Header from "../../../../../OtherComponents/Header";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const Transactions = () => {
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

  return (
    <Box m="20px">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TRANSACTIONS" subtitle="Welcome to your Transactions" />
      </Box>
    </Box>
  );
};

export default Transactions;
