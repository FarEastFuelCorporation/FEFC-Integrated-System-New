import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../Layouts/Sorting/sections/dashboard";
import SortedTransactions from "../Layouts/Sorting/sections/sortedTransactions";
import ScrapTypes from "../../OtherComponents/Sections/scrapTypes";
import Calendar from "../Layouts/Sorting/sections/calendar";
import FAQ from "../Layouts/Sorting/sections/faq";
import Bar from "../Layouts/Sorting/sections/bar";
import Pie from "../Layouts/Sorting/sections/pie";
import Line from "../Layouts/Sorting/sections/line";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const SortingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<SortedTransactions user={user} />} />
      <Route path="scrapTypes" element={<ScrapTypes user={user} />} />
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

export default SortingRoutes;
