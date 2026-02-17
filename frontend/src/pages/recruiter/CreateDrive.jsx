import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Users, Calendar, Award } from "lucide-react";

export default function CreateDrive() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        jobRole: "",
        description: "",
        qualification: "",
        vacancies: "",
        location: "",
        package: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!form.jobRole || !form.description || !form.deadline) {
            return toast.error("Please fill all required fields");
        }

        try {
            setLoading(true);

            const payload = {
                ...form,
                vacancies: Number(form.vacancies),
            };

            // Attach company if available in user profile
            if (user?.company) {
                payload.company = user.company._id || user.company;
            }

            await axiosInstance.post("/drives", payload);

            toast.success("Drive Created Successfully 🚀");
            navigate("/recruiter/drives");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create drive");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto p-4 md:p-6 pb-20"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Create New Drive</h1>
                    <p className="text-slate-500 mt-1">Post a new job opening for students</p>
                </div>

                <form onSubmit={submitHandler} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">

                    {/* Job Role */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Briefcase size={16} className="text-indigo-500" /> Job Role *
                        </label>
                        <input
                            type="text"
                            name="jobRole"
                            value={form.jobRole}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                            required
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Describe the role, responsibilities, and requirements..."
                            required
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium resize-none leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Qualification */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Award size={16} className="text-indigo-500" /> Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                value={form.qualification}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech CSE"
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>

                        {/* Vacancies */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Users size={16} className="text-indigo-500" /> Vacancies
                            </label>
                            <input
                                type="number"
                                name="vacancies"
                                value={form.vacancies}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                min="1"
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-indigo-500" /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote / Bangalore"
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>

                        {/* Package */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <DollarSign size={16} className="text-indigo-500" /> CTC / Package
                            </label>
                            <input
                                type="text"
                                name="package"
                                value={form.package}
                                onChange={handleChange}
                                placeholder="e.g. 12 LPA"
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-500" /> Application Deadline *
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium cursor-pointer"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-4 ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? "Publishing Drive..." : "Publish Drive"}
                    </button>

                </form>
            </motion.div>
        </Layout>
    );
}
