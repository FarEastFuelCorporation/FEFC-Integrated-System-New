import React from "react";
import { Route, Routes } from "react-router-dom";
import MarketingDashboard from "../layouts/Marketing/MarketingDashboard";
import Dashboard from "../layouts/Marketing/sections/dashboard";
import Clients from "../layouts/Marketing/sections/clients";
import Quotations from "../layouts/Marketing/sections/quotations";
import Commissions from "../layouts/Marketing/sections/commissions";
import Form from "../layouts/Marketing/sections/form";
import Calendar from "../layouts/Marketing/sections/calendar";
import FAQ from "../layouts/Marketing/sections/faq";
import Bar from "../layouts/Marketing/sections/bar";
import Pie from "../layouts/Marketing/sections/pie";
import Line from "../layouts/Marketing/sections/line";

const MarketingRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<MarketingDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="clients" element={<Clients />} />
      <Route path="quotations" element={<Quotations />} />
      <Route path="commissions" element={<Commissions />} />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default MarketingRoutes;
