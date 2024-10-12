import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Layouts/Employee/sections/dashboard";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import EmployeeSidebar from "../../OtherComponents/EmployeeSidebar";

const EmployeeRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<EmployeeSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />

      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default EmployeeRoutes;
