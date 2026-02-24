import { useEffect, useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";
import { Search, Filter, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* =============================
     CONSTANTS
  ============================== */
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  /* =============================
     FETCH DATA
  ============================== */

  const fetchApplications = async () => {
    try {
      const { data } =
        await axiosInstance.get("/admin/applications");

      setApplications(data);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* =============================
     STATUS UPDATE (DYNAMIC)
  ============================== */

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(
        `/applications/${id}/status`,
        { status }
      );

      toast.success("Status Updated");

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status }
            : app
        )
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* =============================
     FILTER LOGIC
  ============================== */

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === "All" ||
        app.status === statusFilter;

      const matchesSearch =
        app.student?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        app.drive?.jobRole
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        app.company?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  /* =============================
     STATUS COUNTS
  ============================== */

  const counts = {
    total: applications.length,
    selected: applications.filter(
      (a) => a.status === "Selected"
    ).length,
    rejected: applications.filter(
      (a) => a.status === "Rejected"
    ).length,
    shortlisted: applications.filter(
      (a) => a.status === "Shortlisted"
    ).length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Applications
            </h1>
            <p className="text-slate-600 mt-2">Manage student applications and status</p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total" value={counts.total} icon={<FileText size={20} />} color="bg-blue-50 text-blue-600" />
          <StatCard label="Shortlisted" value={counts.shortlisted} icon={<Clock size={20} />} color="bg-amber-50 text-amber-600" />
          <StatCard label="Selected" value={counts.selected} icon={<CheckCircle size={20} />} color="bg-emerald-50 text-emerald-600" />
          <StatCard label="Rejected" value={counts.rejected} icon={<XCircle size={20} />} color="bg-red-50 text-red-600" />
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              placeholder="Search student, role, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all text-sm sm:text-base"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["All", "Applied", "Shortlisted", "Selected", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${statusFilter === status
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center h-60 items-center">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredApps.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center p-16 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200"
                >
                  <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Filter size={40} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No applications found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                </motion.div>
              ) : (
                filteredApps.map((app) => (
                  <motion.div
                    layout
                    key={app._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {app.student?.name}
                          </h3>
                          <p className="text-sm font-medium text-slate-600">
                            {app.drive?.jobRole}
                          </p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {app.company?.name}
                      </div>

                      <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                          Update Status
                        </label>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer hover:bg-slate-100"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    {app.student?.resume?.secure_url && (
                      <a
                        href={
                          app.student.resume.secure_url.startsWith("http")
                            ? app.student.resume.secure_url
                            : `${BASE_URL}${app.student.resume.secure_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-100 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold transition-colors"
                      >
                        <FileText size={16} />
                        View Resume
                      </a>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* =============================
   MINI STAT CARD
============================== */

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  );
}
