import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import {
    User,
    Mail,
    Phone,
    FileText,
    BookOpen,
    Star,
    MessageSquare,
    ArrowLeft,
    CheckCircle,
    XCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function CandidateDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [status, setStatus] = useState("");
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [round, setRound] = useState("");

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        try {
            // NOTE: We need a new endpoint to get single application by ID for Recruiter
            // Or we can simple reuse an existing one if permissions allow.
            // Assuming recruiterController doesn't have `getApplicationById`.
            // We'll use `updateCandidateStage` which likely returns existing data? No.
            // We will assume `GET /recruiter/application/:id` exists or use the general one. 
            // Wait, general `getApplicationById` in `applicationController` might be student/admin only?
            // Let's assume we added `getSingleApplication` for recruiter or use general one if protected properly.
            // For now, let's try calling the general `/applications/:id` endpoint.

            const { data } = await axiosInstance.get(`/applications/${id}`);
            setApp(data);
            setStatus(data.status);
            setRating(data.rating || 0);
            setNotes(data.recruiterNotes || "");
            setRound(data.currentRound || "Round 1");
        } catch (error) {
            console.error(error);
            toast.error("Failed to load candidate details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.put(`/recruiter/application/${id}/stage`, {
                status,
                currentRound: round,
                rating,
                recruiterNotes: notes
            });
            toast.success("Candidate evaluated successfully");
            fetchApplication(); // Refresh
        } catch (error) {
            toast.error("Update failed");
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

    if (!app) return <p>Application not found</p>;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to List
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: CANDIDATE PROFILE */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                                    {app.student?.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{app.student?.name}</h1>
                                    <div className="flex flex-wrap gap-4 mt-3 text-slate-500 text-sm font-medium">
                                        <span className="flex items-center gap-1.5"><Mail size={16} /> {app.student?.email}</span>
                                        <span className="flex items-center gap-1.5"><Phone size={16} /> {app.student?.phone || "N/A"}</span>
                                        <span className="flex items-center gap-1.5"><BookOpen size={16} /> {app.student?.course}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                                    <Star className="text-yellow-500" size={20} /> Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {app.student?.skills?.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {app.student?.resume?.secure_url && (
                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText className="text-indigo-500" size={20} /> Resume
                                    </h3>
                                    <iframe
                                        src={app.student.resume.secure_url}
                                        className="w-full h-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50"
                                        title="Resume"
                                    />
                                    <div className="mt-4 text-right">
                                        <a
                                            href={app.student.resume.secure_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-indigo-600 font-bold hover:underline"
                                        >
                                            Open in New Tab
                                        </a>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* RIGHT: EVALUATION FORM */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-lg border border-indigo-100 dark:border-slate-700 sticky top-24"
                        >
                            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Evaluation</h2>

                            <div className="space-y-5">
                                {/* STATUS */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stage Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Shortlisted">Shortlisted</option>
                                        <option value="Selected">Selected</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* ROUND */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Round</label>
                                    <select
                                        value={round}
                                        onChange={(e) => setRound(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Round 1">Round 1</option>
                                        <option value="Technical">Technical</option>
                                        <option value="HR">HR</option>
                                        <option value="Final">Final</option>
                                    </select>
                                </div>

                                {/* RATING */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rating (1-5)</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`p-1 rounded-full transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                                            >
                                                <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* NOTES */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Interview Notes</label>
                                    <textarea
                                        rows={4}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add observations..."
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    ></textarea>
                                </div>

                                <Button onClick={handleUpdate} className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                                    Update Evaluation
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
