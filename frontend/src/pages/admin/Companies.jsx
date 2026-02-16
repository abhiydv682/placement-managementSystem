import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* =========================
     FETCH COMPANIES
  ========================== */

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } =
        await axiosInstance.get(
          "/admin/companies"
        );
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
     OPEN CREATE
  ========================== */

  const openCreate = () => {
    setEditMode(false);
    setSelectedCompany(null);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setShowModal(true);
  };

  /* =========================
     OPEN EDIT
  ========================== */

  const openEdit = (company) => {
    setEditMode(true);
    setSelectedCompany(company);

    const recruiterEmail =
      company.recruiters?.[0]?.email || "";

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
      const { data } =
        await axiosInstance.post(
          "/admin/company",
          { name: formData.name }
        );

      const companyId =
        data.company?._id || data._id;

      await axiosInstance.post(
        "/admin/recruiter",
        {
          name:
            formData.name + " Recruiter",
          email: formData.email,
          password: formData.password,
          companyId,
        }
      );

      toast.success("Company Created 🎉");
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Error creating company"
      );
    }
  };

  /* =========================
     UPDATE COMPANY
  ========================== */

  const updateCompany = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(
        `/admin/company/${selectedCompany._id}`,
        {
          name: formData.name,
          email: formData.email,
        }
      );

      toast.success("Company updated");
      setShowModal(false);
      fetchCompanies();
    } catch {
      toast.error("Update failed");
    }
  };

  /* =========================
     DELETE COMPANY
  ========================== */

  const deleteCompany = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this company?"
      )
    )
      return;

    try {
      await axiosInstance.delete(
        `/admin/company/${id}`
      );
      toast.success("Company deleted");
      fetchCompanies();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold dark:text-white">
          Company Management
        </h2>

        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Add Company
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 dark:text-gray-300">
            No companies added yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <motion.div
              key={company._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer"
            >
              <div
                onClick={() =>
                  navigate(
                    `/admin/company/${company._id}`
                  )
                }
              >
                <h3 className="font-semibold text-indigo-600 dark:text-white">
                  {company.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {company.recruiters?.length > 0
                    ? company.recruiters
                        .map((r) => r.email)
                        .join(", ")
                    : "No Recruiter"}
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() =>
                    openEdit(company)
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteCompany(company._id)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
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
                {editMode
                  ? "Edit Company"
                  : "Create Company"}
              </h3>

              <form
                onSubmit={
                  editMode
                    ? updateCompany
                    : createCompany
                }
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Company Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mb-4 rounded-lg border dark:bg-slate-700 dark:text-white"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Recruiter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mb-4 rounded-lg border dark:bg-slate-700 dark:text-white"
                />

                {!editMode && (
                  <input
                    type="password"
                    name="password"
                    placeholder="Recruiter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 mb-6 rounded-lg border dark:bg-slate-700 dark:text-white"
                  />
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    {editMode
                      ? "Update"
                      : "Create"}
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
