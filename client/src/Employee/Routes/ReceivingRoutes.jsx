import React from "react";
import { Route, Routes } from "react-router-dom";
import ReceivingDashboard from "../../Employee/Layouts/Receiving/ReceivingDashboard";
import Dashboard from "../../Employee/Layouts/Receiving/sections/dashboard";
import ReceivedTransactions from "../Layouts/Receiving/sections/receivedTransactions";
import VehicleTypes from "../Layouts/Receiving/sections/vehicleTypes";
import Vehicles from "../../Employee/Layouts/Receiving/sections/vehicles";
import VehicleMaintenanceRequest from "../Layouts/Receiving/sections/vehicleMaintenanceRequest";
import Form from "../../Employee/Layouts/Receiving/sections/form";
import Calendar from "../../Employee/Layouts/Receiving/sections/calendar";
import FAQ from "../../Employee/Layouts/Receiving/sections/faq";
import Bar from "../../Employee/Layouts/Receiving/sections/bar";
import Pie from "../../Employee/Layouts/Receiving/sections/pie";
import Line from "../../Employee/Layouts/Receiving/sections/line";

const ReceivingRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<ReceivingDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<ReceivedTransactions user={user} />}
      />
      <Route path="vehicleTypes" element={<VehicleTypes user={user} />} />
      <Route path="vehicles" element={<Vehicles user={user} />} />
      <Route
        path="vehicleMaintenanceRequest"
        element={<VehicleMaintenanceRequest user={user} />}
      />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default ReceivingRoutes;
