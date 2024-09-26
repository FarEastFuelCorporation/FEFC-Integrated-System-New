import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../Layouts/Treatment/sections/dashboard";
import TreatedTransactions from "../Layouts/Treatment/sections/treatedTransactions";
import TreatmentMachine from "../../OtherComponents/Sections/treatmentMachine";
import Calendar from "../Layouts/Treatment/sections/calendar";
import FAQ from "../Layouts/Treatment/sections/faq";
import Bar from "../Layouts/Treatment/sections/bar";
import Pie from "../Layouts/Treatment/sections/pie";
import Line from "../Layouts/Treatment/sections/line";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const TreatmentRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<TreatedTransactions user={user} />}
      />
      <Route
        path="treatmentMachines"
        element={<TreatmentMachine user={user} />}
      />
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

export default TreatmentRoutes;
