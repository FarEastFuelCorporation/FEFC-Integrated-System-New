import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../Layouts/Certification/sections/dashboard";
import CertifiedTransactions from "../Layouts/Certification/sections/certifiedTransactions";
import Clients from "../../OtherComponents/Sections/clients";
import TreatmentProcess from "../../OtherComponents/Sections/treatmentProcess";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import Calendar from "../Layouts/Certification/sections/calendar";
import FAQ from "../Layouts/Certification/sections/faq";
import Bar from "../Layouts/Certification/sections/bar";
import Pie from "../Layouts/Certification/sections/pie";
import Line from "../Layouts/Certification/sections/line";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const CertificationRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route
        path="transactions"
        element={<CertifiedTransactions user={user} />}
      />
      <Route
        path="treatmentProcess"
        element={<TreatmentProcess user={user} />}
      />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default CertificationRoutes;
