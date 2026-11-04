import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Admin from "./Admin.tsx";
import AdminNavbar from "./NavigationAd";
import ListUser from "./ListUser";
import Report from "./Report";
import ManageOrders from "./ManageOrders.tsx";
import Activity from "./Activity.tsx";
import RequestToUpgrade from "./RequestToUpgrade.tsx";
import WithdrawManagement from "./WithdrawManagement.tsx";
import { ExportPDF } from "./ExportPDF.tsx";
export default function RouterAdmin() {
  return (
    <div>
      <ExportPDF />
      <AdminNavbar />
      <Routes>
        <Route path={`/`} element={<Admin />} />
        <Route path={`listuser`} element={<ListUser />} />
        <Route path={`report`} element={<Report />} />
        <Route path={`request-upgrade`} element={<RequestToUpgrade />} />
        <Route path={`manageorders`} element={<ManageOrders />} />
        <Route path={`withdraw-management`} element={<WithdrawManagement />} />
        <Route path={`activity`} element={<Activity />} />
      </Routes>
      <Outlet />
    </div>
  );
}
