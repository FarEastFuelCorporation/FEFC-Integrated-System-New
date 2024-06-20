import React from "react";
import { Route, Routes } from "react-router-dom";
import HRDashboard from "../../Employee/Layouts/HR/HRDashboard";
import Dashboard from "../../Employee/Layouts/HR/sections/dashboard";
import Team from "../../Employee/Layouts/HR/sections/team";
import Contacts from "../../Employee/Layouts/HR/sections/contacts";
import Invoices from "../../Employee/Layouts/HR/sections/invoices";
import Form from "../../Employee/Layouts/HR/sections/form";
import Calendar from "../../Employee/Layouts/HR/sections/calendar";
import FAQ from "../../Employee/Layouts/HR/sections/faq";
import Bar from "../../Employee/Layouts/HR/sections/bar";
import Pie from "../../Employee/Layouts/HR/sections/pie";
import Line from "../../Employee/Layouts/HR/sections/line";

const HRRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<HRDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="team" element={<Team />} />
      <Route path="employee" element={<Contacts />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default HRRoutes;
