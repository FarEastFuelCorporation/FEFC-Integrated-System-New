import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserSidebar";
import Dashboard from "../../Client/Layouts/Generator/sections/dashboard";
import BookedTransactions from "../../OtherComponents/Sections/bookedTransactions";
import Calendar from "../../Client/Layouts/Generator/sections/calendar";
import Quotations from "../../OtherComponents/Sections/quotations";
import Help from "../../OtherComponents/Sections/help";

const GeneratorRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard user={user} />} />
      <Route path="transactions" element={<BookedTransactions user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="help" element={<Help />} />
    </Route>
  </Routes>
);

export default GeneratorRoutes;
