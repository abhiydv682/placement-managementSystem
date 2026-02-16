



// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import axiosInstance from "../../services/axiosInstance";
// import StatusBadge from "../../components/common/StatusBadge";
// import RoundTimeline from "../../components/common/RoundTimeline";
// import { motion } from "framer-motion";
// import { CalendarDays, Briefcase } from "lucide-react";

// export default function MyApplications() {
//   const [apps, setApps] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      FETCH APPLICATIONS
//   ========================== */

//   useEffect(() => {
//     const fetchApps = async () => {
//       try {
//         const { data } = await axiosInstance.get("/applications/my");
//         setApps(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApps();
//   }, []);

//   /* =========================
//      CALCULATE PROGRESS
//   ========================== */

//   const getProgress = (rounds = []) => {
//     if (!rounds.length) return 0;

//     const cleared = rounds.filter(
//       (r) => r.status === "Cleared"
//     ).length;

//     return Math.round((cleared / rounds.length) * 100);
//   };

//   /* =========================
//      LOADING
//   ========================== */

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-60">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <h2 className="text-2xl font-bold mb-8 dark:text-white">
//         My Applications
//       </h2>

//       {apps.length === 0 ? (
//         <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
//           <p className="text-gray-500 dark:text-gray-400">
//             You haven’t applied to any drives yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {apps.map((app, index) => {
//             const progress = getProgress(app.rounds);

//             return (
//               <motion.div
//                 key={app._id}
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition"
//               >
//                 {/* HEADER */}
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//                   <div>
//                     <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
//                       <Briefcase size={16} />
//                       {app.drive?.jobRole}
//                     </h3>

//                     <p className="text-sm text-gray-500 mt-1">
//                       {app.company?.name}
//                     </p>

//                     {app.drive?.deadline && (
//                       <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
//                         <CalendarDays size={14} />
//                         Deadline:{" "}
//                         {new Date(
//                           app.drive.deadline
//                         ).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>

//                   <StatusBadge status={app.status} />
//                 </div>

//                 {/* PROGRESS BAR */}
//                 <div className="mt-6">
//                   <div className="w-full bg-gray-200 dark:bg-slate-700 h-3 rounded-full">
//                     <div
//                       className={`h-3 rounded-full transition-all duration-500 ${
//                         app.status === "Rejected"
//                           ? "bg-red-500"
//                           : app.status === "Selected"
//                           ? "bg-green-500"
//                           : "bg-indigo-600"
//                       }`}
//                       style={{ width: `${progress}%` }}
//                     ></div>
//                   </div>

//                   <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
//                     <span>Interview Progress</span>
//                     <span>{progress}%</span>
//                   </div>
//                 </div>

//                 {/* INTERVIEW ROUNDS */}
//                 {app.rounds?.length > 0 && (
//                   <div className="mt-6">
//                     <RoundTimeline rounds={app.rounds} />
//                   </div>
//                 )}
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
import StatusBadge from "../../components/common/StatusBadge";
import RoundTimeline from "../../components/common/RoundTimeline";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Briefcase,
  Building2,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  /* =========================
     FETCH APPLICATIONS
  ========================== */

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await axiosInstance.get("/applications/my");
        setApps(data);
      } catch (err) {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  /* =========================
     FILTER LOGIC
  ========================== */

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch =
        app.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.drive?.jobRole?.toLowerCase().includes(search.toLowerCase());

      if (activeTab === "All") return matchesSearch;
      if (activeTab === "Selected") return matchesSearch && app.status === "Selected";
      if (activeTab === "Rejected") return matchesSearch && app.status === "Rejected";
      if (activeTab === "Ongoing") return matchesSearch && !["Selected", "Rejected"].includes(app.status);

      return matchesSearch;
    });
  }, [apps, search, activeTab]);

  /* =========================
     HELPER FUNCTIONS
  ========================== */

  const getProgress = (status, rounds = []) => {
    if (status === "Selected") return 100;
    if (status === "Rejected" && !rounds.length) return 0;
    if (!rounds.length) return 0;

    const cleared = rounds.filter(
      (r) => r.status === "Cleared"
    ).length;

    return Math.round((cleared / rounds.length) * 100);
  };

  /* =========================
     RENDER
  ========================== */

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: "All", label: "All Applications" },
    { id: "Ongoing", label: "Ongoing" },
    { id: "Selected", label: "Selected" },
    { id: "Rejected", label: "Rejected" },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Applications
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Track your placement journey and interview progress
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white w-full md:w-80 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none translate-y-[-2px]"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* APPLICATIONS LIST */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredApps.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700"
              >
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-full mb-6">
                  <Filter size={40} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No applications found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                  Try adjusting your search or filters, or explore new drives to apply properly.
                </p>
              </motion.div>
            ) : (
              filteredApps.map((app, index) => {
                const progress = getProgress(app.status, app.rounds);

                return (
                  <motion.div
                    layout
                    key={app._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700/50 transition-all duration-300"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                          <Building2 size={28} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            {app.drive?.jobRole}
                          </h3>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {app.company?.name}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* DETAILS GRID */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CalendarDays size={12} /> Applied On
                        </p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {new Date(app.createdAt).toLocaleDateString(undefined, {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Clock size={12} /> Last Update
                        </p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {new Date(app.updatedAt).toLocaleDateString(undefined, {
                            month: "short", day: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={progress === 100 ? "text-green-600" : "text-indigo-600"}>
                          Interview Progress
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">{progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${app.status === "Rejected" ? "bg-red-500" :
                            app.status === "Selected" ? "bg-green-500" :
                              "bg-gradient-to-r from-indigo-500 to-purple-500"
                            }`}
                        />
                      </div>
                    </div>

                    {/* ROUND TIMELINE */}
                    {app.rounds?.length > 0 && (
                      <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-6">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-800 dark:text-white">
                          <Clock size={16} className="text-indigo-500" /> Interview Rounds
                        </div>
                        <RoundTimeline rounds={app.rounds} />
                      </div>
                    )}

                    {/* RESULT MESSAGE */}
                    <AnimatePresence>
                      {app.status === "Selected" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400 font-bold text-sm"
                        >
                          <CheckCircle2 size={20} className="shrink-0" />
                          Congratulations! You have been selected!
                        </motion.div>
                      )}

                      {app.status === "Rejected" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 font-bold text-sm"
                        >
                          <XCircle size={20} className="shrink-0" />
                          Application request was not successful.
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
