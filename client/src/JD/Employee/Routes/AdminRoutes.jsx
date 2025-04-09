import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebarJD from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Marketing/sections/dashboard";
import Calendar from "../Layouts/Marketing/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import ProductCategoryJD from "../../OtherComponents/Sections/productCategory";
import ProductionJD from "../../OtherComponents/Sections/production";
import StocksJD from "../../OtherComponents/Sections/stocks";
import EquipmentJD from "../../OtherComponents/Sections/equipments";
import InventoryJD from "../../OtherComponents/Sections/inventory";
import LedgerJD from "../../OtherComponents/Sections/ledger";
import DashboardJD from "../../OtherComponents/Sections/dashboard";

const AdminRoutesJD = ({ user, onUpdateUser, socket }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebarJD user={user} />}>
      <Route path="" element={<DashboardJD user={user} />} />
      <Route
        path="productCategory"
        element={<ProductCategoryJD user={user} socket={socket} />}
      />
      <Route
        path="production"
        element={<ProductionJD user={user} socket={socket} />}
      />
      <Route path="stocks" element={<StocksJD user={user} socket={socket} />} />
      <Route
        path="equipments"
        element={<EquipmentJD user={user} socket={socket} />}
      />
      <Route
        path="inventory"
        element={<InventoryJD user={user} socket={socket} />}
      />
      <Route path="ledger" element={<LedgerJD user={user} socket={socket} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default AdminRoutesJD;
