import React, { useEffect, useState } from "react";
import { DollarSign, FileText, Loader2 } from "lucide-react";

import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../utils/ApiRoute";
import AISummaryCard from "../../components/Summary/AISummaryCard";

const Dashboard = () => {


  const [data, setData] = useState({
    totalInvoices: 0,
    totalPaidInvoices: 0,
    totalUnpaidInvoices: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DASHBOARD DATA ----------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_ROUTES.INVOICE.GET_ALL_INVOICES
        );

        const invoices = response.data || [];

        const totalInvoices = invoices.length;

        const totalPaidInvoices = invoices
          .filter((inv) => inv.status?.toLowerCase() === "paid")
          .reduce((sum, inv) => sum + (inv.total || 0), 0);

        const totalUnpaidInvoices = invoices
          .filter((inv) => inv.status?.toLowerCase() !== "paid")
          .reduce((sum, inv) => sum + (inv.total || 0), 0);

        setData({
          totalInvoices,
          totalPaidInvoices,
          totalUnpaidInvoices,
        });

        const sortedInvoices = [...invoices].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRecentInvoices(sortedInvoices.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---------------- DASH CARDS ----------------
  const DashData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: data.totalInvoices,
      color: "indigo",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `₹${data.totalPaidInvoices.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `₹${data.totalUnpaidInvoices.toFixed(2)}`,
      color: "red",
    },
  ];

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="space-y-6">
      {/* ===== DASHBOARD STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DashData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4"
            >
              <div
                className={`p-3 rounded-lg bg-${item.color}-100 text-${item.color}-600`}
              >
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <h3 className="text-xl font-bold text-slate-800">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <AISummaryCard/>

      {/* ===== RECENT INVOICES ===== */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Invoices
        </h2>

        <div className="space-y-3">
          {recentInvoices.map((inv) => (
            <div
              key={inv._id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Left side */}
              <div>
                <p className="font-semibold text-slate-700">
                  Invoice #{inv.invoiceNumber}
                </p>
                <p className="text-sm text-slate-500">{inv.clientName}</p>
              </div>

              {/* Middle */}
              <div className="text-right">
                <p className="font-bold text-slate-800">
                  ₹{inv.total.toFixed(2)}
                </p>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    inv.status === "Paid"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              {/* Right side */}
              <div className="text-sm text-slate-400">
                {new Date(inv.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
