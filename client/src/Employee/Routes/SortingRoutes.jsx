import React from "react";
import { Route, Routes } from "react-router-dom";
import SortingDashboard from "../Layouts/Sorting/SortingDashboard";
import Dashboard from "../Layouts/Sorting/sections/dashboard";
import SortedTransactions from "../Layouts/Sorting/sections/sortingTransactions";
import ScrapTypes from "../Layouts/Sorting/sections/scrapTypes";
import Vehicles from "../Layouts/Sorting/sections/vehicles";
import VehicleMaintenanceRequest from "../Layouts/Sorting/sections/vehicleMaintenanceRequest";
import Form from "../Layouts/Sorting/sections/form";
import Calendar from "../Layouts/Sorting/sections/calendar";
import FAQ from "../Layouts/Sorting/sections/faq";
import Bar from "../Layouts/Sorting/sections/bar";
import Pie from "../Layouts/Sorting/sections/pie";
import Line from "../Layouts/Sorting/sections/line";

const SortingRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<SortingDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<SortedTransactions user={user} />} />
      <Route path="scrapTypes" element={<ScrapTypes user={user} />} />
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

export default SortingRoutes;
