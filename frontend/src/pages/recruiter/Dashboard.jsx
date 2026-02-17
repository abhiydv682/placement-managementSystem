import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [drives, setDrives] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drivesRes, appsRes] = await Promise.all([
        axiosInstance.get("/recruiter/my-drives"),
        axiosInstance.get("/recruiter/recent-applications")
      ]);
      setDrives(drivesRes.data);
      setRecentApps(appsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Stats
  const totalDrives = drives.length;
  const activeDrives = drives.filter(d => d.isActive).length;
  const totalApplicants = drives.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your hiring drives and applicants</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Drives"
            value={totalDrives}
            color="bg-indigo-500"
            icon={<Briefcase className="text-white" size={24} />}
          />
          <StatCard
            title="Active Openings"
            value={activeDrives}
            color="bg-emerald-500"
            icon={<TrendingUp className="text-white" size={24} />}
          />
          <StatCard
            title="Total Applicants"
            value={totalApplicants}
            color="bg-purple-500"
            icon={<Users className="text-white" size={24} />}
          />
        </div>

        {/* ACTIVE DRIVES GRID */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Drives</h2>
          </div>

          {drives.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No drives assigned to you yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drives.map((drive, index) => (
                <motion.div
                  key={drive._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl">
                      <Briefcase className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${drive.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {drive.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{drive.jobRole}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Calendar size={14} />
                    <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Applied</p>
                      <p className="font-bold text-xl text-slate-900 dark:text-white">{drive.applicantCount}</p>
                    </div>

                    <Link
                      to={`/recruiter/drive/${drive._id}`}
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT APPLICATIONS */}
        {recentApps.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h2>
              <Link to="/recruiter/drives" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Drives</Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied For</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app) => (
                      <tr key={app._id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                              {app.student?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{app.student?.name}</p>
                              <p className="text-xs text-slate-500">{app.student?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{app.drive?.jobRole}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Clock size={14} />
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                                  'bg-indigo-50 text-indigo-700' // Applied
                            }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/recruiter/candidate/${app._id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
