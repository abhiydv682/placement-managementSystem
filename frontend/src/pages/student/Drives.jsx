import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Search } from "lucide-react";

export default function Drives() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  /* =========================
     FETCH DATA
  ========================== */

  const fetchData = async () => {
    try {
      setLoading(true);

      const driveRes = await axiosInstance.get("/drives/active");
      const appRes = await axiosInstance.get("/applications/my");

      const driveData = Array.isArray(driveRes.data)
        ? driveRes.data
        : driveRes.data?.drives || [];

      const appData = Array.isArray(appRes.data)
        ? appRes.data
        : appRes.data?.applications || [];

      setDrives(driveData);
      setApplications(appData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     SEARCH FILTER
  ========================== */

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) =>
      drive.jobRole
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [drives, search]);

  /* =========================
     CHECK IF APPLIED
  ========================== */

  const hasApplied = (driveId) =>
    applications.some(
      (a) =>
        a.drive?._id === driveId ||
        a.drive === driveId
    );

  /* =========================
     DEADLINE
  ========================== */

  const getDaysLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

    return `${days} day${days > 1 ? "s" : ""} left`;
  };

  /* =========================
     APPLY FUNCTION
  ========================== */

  const applyDrive = async (e, driveId) => {
    e.stopPropagation(); // 🔥 IMPORTANT → prevent card click

    try {
      setApplyingId(driveId);

      await axiosInstance.post(
        `/applications/${driveId}`
      );

      toast.success("Applied Successfully 🎉");
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Already Applied"
      );
    } finally {
      setApplyingId(null);
    }
  };

  /* =========================
     LOADING
  ========================== */

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold dark:text-white">
          🚀 Available Drives
        </h2>

        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search job role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {filteredDrives.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500">
            No drives found.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive, index) => {
            const expired =
              getDaysLeft(drive.deadline) === "Expired";

            return (
              <motion.div
                key={drive._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                onClick={() =>
                  navigate(`/student/drives/${drive._id}`)
                } // 🔥 CARD CLICK NAVIGATION
                className="cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-white">
                    {drive.jobRole}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {drive.company?.name}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <MapPin size={14} />
                    {drive.location || "Not specified"}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <CalendarDays size={14} />
                    {new Date(
                      drive.deadline
                    ).toLocaleDateString()}
                  </div>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-semibold ${
                      expired
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {getDaysLeft(drive.deadline)}
                  </span>
                </div>

                {/* APPLY BUTTON */}
                <button
                  disabled={
                    hasApplied(drive._id) ||
                    expired ||
                    applyingId === drive._id
                  }
                  onClick={(e) =>
                    applyDrive(e, drive._id)
                  }
                  className={`mt-6 w-full py-2 rounded-lg font-semibold transition ${
                    hasApplied(drive._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : expired
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:scale-105 text-white"
                  }`}
                >
                  {applyingId === drive._id
                    ? "Applying..."
                    : hasApplied(drive._id)
                    ? "Already Applied"
                    : expired
                    ? "Expired"
                    : "Apply Now"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}


// import { useEffect, useState, useMemo } from "react";
// import Layout from "../../components/layout/Layout";
// import axiosInstance from "../../services/axiosInstance";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";
// import { CalendarDays, MapPin, Search } from "lucide-react";

// export default function Drives() {
//   const [drives, setDrives] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [applyingId, setApplyingId] = useState(null);
//   const [search, setSearch] = useState("");

//   /* =========================
//      FETCH DRIVES + APPLICATIONS
//   ========================== */

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const driveRes = await axiosInstance.get("/drives/active");
//       const appRes = await axiosInstance.get("/applications/my");

//       // 🔥 Safe Handling
//       const driveData = Array.isArray(driveRes.data)
//         ? driveRes.data
//         : driveRes.data?.drives || [];

//       const appData = Array.isArray(appRes.data)
//         ? appRes.data
//         : appRes.data?.applications || [];

//       setDrives(driveData);
//       setApplications(appData);

//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load drives");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   /* =========================
//      FILTER SEARCH
//   ========================== */

//   const filteredDrives = useMemo(() => {
//     return drives.filter((drive) =>
//       drive.jobRole
//         ?.toLowerCase()
//         .includes(search.toLowerCase())
//     );
//   }, [drives, search]);

//   /* =========================
//      CHECK IF APPLIED
//   ========================== */

//   const hasApplied = (driveId) =>
//     applications.some(
//       (a) =>
//         a.drive?._id === driveId ||
//         a.drive === driveId
//     );

//   /* =========================
//      DEADLINE COUNTDOWN
//   ========================== */

//   const getDaysLeft = (deadline) => {
//     const now = new Date();
//     const end = new Date(deadline);
//     const diff = end - now;

//     if (diff <= 0) return "Expired";

//     const days = Math.ceil(
//       diff / (1000 * 60 * 60 * 24)
//     );

//     return `${days} day${days > 1 ? "s" : ""} left`;
//   };

//   /* =========================
//      APPLY
//   ========================== */

//   const applyDrive = async (driveId) => {
//     try {
//       setApplyingId(driveId);

//       await axiosInstance.post(
//         `/applications/${driveId}`
//       );

//       toast.success("Applied Successfully 🎉");

//       fetchData(); // refresh
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           "Already Applied"
//       );
//     } finally {
//       setApplyingId(null);
//     }
//   };

//   /* =========================
//      LOADER
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
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
//         <h2 className="text-2xl font-bold dark:text-white">
//           🚀 Available Drives
//         </h2>

//         {/* SEARCH */}
//         <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow">
//           <Search size={16} />
//           <input
//             type="text"
//             placeholder="Search job role..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             className="bg-transparent outline-none text-sm"
//           />
//         </div>
//       </div>

//       {filteredDrives.length === 0 ? (
//         <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
//           <p className="text-gray-500">
//             No drives found.
//           </p>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredDrives.map(
//             (drive, index) => {
//               const expired =
//                 getDaysLeft(
//                   drive.deadline
//                 ) === "Expired";

//               return (
//                 <motion.div
//                   key={drive._id}
//                   initial={{
//                     opacity: 0,
//                     y: 30,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     delay: index * 0.05,
//                   }}
//                   whileHover={{
//                     scale: 1.03,
//                   }}
//                   className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col justify-between"
//                 >
//                   {/* DRIVE INFO */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-indigo-600 dark:text-white">
//                       {drive.jobRole}
//                     </h3>

//                     <p className="text-sm text-gray-500 mt-1">
//                       {drive.company?.name}
//                     </p>

//                     <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
//                       <MapPin size={14} />
//                       {drive.location ||
//                         "Not specified"}
//                     </div>

//                     <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
//                       <CalendarDays size={14} />
//                       {new Date(
//                         drive.deadline
//                       ).toLocaleDateString()}
//                     </div>

//                     <span
//                       className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-semibold ${
//                         expired
//                           ? "bg-red-100 text-red-600"
//                           : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {getDaysLeft(
//                         drive.deadline
//                       )}
//                     </span>
//                   </div>

//                   {/* APPLY BUTTON */}
//                   <button
//                     disabled={
//                       hasApplied(
//                         drive._id
//                       ) ||
//                       expired ||
//                       applyingId ===
//                         drive._id
//                     }
//                     onClick={() =>
//                       applyDrive(
//                         drive._id
//                       )
//                     }
//                     className={`mt-6 w-full py-2 rounded-lg font-semibold transition ${
//                       hasApplied(
//                         drive._id
//                       )
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : expired
//                         ? "bg-red-400 cursor-not-allowed"
//                         : "bg-indigo-600 hover:scale-105 text-white"
//                     }`}
//                   >
//                     {applyingId ===
//                     drive._id
//                       ? "Applying..."
//                       : hasApplied(
//                           drive._id
//                         )
//                       ? "Already Applied"
//                       : expired
//                       ? "Expired"
//                       : "Apply Now"}
//                   </button>
//                 </motion.div>
//               );
//             }
//           )}
//         </div>
//       )}
//     </Layout>
//   );
// }
