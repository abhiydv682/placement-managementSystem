import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminStats from "../../components/dashboard/AdminStats";
import axiosInstance from "../../services/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Filter, Download, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalDrives: 0,
    totalApplications: 0,
    selectedCount: 0,
    rejectedCount: 0,
    recentDrives: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/dashboard");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Prepare Chart Data
  const chartData = [
    { name: 'Applications', count: stats.totalApplications || 0, fill: '#8a6144' }, // Bronze
    { name: 'Selected', count: stats.selectedCount || 0, fill: '#10b981' }, // Emerald
    { name: 'Rejected', count: stats.rejectedCount || 0, fill: '#ef4444' }, // Red
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
            <p className="text-slate-700">Welcome back, here's what's happening at Avani Enterprise today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap">
              <Calendar size={16} /> Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-md shadow-indigo-600/20 whitespace-nowrap">
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <AdminStats title="Total Students" value={stats.totalStudents} />
          <AdminStats title="Total Companies" value={stats.totalCompanies} />
          <AdminStats title="Total Drives" value={stats.totalDrives} />
          <AdminStats title="Total Applications" value={stats.totalApplications} />
          <AdminStats title="Selected" value={stats.selectedCount} />
          <AdminStats title="Rejected" value={stats.rejectedCount} />
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Analytics Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Recruitment Funnel</h2>
              <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <Filter size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Recent Drives (Activity) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Recent Drives</h2>
              <Link to="/admin/drives" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '300px' }}>
              {stats.recentDrives?.map((drive) => (
                <div key={drive._id} className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                      {drive.company?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{drive.company?.name || "Unknown Company"}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase size={12} className="text-slate-400" />
                        <p className="text-xs font-medium text-slate-500">{drive.jobRole}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const deadlineDate = new Date(drive.deadline);
                      const today = new Date();

                      // Reset time to midnight for accurate date comparison
                      deadlineDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);

                      // If deadline is today or in the future -> Live
                      const isLive = deadlineDate >= today;

                      return (
                        <>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isLive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            {isLive ? 'Live' : 'Expired'}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">
                            {isLive
                              ? `Ends in ${Math.ceil((new Date(drive.deadline).setHours(23, 59, 59, 999) - new Date()) / (1000 * 60 * 60 * 24))} days`
                              : `Ended on ${new Date(drive.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}
              {(!stats.recentDrives || stats.recentDrives.length === 0) && (
                <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Briefcase className="text-slate-300" size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No recent activity</p>
                </div>
              )}
            </div>

            <Link
              to="/admin/drives"
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium rounded-xl transition-colors text-sm group"
            >
              View All Drives
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
