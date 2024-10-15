import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeSidebarComponent from "../../OtherComponents/EmployeeSidebarComponent";
import Home from "../Layouts/Employee/sections/home";
import Transactions from "../Layouts/Employee/sections/transactions";
import Profile from "../Layouts/Employee/sections/profile";

const EmployeeRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<EmployeeSidebarComponent user={user} />}>
      <Route path="" element={<Home user={user} />} />
      <Route path="transactions" element={<Transactions user={user} />} />
      <Route path="profile" element={<Profile user={user} />} />
    </Route>
  </Routes>
);

export default EmployeeRoutes;
