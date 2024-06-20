import React from "react";
import { Route, Routes } from "react-router-dom";
import DispatchingDashboard from "../../Employee/Layouts/Dispatching/DispatchingDashboard";
import DispatchingSection1 from "../../Employee/Layouts/Dispatching/sections/Section1";
import DispatchingSection2 from "../../Employee/Layouts/Dispatching/sections/Section2";

const DispatchingRoutes = () => (
  <Routes>
    <Route path="/" element={<DispatchingDashboard />}>
      <Route path="section1" element={<DispatchingSection1 />} />
      <Route path="section2" element={<DispatchingSection2 />} />
    </Route>
  </Routes>
);

export default DispatchingRoutes;
