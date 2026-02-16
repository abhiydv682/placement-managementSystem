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
//     }
//   };

//   return (
//     <Layout>
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-3xl mx-auto"
//       >
//         <form
//           onSubmit={submitHandler}
//           className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl space-y-5"
//         >
//           <h2 className="text-2xl font-bold text-indigo-600 dark:text-white">
//             Create New Drive
//           </h2>

//           {/* Company */}
//           <select
//             name="company"
//             value={form.company}
//             onChange={handleChange}
//             required
//             className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//           >
//             <option value="">Select Company *</option>
//             {companies.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>

//           {/* Job Role */}
//           <input
//             type="text"
//             name="jobRole"
//             value={form.jobRole}
//             onChange={handleChange}
//             placeholder="Job Role *"
//             required
//             className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//           />

//           {/* Description */}
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Description *"
//             rows="4"
//             required
//             className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//           />

//           {/* Qualification */}
//           <input
//             type="text"
//             name="qualification"
//             value={form.qualification}
//             onChange={handleChange}
//             placeholder="Required Qualification *"
//             required
//             className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//           />

//           {/* Grid Row */}
//           <div className="grid md:grid-cols-3 gap-4">
//             <input
//               type="number"
//               name="vacancies"
//               value={form.vacancies}
//               onChange={handleChange}
//               placeholder="Vacancies *"
//               required
//               className="p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//             />

//             <input
//               type="text"
//               name="location"
//               value={form.location}
//               onChange={handleChange}
//               placeholder="Location *"
//               required
//               className="p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//             />

//             <input
//               type="date"
//               name="deadline"
//               value={form.deadline}
//               onChange={handleChange}
//               required
//               className="p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//             />
//           </div>

//           {/* Package */}
//           <input
//             type="text"
//             name="package"
//             value={form.package}
//             onChange={handleChange}
//             placeholder="CTC (Optional)"
//             className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white"
//           />

//           {/* Submit */}
//           <button
//             disabled={loading}
//             className={`w-full py-3 rounded-xl text-white font-semibold transition ${
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
        className="max-w-4xl mx-auto px-4"
      >
        <form
          onSubmit={submitHandler}
          className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-white">
            Create New Drive
          </h2>

          {/* Company */}
          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              Company *
            </label>
            <select
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
            <label className="text-sm font-medium dark:text-gray-300">
              Job Role *
            </label>
            <input
              type="text"
              name="jobRole"
              value={form.jobRole}
              onChange={handleChange}
              placeholder="e.g. Backend Developer"
              required
              className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Drive details..."
              required
              className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              Qualification *
            </label>
            <input
              type="text"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="e.g. B.Tech / MCA"
              required
              className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              name="vacancies"
              value={form.vacancies}
              onChange={handleChange}
              placeholder="Vacancies *"
              required
              className="p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location *"
              required
              className="p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Package */}
          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              CTC (Optional)
            </label>
            <input
              type="text"
              name="package"
              value={form.package}
              onChange={handleChange}
              placeholder="e.g. 6 LPA"
              className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition transform ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? "Creating..." : "Create Drive"}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
}
