import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/HealthOfficer/sections/dashboard";
import EmployeeRecords from "../Layouts/HR/sections/employeeRecords";
import Documents from "../../OtherComponents/Sections/documents";
import Calendar from "../Layouts/HealthOfficer/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const HealthOfficerRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="employee" element={<EmployeeRecords user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default HealthOfficerRoutes;
