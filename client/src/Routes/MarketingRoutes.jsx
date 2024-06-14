import React from "react";
import { Route, Routes } from "react-router-dom";
import MarketingDashboard from "../layouts/Marketing/MarketingDashboard";
import MarketingSection1 from "../layouts/Marketing/sections/Section1";
import MarketingSection2 from "../layouts/Marketing/sections/Section2";

const MarketingRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<MarketingDashboard user={user} />}>
      <Route path="section1" element={<MarketingSection1 />} />
      <Route path="section2" element={<MarketingSection2 />} />
    </Route>
  </Routes>
);

export default MarketingRoutes;
