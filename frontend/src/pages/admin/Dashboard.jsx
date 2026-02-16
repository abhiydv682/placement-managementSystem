// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { 
//   Users, 
//   Building2, 
//   Briefcase, 
//   FileCheck, 
//   TrendingUp,
//   AlertCircle 
// } from 'lucide-react';
// import { toast } from 'react-toastify';

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     totalCompanies: 0,
//     totalDrives: 0,
//     totalApplications: 0,
//     statusBreakup: []
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         // Admin stats API call
//         const res = await axios.get('http://localhost:5000/api/admin/stats', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setStats(res.data);
//       } catch (err) {
//         toast.error("Dashboard stats load karne mein dikkat aayi");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header Section */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Placement Overview</h1>
//         <p className="text-gray-500 text-sm mt-1">Welcome to Avani Enterprises Super Admin Panel</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           title="Total Students" 
//           value={stats.totalStudents} 
//           icon={<Users className="text-blue-600" />} 
//           bg="bg-blue-50"
//         />
//         <StatCard 
//           title="Total Companies" 
//           value={stats.totalCompanies} 
//           icon={<Building2 className="text-green-600" />} 
//           bg="bg-green-50"
//         />
//         <StatCard 
//           title="Active Drives" 
//           value={stats.totalDrives} 
//           icon={<Briefcase className="text-purple-600" />} 
//           bg="bg-purple-50"
//         />
//         <StatCard 
//           title="Applications" 
//           value={stats.totalApplications} 
//           icon={<FileCheck className="text-orange-600" />} 
//           bg="bg-orange-50"
//         />
//       </div>

//       {/* Detailed Status Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Selection Status List */}
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//               <TrendingUp size={20} className="text-blue-600" />
//               Application Status Breakup
//             </h2>
//           </div>
//           <div className="space-y-4">
//             {stats.statusBreakup.length > 0 ? (
//               stats.statusBreakup.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                   <span className="font-medium text-gray-700">{item._id || "Pending"}</span>
//                   <span className="bg-white px-4 py-1 rounded-full text-blue-700 font-bold border border-blue-100 shadow-sm">
//                     {item.count}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-10 text-gray-400">
//                 <AlertCircle className="mx-auto mb-2" />
//                 <p>No application data available yet.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h2>
//           <div className="space-y-3">
//             <ActionButton label="Create New Job Drive" color="bg-blue-600" />
//             <ActionButton label="Register New Company" color="bg-gray-800" />
//             <ActionButton label="Generate Placement Report" color="bg-green-600" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Stat Card
// const StatCard = ({ title, value, icon, bg }) => (
//   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//     <div>
//       <p className="text-sm font-medium text-gray-500">{title}</p>
//       <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
//     </div>
//     <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center`}>
//       {icon}
//     </div>
//   </div>
// );

// // Reusable Action Button
// const ActionButton = ({ label, color }) => (
//   <button className={`w-full py-3 px-4 ${color} text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-sm`}>
//     {label}
//   </button>
// );

// export default Dashboard;



import Layout from "../../components/layout/Layout";
import AdminStats from "../../components/dashboard/AdminStats";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axiosInstance.get("/admin/dashboard");
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStats title="Total Students" value={stats.totalStudents} />
        <AdminStats title="Total Companies" value={stats.totalCompanies} />
        <AdminStats title="Total Drives" value={stats.totalDrives} />
        <AdminStats title="Total Applications" value={stats.totalApplications} />
        <AdminStats title="Selected" value={stats.selectedCount} />
        <AdminStats title="Rejected" value={stats.rejectedCount} />
      </div>
    </Layout>
  );
}
