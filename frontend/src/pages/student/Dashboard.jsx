import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import StatusBadge from "../../components/common/StatusBadge";
import { motion } from "framer-motion";
import StudentAnalytics from "../student/StudentAnalytics"

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: appData } =
          await axiosInstance.get("/applications/my");

        const { data: userData } =
          await axiosInstance.get("/auth/me");

        setApps(appData);
        setProfile(userData.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ======================
     PROFILE COMPLETION %
  ======================= */

  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    const fields = [
      profile.phone,
      profile.course,
      profile.college,
      profile.skills?.length > 0,
      profile.resume?.secure_url,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  /* ======================
     STATS
  ======================= */

  const total = apps.length;
  const selected = apps.filter(
    (app) => app.status === "Selected"
  ).length;
  const rejected = apps.filter(
    (app) => app.status === "Rejected"
  ).length;
  const inProgress = total - selected - rejected;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        Student Dashboard
      </h2>

      {/* Profile Completion */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold dark:text-white">
            Profile Completion
          </h3>
          <span className="text-indigo-600 font-bold">
            {profileCompletion}%
          </span>
        </div>

        <div className="bg-gray-200 dark:bg-slate-700 h-3 rounded-full">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {[
          { title: "Total Applied", value: total, color: "text-indigo-600" },
          { title: "In Progress", value: inProgress, color: "text-yellow-500" },
          { title: "Selected", value: selected, color: "text-green-500" },
          { title: "Rejected", value: rejected, color: "text-red-500" },
        ].map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md"
          >
            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
              {card.title}
            </h3>
            <p
              className={`text-2xl font-bold mt-2 ${card.color}`}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Pie Chart */}
      <div className="mb-10">
        <StudentAnalytics apps={apps} />
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-6 dark:text-white">
          Recent Applications
        </h3>

        {apps.length === 0 ? (
          <p className="text-gray-500">
            You haven’t applied to any drives yet.
          </p>
        ) : (
          <div className="space-y-4">
            {apps.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <h4 className="font-semibold text-indigo-700 dark:text-white">
                    {app.drive?.jobRole}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {app.company?.name}
                  </p>
                </div>

                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
