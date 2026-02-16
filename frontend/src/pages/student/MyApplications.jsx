



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



import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import StatusBadge from "../../components/common/StatusBadge";
import RoundTimeline from "../../components/common/RoundTimeline";
import { motion } from "framer-motion";
import { CalendarDays, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

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
     CALCULATE PROGRESS
  ========================== */

  const getProgress = (rounds = []) => {
    if (!rounds.length) return 0;
    const cleared = rounds.filter(
      (r) => r.status === "Cleared"
    ).length;

    return Math.round((cleared / rounds.length) * 100);
  };

  /* =========================
     LOADING STATE
  ========================== */

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        My Applications
      </h2>

      {apps.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 dark:text-gray-400">
            You haven’t applied to any drives yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {apps.map((app, index) => {
            const progress = getProgress(app.rounds);

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                      <Briefcase size={16} />
                      {app.drive?.jobRole}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {app.company?.name}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <CalendarDays size={14} />
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <StatusBadge status={app.status} />
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
                    <span>Interview Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-2 rounded-full ${
                        progress === 100
                          ? "bg-green-500"
                          : "bg-indigo-600"
                      }`}
                    />
                  </div>
                </div>

                {/* ROUND TIMELINE */}
                {app.rounds?.length > 0 && (
                  <div className="mt-6">
                    <RoundTimeline rounds={app.rounds} />
                  </div>
                )}

                {/* FINAL STATUS BADGE */}
                {app.status === "Selected" && (
                  <div className="mt-4 text-sm font-semibold text-green-600">
                    🎉 Congratulations! You are selected.
                  </div>
                )}

                {app.status === "Rejected" && (
                  <div className="mt-4 text-sm font-semibold text-red-500">
                    ❌ Better luck next time.
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
