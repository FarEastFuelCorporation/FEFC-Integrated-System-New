import React from "react";
import { Route, Routes } from "react-router-dom";
import HRDashboard from "../layouts/HR/HRDashboard";
import Dashboard from "../layouts/HR/sections/dashboard";
import Team from "../layouts/HR/sections/team";
import Contacts from "../layouts/HR/sections/contacts";
import Invoices from "../layouts/HR/sections/invoices";
import Form from "../layouts/HR/sections/form";
import Calendar from "../layouts/HR/sections/calendar";
import FAQ from "../layouts/HR/sections/faq";
import Bar from "../layouts/HR/sections/bar";
import Pie from "../layouts/HR/sections/pie";
import Line from "../layouts/HR/sections/line";
import Geography from "../layouts/HR/sections/geography";

const HRRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<HRDashboard user={user} />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="team" element={<Team />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
      <Route path="geography" element={<Geography />} />
    </Route>
  </Routes>
);

export default HRRoutes;
