import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Home from "../Layouts/Employee/sections/home";
import Transactions from "../Layouts/Employee/sections/transactions";
import Profile from "../Layouts/Employee/sections/profile";
import Attendance from "../Layouts/Employee/screens/attendance";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Overtime from "../Layouts/Employee/screens/overtime";
import Undertime from "../Layouts/Employee/screens/undertime";
import Leave from "../Layouts/Employee/screens/leave";
import TravelOrder from "../Layouts/Employee/screens/travelOrder";
import WorkSchedule from "../Layouts/Employee/screens/workSchedule";

const EmployeeRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Home user={user} />} />
      <Route path="transactions" element={<Transactions user={user} />} />
      <Route path="profile" element={<Profile user={user} />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
      {/* Screens */}
      <Route path="attendance" element={<Attendance user={user} />} />
      <Route path="overtime" element={<Overtime user={user} />} />
      <Route path="undertime" element={<Undertime user={user} />} />
      <Route path="leave" element={<Leave user={user} />} />
      <Route path="travelOrder" element={<TravelOrder user={user} />} />
      <Route path="workSchedule" element={<WorkSchedule user={user} />} />
    </Route>
  </Routes>
);

export default EmployeeRoutes;
