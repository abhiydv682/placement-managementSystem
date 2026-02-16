import { useEffect, useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion } from "framer-motion";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
        `/applications/${id}`,
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
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-3xl font-bold dark:text-white">
            Applications Management
          </h2>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search student, role, company..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="px-4 py-2 rounded-xl border dark:bg-slate-700 dark:text-white w-full md:w-96 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={counts.total} />
          <StatCard
            label="Shortlisted"
            value={counts.shortlisted}
            color="bg-yellow-100 dark:bg-yellow-900"
          />
          <StatCard
            label="Selected"
            value={counts.selected}
            color="bg-green-100 dark:bg-green-900"
          />
          <StatCard
            label="Rejected"
            value={counts.rejected}
            color="bg-red-100 dark:bg-red-900"
          />
        </div>

        {/* FILTER */}
        <div className="flex gap-3 flex-wrap">
          {[
            "All",
            "Applied",
            "Shortlisted",
            "Selected",
            "Rejected",
          ].map((status) => (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(status)
              }
              className={`px-4 py-2 rounded-xl text-sm transition ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-slate-700 dark:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center h-60 items-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
            <p className="text-gray-500 dark:text-gray-300">
              No applications found.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition space-y-4"
              >
                <div>
                  <h3 className="font-semibold text-indigo-600 dark:text-white">
                    {app.student?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {app.drive?.jobRole}
                  </p>
                  <p className="text-xs text-gray-400">
                    {app.company?.name}
                  </p>
                </div>

                <StatusBadge status={app.status} />

                {/* STATUS UPDATE */}
                <select
                  value={app.status}
                  onChange={(e) =>
                    updateStatus(
                      app._id,
                      e.target.value
                    )
                  }
                  className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:text-white"
                >
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>

                {/* RESUME BUTTON */}
                {app.student?.resume
                  ?.secure_url && (
                  <a
                    href={
                      app.student.resume
                        .secure_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2 bg-indigo-600 text-white rounded-lg text-sm hover:scale-105 transition"
                  >
                    View Resume
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

/* =============================
   MINI STAT CARD
============================== */

function StatCard({
  label,
  value,
  color = "bg-gray-100 dark:bg-slate-700",
}) {
  return (
    <div
      className={`${color} p-4 rounded-2xl text-center shadow`}
    >
      <p className="text-xl font-bold">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {label}
      </p>
    </div>
  );
}
