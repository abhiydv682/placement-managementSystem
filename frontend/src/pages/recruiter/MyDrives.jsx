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
            <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Drives</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your active job postings and applications</p>
                </div>

                {/* DRIVES GRID */}
                {drives.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
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
                                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                        <Briefcase className="text-indigo-600 dark:text-indigo-400" size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${drive.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {drive.isActive ? 'Active' : 'Closed'}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">{drive.jobRole}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">{drive.description}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar size={14} />
                                        <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Applicants</p>
                                        <div className="flex items-center gap-1 justify-center">
                                            <Users size={14} className="text-slate-400" />
                                            <p className="font-bold text-xl text-slate-900 dark:text-white">{drive.applicantCount}</p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/recruiter/drive/${drive._id}`}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        View Applicants <ChevronRight size={16} />
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
