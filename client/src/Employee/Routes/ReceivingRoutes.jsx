import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../../Employee/Layouts/Receiving/sections/dashboard";
import ReceivedTransactions from "../Layouts/Receiving/sections/receivedTransactions";
import VehicleTypes from "../../OtherComponents/Sections/vehicleTypes";
import Vehicles from "../../OtherComponents/Sections/vehicles";
import Calendar from "../../Employee/Layouts/Receiving/sections/calendar";
import FAQ from "../../Employee/Layouts/Receiving/sections/faq";
import Bar from "../../Employee/Layouts/Receiving/sections/bar";
import Pie from "../../Employee/Layouts/Receiving/sections/pie";
import Line from "../../Employee/Layouts/Receiving/sections/line";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const ReceivingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<ReceivedTransactions user={user} />}
      />
      <Route path="vehicleTypes" element={<VehicleTypes user={user} />} />
      <Route path="vehicles" element={<Vehicles user={user} />} />
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

export default ReceivingRoutes;
