import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../../Employee/Layouts/Dispatching/sections/dashboard";
import DispatchedTransactions from "../Layouts/Dispatching/sections/dispatchedTransactions";
import VehicleLocation from "../Layouts/Dispatching/sections/vehicleLocation";
import VehicleTypes from "../../OtherComponents/Sections/vehicleTypes";
import Vehicles from "../../OtherComponents/Sections/vehicles";
import VehicleMaintenanceRequest from "../../OtherComponents/Sections/vehicleMaintenanceRequest";
import Calendar from "../../Employee/Layouts/Dispatching/sections/calendar";
import FAQ from "../../Employee/Layouts/Dispatching/sections/faq";
import Bar from "../../Employee/Layouts/Dispatching/sections/bar";
import Pie from "../../Employee/Layouts/Dispatching/sections/pie";
import Line from "../../Employee/Layouts/Dispatching/sections/line";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const DispatchingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<DispatchedTransactions user={user} />}
      />
      <Route path="vehicleLocation" element={<VehicleLocation user={user} />} />
      <Route path="vehicleTypes" element={<VehicleTypes user={user} />} />
      <Route path="vehicles" element={<Vehicles user={user} />} />
      <Route
        path="vehicleMaintenanceRequests"
        element={<VehicleMaintenanceRequest user={user} />}
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

export default DispatchingRoutes;
