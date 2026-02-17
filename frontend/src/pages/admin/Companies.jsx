import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Building2,
  Users,
  Search,
  Plus,
  Edit,
  Trash,
  Mail,
  MoreVertical,
  X
} from "lucide-react";

export default function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "", // Recruiter Email
    password: "", // Recruiter Password (only for create)
  });

  /* =========================
     FETCH COMPANIES
  ========================== */

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/companies");
      setCompanies(data);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HANDLE INPUT
  ========================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     MODAL CONTROLS
  ========================== */

  const openCreate = () => {
    setEditMode(false);
    setSelectedCompany(null);
    setFormData({ name: "", email: "", password: "" });
    setShowModal(true);
  };

  const openEdit = (company, e) => {
    e.stopPropagation();
    setEditMode(true);
    setSelectedCompany(company);

    const recruiterEmail = company.recruiters?.[0]?.email || "";

    setFormData({
      name: company.name,
      email: recruiterEmail,
      password: "",
    });

    setShowModal(true);
  };

  /* =========================
     CREATE COMPANY
  ========================== */

  const createCompany = async (e) => {
    e.preventDefault();

    try {
      setModalLoading(true);

      // 1. Create Company
      const { data } = await axiosInstance.post("/admin/company", {
        name: formData.name
      });

      const companyId = data.company?._id || data._id;

      // 2. Create Recruiter
      await axiosInstance.post("/admin/recruiter", {
        name: formData.name + " Recruiter",
        email: formData.email,
        password: formData.password,
        companyId,
      });

      toast.success("Company & Recruiter Created 🎉");
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating company");
    } finally {
      setModalLoading(false);
    }
  };

  /* =========================
     UPDATE COMPANY
  ========================== */

  const updateCompany = async (e) => {
    e.preventDefault();

    try {
      setModalLoading(true);
      await axiosInstance.put(`/admin/company/${selectedCompany._id}`, {
        name: formData.name,
        email: formData.email,
      });

      toast.success("Company updated successfully");
      setShowModal(false);
      fetchCompanies();
    } catch {
      toast.error("Update failed");
    } finally {
      setModalLoading(false);
    }
  };

  /* =========================
     DELETE COMPANY
  ========================== */

  const deleteCompany = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure? This will delete all associated drives and applications.")) return;

    try {
      await axiosInstance.delete(`/admin/company/${id}`);
      toast.success("Company deleted");
      fetchCompanies();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     FILTERING & STATS
  ========================== */

  const filteredCompanies = useMemo(() => {
    return companies.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.recruiters?.[0]?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  const totalCompanies = companies.length;
  const totalRecruiters = companies.reduce((acc, c) => acc + (c.recruiters?.length || 0), 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="md:text-3xl text-2xl font-extrabold text-slate-900 dark:text-gray-800 tracking-tight">
              Company Management
            </h1>
            <p className="text-slate-700 dark:text-slate-500 mt-2">
              Manage partnering companies and their recruiters
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all font-semibold"
          >
            <Plus size={20} />
            Add Company
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Companies" value={totalCompanies} icon={<Building2 size={24} />} color="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" />
          <StatCard title="Total Recruiters" value={totalRecruiters} icon={<Users size={24} />} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" />
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            placeholder="Search companies or recruiters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-sm outline-none text-slate-700 transition-all focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* COMPANY GRID */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCompanies.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-400">
                  <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No companies found matching your search.</p>
                </div>
              ) : (
                filteredCompanies.map((company, index) => (
                  <motion.div
                    layout
                    key={company._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/admin/company/${company._id}`)}
                    className="group bg-white p-6 rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => openEdit(company, e)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 hover:text-indigo-600 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => deleteCompany(company._id, e)}
                          className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-600 hover:text-red-700 transition"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <Building2 size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                          <Users size={14} />
                          <span>{company.recruiters?.length} Recruiters</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Primary Contact</p>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={16} className="text-indigo-500" />
                        <span className="truncate">
                          {company.recruiters?.[0]?.email || "No recruiter assigned"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                {editMode ? "Edit Company" : "New Company"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                {editMode ? "Update company details" : "Add a new partner company"}
              </p>

              <form onSubmit={editMode ? updateCompany : createCompany} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Google"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Recruiter Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="recruiter@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                  />
                </div>

                {!editMode && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Initial Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  {modalLoading ? "Processing..." : (editMode ? "Save Changes" : "Create Company")}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}
