import React from "react";
import { Route, Routes } from "react-router-dom";
import ReceivingDashboard from "../layouts/Receiving/ReceivingDashboard";
import ReceivingSection1 from "../layouts/Receiving/sections/Section1";
import ReceivingSection2 from "../layouts/Receiving/sections/Section2";

const ReceivingRoutes = () => (
  <Routes>
    <Route path="/" element={<ReceivingDashboard />}>
      <Route path="section1" element={<ReceivingSection1 />} />
      <Route path="section2" element={<ReceivingSection2 />} />
    </Route>
  </Routes>
);

export default ReceivingRoutes;
