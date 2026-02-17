import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { Link } from "react-router-dom";
import { Briefcase, Calendar, ChevronRight, Users, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function MyDrives() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const { data } = await axiosInstance.get("/recruiter/my-drives");
            setDrives(data);
        } catch (error) {
            console.error("Error fetching drives:", error);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Drives</h1>
                        <p className="text-slate-500 mt-1">Manage your active job postings and applications</p>
                    </div>

                    <Link
                        to="/recruiter/create-drive"
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        + Create New Drive
                    </Link>
                </div>

                {/* DRIVES GRID */}
                {drives.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No drives posted yet</h3>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">Create your first hiring drive to start accepting applications.</p>
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
                                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                                        <Briefcase className="text-indigo-600" size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${drive.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                        {drive.isActive ? 'Active' : 'Closed'}
                                    </span>
                                </div>

                                <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{drive.jobRole}</h3>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{drive.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span>Deadline: {new Date(drive.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applicants</p>
                                        <div className="flex items-center gap-1 justify-center">
                                            <Users size={16} className="text-indigo-500" />
                                            <p className="font-extrabold text-xl text-slate-900">{drive.applicantCount}</p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/recruiter/drive/${drive._id}`}
                                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                                    >
                                        Manage <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
