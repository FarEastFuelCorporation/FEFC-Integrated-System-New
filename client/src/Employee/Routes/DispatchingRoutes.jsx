import React from "react";
import { Route, Routes } from "react-router-dom";
import DispatchingDashboard from "../../Employee/Layouts/Dispatching/DispatchingDashboard";
import Dashboard from "../../Employee/Layouts/Dispatching/sections/dashboard";
import VehicleTypes from "../Layouts/Dispatching/sections/vehicleTypes";
import Vehicles from "../../Employee/Layouts/Dispatching/sections/vehicles";
import VehicleMaintenanceRequest from "../Layouts/Dispatching/sections/vehicleMaintenanceRequest";
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

export default DispatchingRoutes;
