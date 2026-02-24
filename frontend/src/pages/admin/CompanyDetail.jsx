import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import RecruiterBarChart from "./RecruiterBarChart";
import {
  ArrowLeft,
  Mail,
  Trash,
  UserPlus,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Building2,
  X
} from "lucide-react";

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [linkMode, setLinkMode] = useState(false); // Toggle: Create vs Link

  const [stats, setStats] = useState({});
  const [newRecruiter, setNewRecruiter] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* =========================
     FETCH COMPANY
  ========================== */

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/admin/company/${id}`);
      setCompany(data);
    } catch {
      toast.error("Failed to load company");
      navigate("/admin/companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  /* =========================
     FETCH STATS PER RECRUITER
  ========================== */

  const fetchStats = async (recruiterId) => {
    try {
      const { data } = await axiosInstance.get(`/admin/recruiter-stats/${recruiterId}`);
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
      setModalLoading(true);
      await axiosInstance.post("/admin/recruiter", {
        ...newRecruiter,
        companyId: id,
      });

      toast.success("Recruiter added 🎉");
      setShowAddModal(false);
      setNewRecruiter({ name: "", email: "", password: "" });
      fetchCompany();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding recruiter");
    } finally {
      setModalLoading(false);
    }
  };

  /* =========================
     LINK EXISTING RECRUITER
  ========================== */

  const linkRecruiter = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      await axiosInstance.post("/admin/recruiter/link", {
        email: newRecruiter.email,
        companyId: id,
      });

      toast.success("Recruiter linked 🎉");
      setShowAddModal(false);
      setNewRecruiter({ name: "", email: "", password: "" });
      fetchCompany();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error linking recruiter");
    } finally {
      setModalLoading(false);
    }
  };

  /* =========================
     REMOVE RECRUITER
  ========================== */

  const removeRecruiter = async (recruiterId) => {
    if (!window.confirm("Are you sure you want to remove this recruiter?")) return;

    try {
      await axiosInstance.delete(`/admin/recruiter/${recruiterId}`);
      toast.success("Recruiter removed");
      fetchCompany();
    } catch {
      toast.error("Remove failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center h-screen items-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8 pb-20">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/admin/companies")}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={18} />
              <span>Back to Companies</span>
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
                <Building2 size={28} className="text-indigo-600 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{company.name}</h1>
                <p className="text-slate-500 max-w-2xl mt-1 text-sm sm:text-base line-clamp-2 md:line-clamp-none">
                  {company.description || "No description provided for this company."}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all font-semibold w-full md:w-auto mt-2 md:mt-0"
          >
            <UserPlus size={20} />
            Add Recruiter
          </button>
        </div>

        {/* RECRUITERS GRID */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-600 mb-6 flex items-center gap-2">
            Team & Performance
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{company.recruiters.length}</span>
          </h2>

          {company.recruiters.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <UserPlus size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No recruiters added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {company.recruiters.map((rec) => {
                const recStats = stats[rec._id];

                return (
                  <motion.div
                    key={rec._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[2rem] shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {rec.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{rec.name}</h3>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Mail size={14} />
                            <span className="truncate max-w-[150px]">{rec.email}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRecruiter(rec._id)}
                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                        title="Remove Recruiter"
                      >
                        <Trash size={18} />
                      </button>
                    </div>

                    {/* STATS */}
                    <div className="flex-1">
                      {recStats ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-3">
                            <StatItem icon={<Briefcase size={16} />} label="Drives" value={recStats.totalDrives} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
                            <StatItem icon={<FileText size={16} />} label="Apps" value={recStats.totalApplications} color="text-purple-600 bg-purple-50 dark:bg-purple-900/20" />
                            <StatItem icon={<CheckCircle size={16} />} label="Selected" value={recStats.selected} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" />
                            <StatItem icon={<XCircle size={16} />} label="Rejected" value={recStats.rejected} color="text-red-600 bg-red-50 dark:bg-red-900/20" />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-500">Selection Rate</span>
                              <span className="font-bold text-slate-800">{recStats.selectionRate}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${recStats.selectionRate}%` }}
                              />
                            </div>
                          </div>

                          {/* Chart Wrapper to prevent layout shift */}
                          <div className="h-40 w-full">
                            <RecruiterBarChart stats={recStats} />
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">
                          Loading performance data...
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Add Recruiter
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Create a new access account for this company.</p>

              <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLinkMode(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!linkMode ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Create New
                </button>
                <button
                  type="button"
                  onClick={() => setLinkMode(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${linkMode ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Link Existing
                </button>
              </div>

              <form onSubmit={linkMode ? linkRecruiter : addRecruiter} className="space-y-4">
                {/* NAME FIELD (Only for Create New) */}
                {!linkMode && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      required={!linkMode}
                      placeholder="e.g. John Doe"
                      value={newRecruiter.name}
                      onChange={(e) => setNewRecruiter({ ...newRecruiter, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{linkMode ? "Recruiter Email" : "Email Address"}</label>
                  <input
                    type="email"
                    required
                    placeholder={linkMode ? "existing.recruiter@example.com" : "john@company.com"}
                    value={newRecruiter.email}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                  />
                  {linkMode && <p className="text-xs text-slate-500 mt-1">Enter the email of an already registered recruiter.</p>}
                </div>

                {/* PASSWORD FIELD (Only for Create New) */}
                {!linkMode && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                    <input
                      type="password"
                      required={!linkMode}
                      placeholder="••••••••"
                      value={newRecruiter.password}
                      onChange={(e) => setNewRecruiter({ ...newRecruiter, password: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    {modalLoading ? "Processing..." : linkMode ? "Link Recruiter" : "Create Recruiter"}
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

function StatItem({ icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50 ${color.split(' ')[0]}`}>
      <div className="bg-white p-1.5 rounded-lg shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold leading-none text-slate-800">{value}</p>
        <p className="text-xs opacity-70 mt-1 font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}
