import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import RecruiterBarChart from "./RecruiterBarChart";

export default function CompanyDetail() {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] =
    useState(false);

  const [stats, setStats] = useState({});
  const [newRecruiter, setNewRecruiter] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  /* =========================
     FETCH COMPANY
  ========================== */

  const fetchCompany = async () => {
    try {
      const { data } =
        await axiosInstance.get(
          `/admin/company/${id}`
        );
      setCompany(data);
    } catch {
      toast.error("Failed to load company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  /* =========================
     FETCH STATS PER RECRUITER
  ========================== */

  const fetchStats = async (recruiterId) => {
    try {
      const { data } =
        await axiosInstance.get(
          `/admin/recruiter-stats/${recruiterId}`
        );

      setStats((prev) => ({
        ...prev,
        [recruiterId]: data,
      }));
    } catch {
      console.log("Stats failed");
    }
  };

  useEffect(() => {
    if (company?.recruiters?.length > 0) {
      company.recruiters.forEach((rec) => {
        if (!stats[rec._id]) {
          fetchStats(rec._id);
        }
      });
    }
  }, [company]);

  /* =========================
     ADD RECRUITER
  ========================== */

  const addRecruiter = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/admin/recruiter",
        {
          ...newRecruiter,
          companyId: id,
        }
      );

      toast.success("Recruiter added 🎉");
      setShowAddModal(false);
      setNewRecruiter({
        name: "",
        email: "",
        password: "",
      });
      fetchCompany();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Error adding recruiter"
      );
    }
  };

  const removeRecruiter = async (
    recruiterId
  ) => {
    try {
      await axiosInstance.delete(
        `/admin/recruiter/${recruiterId}`
      );

      toast.success("Recruiter removed");
      fetchCompany();
    } catch {
      toast.error("Remove failed");
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center h-60 items-center">
          <div className="animate-spin h-10 w-10 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      {/* COMPANY HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white">
            {company.name}
          </h2>
          <p className="text-gray-500">
            {company.description}
          </p>
        </div>

        <button
          onClick={() =>
            setShowAddModal(true)
          }
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Add Recruiter
        </button>
      </div>

      {/* RECRUITER GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {company.recruiters.map((rec) => {
          const recStats = stats[rec._id];

          return (
            <motion.div
              key={rec._id}
              whileHover={{ scale: 1.04 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
            >
              <h3 className="font-semibold text-indigo-600 dark:text-white">
                {rec.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {rec.email}
              </p>

              {/* STATS */}
              {recStats ? (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <StatCard
                      label="Drives"
                      value={recStats.totalDrives}
                    />
                    <StatCard
                      label="Applications"
                      value={recStats.totalApplications}
                    />
                    <StatCard
                      label="Selected"
                      value={recStats.selected}
                      color="bg-green-100 dark:bg-green-900"
                    />
                    <StatCard
                      label="Rejected"
                      value={recStats.rejected}
                      color="bg-red-100 dark:bg-red-900"
                    />
                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    Selection Rate:{" "}
                    {recStats.selectionRate}%
                  </p>

                  {/* 🔥 BAR CHART HERE */}
                  <div className="mt-4">
                    <RecruiterBarChart
                      stats={recStats}
                    />
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs text-gray-400">
                  Loading stats...
                </p>
              )}

              <button
                onClick={() =>
                  removeRecruiter(rec._id)
                }
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                Remove
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-6 dark:text-white">
                Add Recruiter
              </h3>

              <form onSubmit={addRecruiter}>
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={newRecruiter.name}
                  onChange={(e) =>
                    setNewRecruiter({
                      ...newRecruiter,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 mb-4 rounded-lg border"
                />

                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={newRecruiter.email}
                  onChange={(e) =>
                    setNewRecruiter({
                      ...newRecruiter,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-3 mb-4 rounded-lg border"
                />

                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={newRecruiter.password}
                  onChange={(e) =>
                    setNewRecruiter({
                      ...newRecruiter,
                      password:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 mb-6 rounded-lg border"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAddModal(false)
                    }
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

/* MINI STAT CARD */
function StatCard({
  label,
  value,
  color = "bg-gray-100 dark:bg-slate-700",
}) {
  return (
    <div
      className={`${color} p-3 rounded-lg text-center`}
    >
      <p className="font-bold text-sm">
        {value ?? 0}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        {label}
      </p>
    </div>
  );
}
