import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebarJD from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Marketing/sections/dashboard";
import Calendar from "../Layouts/Marketing/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import ProductCategoryJD from "../../OtherComponents/Sections/productCategory";
import OperationsJD from "../../OtherComponents/Sections/operations";
import StocksJD from "../../OtherComponents/Sections/stocks";
import EquipmentsJD from "../../OtherComponents/Sections/equipments";
import InventoryJD from "../../OtherComponents/Sections/inventory";
import LedgerJD from "../../OtherComponents/Sections/ledger";

const AdminRoutesJD = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebarJD user={user} />}>
      {/* <Route path="" element={<Dashboard user={user} />} /> */}
      <Route
        path="productCategory"
        element={<ProductCategoryJD user={user} />}
      />
      <Route path="operations" element={<OperationsJD user={user} />} />
      <Route path="stocks" element={<StocksJD user={user} />} />
      <Route path="equipments" element={<EquipmentsJD user={user} />} />
      <Route path="inventory" element={<InventoryJD user={user} />} />
      <Route path="ledger" element={<LedgerJD user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default AdminRoutesJD;
