import React from "react";
import { Link } from "react-router-dom";

export const SidebarMenu = ({ onClick }) => {
  return (
    <nav className="flex flex-col space-y-2 font-medium mt-4">

      <Link
        to="/dashboard"
        onClick={onClick}
        className="px-3 py-2 rounded-md text-slate-700 hover:bg-slate-200"
      >
        Dashboard
      </Link>

      <Link
        to="/invoices"
        onClick={onClick}
        className="px-3 py-2 rounded-md text-slate-700 hover:bg-slate-200"
      >
        Invoices
      </Link>

      <Link
        to="/invoices/new"
        onClick={onClick}
        className="px-3 py-2 rounded-md text-slate-700 hover:bg-slate-200"
      >
        Create Invoice
      </Link>

      <Link
        to="/profile"
        onClick={onClick}
        className="px-3 py-2 rounded-md text-slate-700 hover:bg-slate-200"
      >
        Profile
      </Link>

    </nav>
  );
};
