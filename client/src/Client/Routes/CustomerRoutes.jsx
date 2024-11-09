import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Generator/sections/dashboard";
import BookedTransactions from "../../OtherComponents/Sections/bookedTransactions";
import Calendar from "../Layouts/Generator/sections/calendar";
import Quotations from "../../OtherComponents/Sections/quotations";

const CustomerRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<BookedTransactions user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route path="calendar" element={<Calendar />} />
    </Route>
  </Routes>
);

export default CustomerRoutes;
