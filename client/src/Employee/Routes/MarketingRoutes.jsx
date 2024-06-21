import React from "react";
import { Route, Routes } from "react-router-dom";
import MarketingDashboard from "../../Employee/Layouts/Marketing/MarketingDashboard";
import Dashboard from "../../Employee/Layouts/Marketing/sections/dashboard";
import Clients from "../../Employee/Layouts/Marketing/sections/clients";
import TypeOfWastes from "../../Employee/Layouts/Marketing/sections/typeOfWaste";
import Quotations from "../../Employee/Layouts/Marketing/sections/quotations";
import Commissions from "../../Employee/Layouts/Marketing/sections/commissions";
import Form from "../../Employee/Layouts/Marketing/sections/form";
import Calendar from "../../Employee/Layouts/Marketing/sections/calendar";
import FAQ from "../../Employee/Layouts/Marketing/sections/faq";
import Bar from "../../Employee/Layouts/Marketing/sections/bar";
import Pie from "../../Employee/Layouts/Marketing/sections/pie";
import Line from "../../Employee/Layouts/Marketing/sections/line";

const MarketingRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<MarketingDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes />} />
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
