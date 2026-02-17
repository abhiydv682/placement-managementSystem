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
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 pb-20">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your hiring drives and applicants</p>
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
            <h2 className="text-xl font-bold text-slate-900">Active Drives</h2>
          </div>

          {drives.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-300">
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
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                      <Briefcase className="text-indigo-600" size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${drive.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {drive.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{drive.jobRole}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Calendar size={14} />
                    <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applied</p>
                      <p className="font-extrabold text-2xl text-slate-900">{drive.applicantCount}</p>
                    </div>

                    <Link
                      to={`/recruiter/drive/${drive._id}`}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
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
              <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
              <Link to="/recruiter/drives" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Drives</Link>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Candidate</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied For</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app) => (
                      <tr key={app._id} className="border-b border-slate-50 last:border-0 hover:bg-indigo-50/30 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100 shadow-sm">
                              {app.student?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{app.student?.name}</p>
                              <p className="text-xs text-slate-500">{app.student?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-700 text-sm">{app.drive?.jobRole}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Clock size={14} className="text-slate-400" />
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                              app.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-indigo-50 text-indigo-700 border-indigo-100' // Applied
                            }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <Link
                            to={`/recruiter/candidate/${app._id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-400 transition-all shadow-sm"
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
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${color}`}></div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`${color} p-3 rounded-2xl shadow-md text-white transform group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
