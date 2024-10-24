import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../../Employee/Layouts/HR/sections/dashboard";
import Departments from "../../OtherComponents/Sections/departments";
import Contacts from "../../Employee/Layouts/HR/sections/contacts";
import AttendanceRecords from "../Layouts/HR/sections/attendanceRecords";
import Calendar from "../../Employee/Layouts/HR/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import TravelOrder from "../Layouts/HR/sections/travelOrder";
import Leave from "../Layouts/HR/sections/leave";
import Documents from "../../OtherComponents/Sections/documents";
import WorkSchedule from "../Layouts/HR/sections/workSchedule";
import OvertimeRequest from "../Layouts/HR/sections/overtimeRequest";
import EmployeeSalary from "../Layouts/HR/sections/employeeSalary";
import Payroll from "../Layouts/HR/sections/payroll";

const HRRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="departments" element={<Departments user={user} />} />
      <Route path="employee" element={<Contacts user={user} />} />
      <Route
        path="attendanceRecords"
        element={<AttendanceRecords user={user} />}
      />
      <Route path="employeeSalary" element={<EmployeeSalary user={user} />} />
      <Route path="payroll" element={<Payroll user={user} />} />
      <Route path="workSchedules" element={<WorkSchedule user={user} />} />
      <Route
        path="overtimeRequests"
        element={<OvertimeRequest user={user} />}
      />
      <Route path="travelOrder" element={<TravelOrder user={user} />} />
      <Route path="leave" element={<Leave user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default HRRoutes;
