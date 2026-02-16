


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
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash,
  CalendarDays,
  Search,
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
      setDrives(data);
    } catch {
      toast.error("Failed to load drives");
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
    if (!window.confirm("Delete this drive?")) return;

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
    return new Date(deadline) < new Date()
      ? "Expired"
      : "Active";
  };

  /* ==============================
        COUNTDOWN
  =============================== */

  const getCountdown = (deadline) => {
    const diff =
      new Date(deadline).getTime() -
      new Date().getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );

    return `${days}d ${hours}h left`;
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
        d.jobRole
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [drives, filter, search]);

  /* ==============================
        STATS
  =============================== */

  const total = drives.length;
  const active = drives.filter(
    (d) => getStatus(d.deadline) === "Active"
  ).length;
  const expired = total - active;

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-3xl font-bold dark:text-white">
            Drive Management
          </h2>

          <button
            onClick={() =>
              navigate("/admin/drives/create")
            }
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            <Plus size={18} />
            Create Drive
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Total" value={total} />
          <StatCard
            title="Active"
            value={active}
            color="text-green-600"
          />
          <StatCard
            title="Expired"
            value={expired}
            color="text-red-600"
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search by job role..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 p-3 rounded-xl border dark:bg-slate-800 dark:text-white"
            />
          </div>

          {["All", "Active", "Expired"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  filter === status
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-slate-700 dark:text-white"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center h-60 items-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      ) : filteredDrives.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500">
            No drives found.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive, index) => {
            const status = getStatus(drive.deadline);

            return (
              <motion.div
                key={drive._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-white">
                    {drive.jobRole}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {drive.company?.name}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <CalendarDays size={14} />
                    {new Date(
                      drive.deadline
                    ).toLocaleDateString()}
                  </div>

                  {/* Countdown */}
                  <p className="text-xs mt-2 text-indigo-600">
                    {getCountdown(drive.deadline)}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "Expired"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between mt-6 gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/drives/edit/${drive._id}`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:scale-105 transition"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteDrive(drive._id)
                    }
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:scale-105 transition"
                  >
                    <Trash size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

/* ==============================
   MINI STAT CARD
============================== */

function StatCard({
  title,
  value,
  color = "text-indigo-600",
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow text-center">
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
      <p className="text-sm text-gray-500">
        {title}
      </p>
    </div>
  );
}
