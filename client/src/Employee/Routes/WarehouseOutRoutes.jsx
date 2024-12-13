import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/WarehouseOut/sections/dashboard";
import WarehousedOutTransactions from "../Layouts/WarehouseOut/sections/warehousedOutTransactions";
import Calendar from "../Layouts/WarehouseOut/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Documents from "../../OtherComponents/Sections/documents";

const WarehouseOutRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<WarehousedOutTransactions user={user} />}
      />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default WarehouseOutRoutes;
