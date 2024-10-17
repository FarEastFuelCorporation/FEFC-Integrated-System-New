import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Home from "../Layouts/Leader/sections/home";
import Transactions from "../Layouts/Leader/sections/transactions";
import Profile from "../Layouts/Leader/sections/profile";
import Attendance from "../Layouts/Leader/screens/attendance";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Overtime from "../Layouts/Leader/screens/overtime";
import Undertime from "../Layouts/Leader/screens/undertime";
import Leave from "../Layouts/Leader/screens/leave";
import TravelOrder from "../Layouts/Leader/screens/travelOrder";
import CashAdvance from "../Layouts/Leader/screens/cashAdvance";

const LeaderRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Home user={user} />} />
      <Route path="transactions" element={<Transactions user={user} />} />
      <Route path="profile" element={<Profile user={user} />} />
      {/* Screens */}
      <Route path="attendance" element={<Attendance user={user} />} />
      <Route path="overtime" element={<Overtime user={user} />} />
      <Route path="undertime" element={<Undertime user={user} />} />
      <Route path="leave" element={<Leave user={user} />} />
      <Route path="travelOrder" element={<TravelOrder user={user} />} />
      <Route path="cashAdvance" element={<CashAdvance user={user} />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default LeaderRoutes;
