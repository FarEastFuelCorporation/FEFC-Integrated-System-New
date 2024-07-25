import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../../Employee/Layouts/HR/sections/dashboard";
import Departments from "../../OtherComponents/Sections/departments";
import Contacts from "../../Employee/Layouts/HR/sections/contacts";
import Calendar from "../../Employee/Layouts/HR/sections/calendar";
import FAQ from "../../Employee/Layouts/HR/sections/faq";
import Bar from "../../Employee/Layouts/HR/sections/bar";
import Pie from "../../Employee/Layouts/HR/sections/pie";
import Line from "../../Employee/Layouts/HR/sections/line";

const HRRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="departments" element={<Departments user={user} />} />
      <Route path="employee" element={<Contacts user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default HRRoutes;
