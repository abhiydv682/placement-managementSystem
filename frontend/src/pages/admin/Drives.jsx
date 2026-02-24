


// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import axiosInstance from "../../services/axiosInstance";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Plus, Edit, Trash, CalendarDays } from "lucide-react";

// export default function Drives() {
//   const [drives, setDrives] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   /* ==========================
//      FETCH DRIVES
//   ========================== */

//   const fetchDrives = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get("/drives/admin");
//       setDrives(data);
//     } catch (err) {
//       toast.error("Failed to load drives");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDrives();
//   }, []);

//   /* ==========================
//      DELETE DRIVE
//   ========================== */

//   const deleteDrive = async (id) => {
//     const confirm = window.confirm(
//       "Are you sure you want to delete this drive?"
//     );

//     if (!confirm) return;

//     try {
//       await axiosInstance.delete(`/drives/${id}`);
//       toast.success("Drive deleted successfully");
//       fetchDrives();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   /* ==========================
//      DEADLINE STATUS
//   ========================== */

//   const getDeadlineStatus = (deadline) => {
//     const today = new Date();
//     const date = new Date(deadline);

//     if (date < today) return "Expired";
//     return "Active";
//   };

//   return (
//     <Layout>
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
//         <h2 className="text-3xl font-bold dark:text-white">
//           Drive Management
//         </h2>

//         <button
//           onClick={() => navigate("/admin/drives/create")}
//           className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
//         >
//           <Plus size={18} />
//           Create Drive
//         </button>
//       </div>

//       {/* LOADER */}
//       {loading ? (
//         <div className="flex justify-center h-60 items-center">
//           <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
//         </div>
//       ) : drives.length === 0 ? (
//         <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
//           <p className="text-gray-500 dark:text-gray-400">
//             No drives created yet.
//           </p>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {drives.map((drive, index) => {
//             const status = getDeadlineStatus(drive.deadline);

//             return (
//               <motion.div
//                 key={drive._id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{ scale: 1.03 }}
//                 className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col justify-between"
//               >
//                 <div>
//                   <h3 className="text-lg font-semibold text-indigo-600 dark:text-white">
//                     {drive.jobRole}
//                   </h3>

//                   <p className="text-sm text-gray-500 mt-1">
//                     {drive.company?.name}
//                   </p>

//                   <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
//                     <CalendarDays size={14} />
//                     {new Date(drive.deadline).toLocaleDateString()}
//                   </div>

//                   <span
//                     className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
//                       status === "Expired"
//                         ? "bg-red-100 text-red-600"
//                         : "bg-green-100 text-green-600"
//                     }`}
//                   >
//                     {status}
//                   </span>
//                 </div>

//                 {/* ACTIONS */}
//                 <div className="flex justify-between mt-6 gap-3">
//                   <button
//                     onClick={() =>
//                       navigate(`/admin/drives/edit/${drive._id}`)
//                     }
//                     className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:scale-105 transition"
//                   >
//                     <Edit size={14} /> Edit
//                   </button>

//                   <button
//                     onClick={() => deleteDrive(drive._id)}
//                     className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:scale-105 transition"
//                   >
//                     <Trash size={14} /> Delete
//                   </button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </Layout>
//   );
// }


import { useEffect, useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash,
  CalendarDays,
  Search,
  Briefcase,
  MapPin,
  Users,
  Timer,
  Building2,
  Filter
} from "lucide-react";

export default function Drives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  /* ==============================
        FETCH DRIVES
  =============================== */

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/drives/admin");
      // Fix: extracted .drives from response
      setDrives(data.drives || []);
    } catch {
      toast.error("Failed to load drives");
      setDrives([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  /* ==============================
        DELETE DRIVE
  =============================== */

  const deleteDrive = async (id) => {
    if (!window.confirm("Delete this drive? This cannot be undone.")) return;

    try {
      await axiosInstance.delete(`/drives/${id}`);
      toast.success("Drive deleted successfully");
      fetchDrives();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ==============================
        STATUS
  =============================== */

  const getStatus = (deadline) => {
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < new Date() ? "Expired" : "Active";
  };

  /* ==============================
        COUNTDOWN
  =============================== */

  const getCountdown = (deadline) => {
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    const diff = deadlineDate.getTime() - new Date().getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  /* ==============================
        FILTER + SEARCH
  =============================== */

  const filteredDrives = useMemo(() => {
    return drives
      .filter((d) => {
        if (filter === "All") return true;
        return getStatus(d.deadline) === filter;
      })
      .filter((d) =>
        d.jobRole.toLowerCase().includes(search.toLowerCase()) ||
        d.company?.name?.toLowerCase().includes(search.toLowerCase())
      );
  }, [drives, filter, search]);

  /* ==============================
        STATS
  =============================== */

  const total = drives.length;
  const active = drives.filter((d) => getStatus(d.deadline) === "Active").length;
  const expired = total - active;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="md:text-3xl text-2xl font-extrabold text-slate-900 dark:text-gray-800 tracking-tight">
              Drive Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-sm sm:base">
              Create and manage placement drives for students
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/drives/create")}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all font-semibold w-full md:w-auto"
          >
            <Plus size={20} />
            Create Drive
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Drives" value={total} icon={<Briefcase size={24} />} color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
          <StatCard title="Active" value={active} icon={<CalendarDays size={24} />} color="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" />
          <StatCard title="Expired" value={expired} icon={<Timer size={24} />} color="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" />
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              placeholder="Search by role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 transition-all text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Expired"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${filter === status
                  ? "bg-slate-900 text-white shadow-md glow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* DRIVE LIST */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDrives.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700"
                >
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-full mb-6">
                    <Filter size={40} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">No drives found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                    Try adjusting your search filters or create a new drive.
                  </p>
                </motion.div>
              ) : (
                filteredDrives.map((drive, index) => {
                  const status = getStatus(drive.deadline);

                  return (
                    <motion.div
                      layout
                      key={drive._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* CARD HEADER */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <Building2 size={24} />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status === "Expired"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                            }`}>
                            {status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {drive.jobRole}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mb-6">
                          {drive.company?.name}
                        </p>

                        {/* META INFO */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <CalendarDays size={16} className="text-slate-400" />
                            <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Users size={16} className="text-slate-400" />
                            <span>Vacancies: {drive.vacancies}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <MapPin size={16} className="text-slate-400" />
                            <span>{drive.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                        <button
                          onClick={() => navigate(`/admin/drives/edit/${drive._id}`)}
                          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition"
                        >
                          <Edit size={16} /> Edit
                        </button>

                        <button
                          onClick={() => deleteDrive(drive._id)}
                          className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-semibold transition"
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}
