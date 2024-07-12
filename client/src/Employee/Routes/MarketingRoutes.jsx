import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../../Employee/Layouts/Marketing/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import Quotations from "../../OtherComponents/Sections/quotations";
import ScheduledTransactions from "../../Employee/Layouts/Marketing/sections/scheduledTransactions";
import Commissions from "../../OtherComponents/Sections/commissions";
import Calendar from "../../Employee/Layouts/Marketing/sections/calendar";
import FAQ from "../../Employee/Layouts/Marketing/sections/faq";
import Bar from "../../Employee/Layouts/Marketing/sections/bar";
import Pie from "../../Employee/Layouts/Marketing/sections/pie";
import Line from "../../Employee/Layouts/Marketing/sections/line";

const MarketingRoutes = ({ user }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route
        path="transactions"
        element={<ScheduledTransactions user={user} />}
      />
      <Route path="commissions" element={<Commissions />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default MarketingRoutes;
