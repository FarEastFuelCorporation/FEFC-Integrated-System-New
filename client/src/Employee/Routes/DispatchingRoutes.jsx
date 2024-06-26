import React from "react";
import { Route, Routes } from "react-router-dom";
import DispatchingDashboard from "../../Employee/Layouts/Dispatching/DispatchingDashboard";
import Dashboard from "../../Employee/Layouts/Dispatching/sections/dashboard";
import Clients from "../../Employee/Layouts/Dispatching/sections/clients";
import TypeOfWastes from "../../Employee/Layouts/Dispatching/sections/typeOfWaste";
import Quotations from "../../Employee/Layouts/Dispatching/sections/quotations";
import Commissions from "../../Employee/Layouts/Dispatching/sections/commissions";
import Form from "../../Employee/Layouts/Dispatching/sections/form";
import Calendar from "../../Employee/Layouts/Dispatching/sections/calendar";
import FAQ from "../../Employee/Layouts/Dispatching/sections/faq";
import Bar from "../../Employee/Layouts/Dispatching/sections/bar";
import Pie from "../../Employee/Layouts/Dispatching/sections/pie";
import Line from "../../Employee/Layouts/Dispatching/sections/line";

const DispatchingRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<DispatchingDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes />} />
      <Route path="quotations" element={<Quotations user={user} />} />
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

export default DispatchingRoutes;
