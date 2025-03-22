import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebarJD from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Marketing/sections/dashboard";
import Calendar from "../Layouts/Marketing/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const AdminRoutesJD = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebarJD user={user} />}>
      <Route path="" element={<Dashboard user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default AdminRoutesJD;
