import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import {
    Building2,
    MapPin,
    DollarSign,
    GraduationCap,
    Users,
    CalendarDays,
    FileText,
    Save,
    ArrowLeft
} from "lucide-react";

export default function EditDrive() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        jobRole: "",
        description: "",
        qualification: "",
        vacancies: "",
        location: "",
        package: "",
        deadline: "",
        isActive: true, // Default
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDrive();
    }, [id]);

    const fetchDrive = async () => {
        try {
            // Correct endpoint for single drive
            const { data } = await axiosInstance.get(`/drives/${id}`);
            const drive = data.drive;

            if (drive) {
                setForm({
                    jobRole: drive.jobRole || "",
                    description: drive.description || "",
                    qualification: drive.qualification || "",
                    vacancies: drive.vacancies || "",
                    location: drive.location || "",
                    package: drive.package || "",
                    deadline: drive.deadline ? drive.deadline.split("T")[0] : "",
                    isActive: drive.isActive ?? true,
                });
            }
        } catch (error) {
            toast.error("Failed to load drive details");
            navigate("/admin/drives");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const updateDrive = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            await axiosInstance.put(`/drives/${id}`, form);
            toast.success("Drive updated successfully");
            navigate("/admin/drives");
        } catch {
            toast.error("Update failed. Please check inputs.");
        } finally {
            setSaving(false);
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
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/admin/drives")}
                        className="p-2 bg-white rounded-xl shadow-sm hover:scale-105 transition"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h1 className="md:text-3xl text-2xl font-bold text-slate-800">Edit Drive</h1>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <form onSubmit={updateDrive} className="space-y-6">

                        {/* JOB ROLE */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Job Role</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    name="jobRole"
                                    required
                                    value={form.jobRole}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Job Description</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-slate-400" size={20} />
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium resize-none"
                                    placeholder="Detailed job description..."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* QUALIFICATION */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Qualification</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        name="qualification"
                                        required
                                        value={form.qualification}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium"
                                        placeholder="e.g. B.Tech CSE"
                                    />
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={form.location}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium"
                                        placeholder="e.g. Bangalore"
                                    />
                                </div>
                            </div>

                            {/* PACKAGE */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Package (LPA)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        name="package"
                                        required
                                        value={form.package}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium"
                                        placeholder="e.g. 12 LPA"
                                    />
                                </div>
                            </div>

                            {/* VACANCIES */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Vacancies</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="number"
                                        name="vacancies"
                                        required
                                        min={1}
                                        value={form.vacancies}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 items-end">
                            {/* DEADLINE */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Deadline</label>
                                <div className="relative">
                                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="date"
                                        name="deadline"
                                        required
                                        value={form.deadline}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium"
                                    />
                                </div>
                            </div>

                            {/* ACTIVE STATUS TOGGLE */}
                            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                                <span className="font-semibold text-slate-700">Active Drive</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={form.isActive}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Drive details
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
