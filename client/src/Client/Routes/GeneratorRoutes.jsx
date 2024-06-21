import React from "react";
import { Route, Routes } from "react-router-dom";
import GeneratorDashboard from "../../Client/Layouts/Generator/GeneratorDashboard";
import Dashboard from "../../Client/Layouts/Generator/sections/dashboard";
import Clients from "../../Client/Layouts/Generator/sections/clients";
import TypeOfWastes from "../../Client/Layouts/Generator/sections/typeOfWaste";
import Quotations from "../../Client/Layouts/Generator/sections/quotations";
import Commissions from "../../Client/Layouts/Generator/sections/commissions";
import Form from "../../Client/Layouts/Generator/sections/form";
import Calendar from "../../Client/Layouts/Generator/sections/calendar";
import FAQ from "../../Client/Layouts/Generator/sections/faq";
import Bar from "../../Client/Layouts/Generator/sections/bar";
import Pie from "../../Client/Layouts/Generator/sections/pie";
import Line from "../../Client/Layouts/Generator/sections/line";

const GeneratorRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<GeneratorDashboard user={user} />}>
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

export default GeneratorRoutes;
