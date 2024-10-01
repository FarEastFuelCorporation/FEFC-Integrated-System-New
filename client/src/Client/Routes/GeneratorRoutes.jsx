import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../OtherComponents/UserSidebar";
import Dashboard from "../../Client/Layouts/Generator/sections/dashboard";
import BookedTransactions from "../Layouts/Generator/sections/bookedTransactions";
import Quotations from "../../OtherComponents/Sections/quotations";
import Form from "../../Client/Layouts/Generator/sections/form";
import Calendar from "../../Client/Layouts/Generator/sections/calendar";
import FAQ from "../../Client/Layouts/Generator/sections/faq";
import Bar from "../../Client/Layouts/Generator/sections/bar";
import Pie from "../../Client/Layouts/Generator/sections/pie";
import Line from "../../Client/Layouts/Generator/sections/line";

const GeneratorRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<UserDashboard user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<BookedTransactions user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="line" element={<Line />} />
    </Route>
  </Routes>
);

export default GeneratorRoutes;
