import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserDashboard";
import Dashboard from "../Layouts/Billing/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import BilledTransactions from "../Layouts/Billing/sections/billedTransactions";
import Quotations from "../../OtherComponents/Sections/quotations";
import Documents from "../../OtherComponents/Sections/documents";
import Calendar from "../Layouts/Billing/sections/calendar";
import FAQ from "../Layouts/Billing/sections/faq";
import Bar from "../Layouts/Billing/sections/bar";
import Pie from "../Layouts/Billing/sections/pie";
import Line from "../Layouts/Billing/sections/line";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const BillingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="transactions" element={<BilledTransactions user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
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

export default BillingRoutes;
