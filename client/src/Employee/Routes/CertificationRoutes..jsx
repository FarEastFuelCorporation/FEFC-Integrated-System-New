import React from "react";
import { Route, Routes } from "react-router-dom";
import CertificationDashboard from "../Layouts/Certification/CertificationDashboard";
import Dashboard from "../Layouts/Certification/sections/dashboard";
import Clients from "../Layouts/Marketing/sections/clients";
import TreatmentProcess from "../Layouts/Certification/sections/treatmentProcess";
import TypeOfWastes from "../Layouts/Certification/sections/typeOfWaste";
import Form from "../Layouts/Certification/sections/form";
import Calendar from "../Layouts/Certification/sections/calendar";
import FAQ from "../Layouts/Certification/sections/faq";
import Bar from "../Layouts/Certification/sections/bar";
import Pie from "../Layouts/Certification/sections/pie";
import Line from "../Layouts/Certification/sections/line";

const CertificationRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<CertificationDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route
        path="treatmentProcess"
        element={<TreatmentProcess user={user} />}
      />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default CertificationRoutes;
