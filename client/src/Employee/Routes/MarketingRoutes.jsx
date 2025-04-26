import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../../Employee/Layouts/Marketing/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import Logistics from "../../OtherComponents/Sections/logistics";
import Quotations from "../../OtherComponents/Sections/quotations";
import ScheduledTransactions from "../../Employee/Layouts/Marketing/sections/scheduledTransactions";
import Commissions from "../../OtherComponents/Sections/commissions";
import Documents from "../../OtherComponents/Sections/documents";
import Calendar from "../../Employee/Layouts/Marketing/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import TruckScale from "../Layouts/Receiving/sections/truckScale";
import PTT from "../../OtherComponents/Sections/ptt";

const MarketingRoutes = ({ user, onUpdateUser, socket }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard user={user} />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="ptt" element={<PTT user={user} socket={socket} />} />
      <Route path="logistics" element={<Logistics user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route
        path="transactions"
        element={<ScheduledTransactions user={user} />}
      />
      <Route path="commissions" element={<Commissions />} />
      <Route
        path="truckScale"
        element={<TruckScale user={user} socket={socket} />}
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

export default MarketingRoutes;
