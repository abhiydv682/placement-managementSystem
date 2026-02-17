import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import StatusBadge from "../../components/common/StatusBadge";
import { motion } from "framer-motion";
import StudentAnalytics from "../student/StudentAnalytics";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  UserCheck,
  CalendarDays
} from "lucide-react";

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: appData } = await axiosInstance.get("/applications/my");
        const { data: userData } = await axiosInstance.get("/auth/me");
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
  const selected = apps.filter((app) => app.status === "Selected").length;
  const rejected = apps.filter((app) => app.status === "Rejected").length;
  const inProgress = total - selected - rejected;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Hello, {profile?.name.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <CalendarDays size={16} />
              {currentDate}
            </p>
          </div>

          {/* PROFILE COMPLETION WIDGET */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 min-w-[280px]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="transform -rotate-90 w-12 h-12">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - profileCompletion / 100)}
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-bold text-indigo-600 dark:text-indigo-400">{profileCompletion}%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Profile Completion</p>
              <p className="text-xs text-slate-500">Complete your profile to apply</p>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={total}
            color="bg-indigo-500"
            icon={<Briefcase className="text-white" size={24} />}
          />
          <StatCard
            title="In Progress"
            value={inProgress}
            color="bg-amber-500"
            icon={<Clock className="text-white" size={24} />}
          />
          <StatCard
            title="Selected"
            value={selected}
            color="bg-emerald-500"
            icon={<CheckCircle className="text-white" size={24} />}
          />
          <StatCard
            title="Rejected"
            value={rejected}
            color="bg-red-500"
            icon={<XCircle className="text-white" size={24} />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* RECENT APPLICATIONS LIST */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
            </div>

            {apps.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Briefcase size={48} className="mx-auto mb-3 opacity-20" />
                <p>You haven't applied to any drives yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {apps.slice(0, 5).map((app, index) => (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shadow-sm">
                        {app.company?.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {app.drive?.jobRole}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{app.company?.name}</p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ANALYTICS CHART */}
          <div className="h-full">
            <StudentAnalytics apps={apps} />
          </div>
        </div>

      </div>
    </Layout>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${color}`}></div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`${color} p-3 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
