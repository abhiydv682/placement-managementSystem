// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import axiosInstance from "../../services/axiosInstance";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";

// export default function CreateDrive() {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     company: "",
//     jobRole: "",
//     description: "",
//     qualification: "",
//     vacancies: "",
//     location: "",
//     package: "",
//     deadline: "",
//   });

//   /* ============================= */
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const { data } = await axiosInstance.get("/admin/companies");
//         setCompanies(data);
//       } catch {
//         toast.error("Failed to load companies");
//       }
//     };

//     fetchCompanies();
//   }, []);

//   /* ============================= */
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   /* ============================= */
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (
//       !form.company ||
//       !form.jobRole ||
//       !form.description ||
//       !form.qualification ||
//       !form.vacancies ||
//       !form.location ||
//       !form.deadline
//     ) {
//       return toast.error("Please fill all required fields");
//     }

//     try {
//       setLoading(true);

//       await axiosInstance.post("/drives", form);

//       toast.success("Drive Created Successfully 🚀");

//       setForm({
//         company: "",
//         jobRole: "",
//         description: "",
//         qualification: "",
//         vacancies: "",
//         location: "",
//         package: "",
//         deadline: "",
//       });

//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Drive creation failed"
//       );
//     } finally {
//       setLoading(false);
//               loading
//                 ? "bg-indigo-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:scale-105"
//             }`}
//           >
//             {loading ? "Creating..." : "Create Drive"}
//           </button>
//         </form>
//       </motion.div>
//     </Layout>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CreateDrive() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company: "",
    jobRole: "",
    description: "",
    qualification: "",
    vacancies: "",
    location: "",
    package: "",
    deadline: "",
  });

  /* =============================
        FETCH COMPANIES
  ============================== */

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/companies");
        setCompanies(data);
      } catch {
        toast.error("Failed to load companies");
      }
    };

    fetchCompanies();
  }, []);

  /* =============================
        HANDLE INPUT
  ============================== */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =============================
        VALIDATION
  ============================== */

  const validateForm = () => {
    const {
      company,
      jobRole,
      description,
      qualification,
      vacancies,
      location,
      deadline,
    } = form;

    if (
      !company ||
      !jobRole ||
      !description ||
      !qualification ||
      !vacancies ||
      !location ||
      !deadline
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (Number(vacancies) <= 0) {
      toast.error("Vacancies must be greater than 0");
      return false;
    }

    if (new Date(deadline) < new Date()) {
      toast.error("Deadline cannot be in the past");
      return false;
    }

    return true;
  };

  /* =============================
        SUBMIT
  ============================== */

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await axiosInstance.post("/drives", {
        ...form,
        vacancies: Number(form.vacancies),
      });

      toast.success("Drive Created Successfully 🚀");

      // 🔥 Redirect to Drive List
      navigate("/admin/drives");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Drive creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 py-10"
      >
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-3xl shadow-xl space-y-6 border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Create New Drive
            </h2>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Company *
            </label>
            <select
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Job Role *
            </label>
            <input
              type="text"
              name="jobRole"
              value={form.jobRole}
              onChange={handleChange}
              placeholder="e.g. Backend Developer"
              required
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Drive details..."
              required
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Qualification *
            </label>
            <input
              type="text"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="e.g. B.Tech / MCA"
              required
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Vacancies *
              </label>
              <input
                type="number"
                name="vacancies"
                value={form.vacancies}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                required
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              CTC (Optional)
            </label>
            <input
              type="text"
              name="package"
              value={form.package}
              onChange={handleChange}
              placeholder="e.g. 6 LPA"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform ${loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:scale-[1.02] hover:shadow-indigo-300"
              }`}
          >
            {loading ? "Creating Drive..." : "Create Drive"}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
}
