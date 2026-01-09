import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SidebarMenu } from "./SidebarMenu";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const getUserDisplayName = (user) => {
    if (!user) return "";
    if (user.username) return user.username;
    if (user.email) return user.email.split("@")[0];
    return "";
  }; 

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* ==================== SIDEBAR (DESKTOP) ==================== */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
          AI Invoice
        </h1>

        <SidebarMenu />
      </aside>

      {/* ==================== SIDEBAR OVERLAY (MOBILE) ==================== */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition ${
          sidebarOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ==================== SIDEBAR DRAWER (MOBILE) ==================== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-50 transform transition-all duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">AI Invoice</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <SidebarMenu onClick={() => setSidebarOpen(false)} />
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="flex-1 flex flex-col">

        {/* ---------------- TOP HEADER ---------------- */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-slate-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Welcome Text */}
          <h2 className="text-lg font-semibold text-slate-800">
        <span className="font-medium text-slate-700">
          Welcome back, {getUserDisplayName(user)}
        </span>
          </h2>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* ---------------- ACTUAL PAGE CONTENT ---------------- */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
