import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Transporter/sections/dashboard";
import BookedTransactions from "../../OtherComponents/Sections/bookedTransactions";
import Calendar from "../Layouts/Transporter/sections/calendar";
import Quotations from "../../OtherComponents/Sections/quotations";
import TransporterClient from "../../OtherComponents/Sections/transporterClient";

const TransporterRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<BookedTransactions user={user} />} />
      <Route
        path="transporterClient"
        element={<TransporterClient user={user} />}
      />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route path="calendar" element={<Calendar />} />
    </Route>
  </Routes>
);

export default TransporterRoutes;
