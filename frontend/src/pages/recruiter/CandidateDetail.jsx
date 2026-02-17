import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import {
    User, Mail, Phone, BookOpen, FileText, ArrowLeft,
    CheckCircle, XCircle, Clock, Briefcase, ExternalLink, GraduationCap, Code2
} from "lucide-react";

export default function CandidateDetail() {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    useEffect(() => {
        fetchApplication();
    }, [applicationId]);

    const fetchApplication = async () => {
        try {
            const { data } = await axiosInstance.get(`/recruiter/application/${applicationId}`);
            setApp(data);
            setStatus(data.status);
            setNotes(data.recruiterNotes || "");
        } catch (error) {
            toast.error("Failed to fetch candidate details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            await axiosInstance.put(`/recruiter/application/${applicationId}/stage`, {
                status,
                recruiterNotes: notes
            });
            toast.success("Candidate status updated!");
            fetchApplication();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
            </div>
        </Layout>
    );

    if (!app) return null;

    // Cloudinary ya local URL fix
    const resumeUrl = app.student?.resume?.secure_url?.startsWith("http")
        ? app.student.resume.secure_url
        : `${BASE_URL}${app.student?.resume?.secure_url}`;

    return (
        <Layout>
            <div className="max-w-[1600px] mx-auto p-4 lg:p-6 h-screen flex flex-col">
                {/* Top Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-all">
                        <ArrowLeft size={20} /> Back to Drive
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">Current Status:</span>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${app.status === 'Selected' ? 'bg-green-100 text-green-700' :
                                app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {app.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                    {/* LEFT: CANDIDATE INFO & ACTION (35%) */}
                    <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                        {/* Profile Header */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 mx-auto mb-4 overflow-hidden border-4 border-slate-50">
                                {app.student?.profilePic?.secure_url ? (
                                    <img src={app.student.profilePic.secure_url} alt="Student" className="w-full h-full object-cover" />
                                ) : <User className="w-full h-full p-6 text-slate-300" />}
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">{app.student?.name}</h2>
                            <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider">{app.student?.branch} | {app.student?.course}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                            <h3 className="font-black text-slate-400 text-xs uppercase mb-4 tracking-widest">Candidate Information</h3>
                            <DetailItem icon={<Mail size={16} />} label="Email Address" value={app.student?.email} />
                            <DetailItem icon={<Phone size={16} />} label="Phone Number" value={app.student?.phone} />
                            <DetailItem icon={<GraduationCap size={16} />} label="University" value={app.student?.college || "UIET MDU Rohtak"} />
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-slate-50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold uppercase">CGPA</p><p className="font-black text-indigo-600">{app.student?.cgpa || "N/A"}</p></div>
                                <div className="p-3 bg-slate-50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Batch</p><p className="font-black text-slate-700">{app.student?.batch || "N/A"}</p></div>
                            </div>
                        </div>

                        {/* Recruiter Evaluation Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-green-400" size={18} /> Update Candidate Stage</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Selection Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full mt-1 bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Shortlisted">Shortlisted</option>
                                        <option value="Selected">Selected</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Internal Notes</label>
                                    <textarea
                                        rows="3"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add performance notes..."
                                        className="w-full mt-1 bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all active:scale-95"
                                >
                                    {updating ? "Saving..." : "Update Application"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: RESUME PREVIEW (65%) */}
                    <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <FileText className="text-indigo-600" /> RESUME PREVIEW
                            </h3>
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold border hover:shadow-md transition-all"
                            >
                                <ExternalLink size={14} /> Open Full View
                            </a>
                        </div>
                        <div className="flex-1 bg-slate-200">
                            {app.student?.resume?.secure_url ? (
                                <iframe
                                    src={`${resumeUrl}#view=FitH`}
                                    className="w-full h-full"
                                    title="Resume Preview"
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <XCircle size={48} className="mb-2 opacity-20" />
                                    <p className="font-bold">Resume not found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Helper Component for UI consistency
function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-1">
            <div className="mt-1 text-slate-400">{icon}</div>
            <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{label}</p>
                <p className="text-sm font-bold text-slate-700 truncate">{value || "N/A"}</p>
            </div>
        </div>
    );
}