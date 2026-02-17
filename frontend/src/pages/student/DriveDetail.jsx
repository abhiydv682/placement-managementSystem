import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Briefcase,
  Users,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";

export default function DriveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  /* ================= FETCH DRIVE ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/drives/${id}`);

        // ✅ Safe extraction
        const driveData =
          res.data?.drive || res.data;

        setDrive(driveData);

        // fetch applications
        const appRes = await axiosInstance.get("/applications/my");

        const apps = Array.isArray(appRes.data)
          ? appRes.data
          : appRes.data?.applications || [];

        const alreadyApplied = apps.some(
          (app) =>
            app.drive?._id === id ||
            app.drive === id
        );

        setApplied(alreadyApplied);

      } catch (err) {
        console.error(err);
        toast.error("Failed to load drive details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= COUNTDOWN FIX ================= */

  useEffect(() => {
    if (!drive?.deadline) return;

    const updateCountdown = () => {
      const now = new Date();
      const deadline = new Date(drive.deadline);

      if (isNaN(deadline)) {
        setTimeLeft("Invalid Date");
        return;
      }

      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff / (1000 * 60 * 60)) % 24
      );

      setTimeLeft(`${days}d ${hours}h left`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [drive]);

  /* ================= APPLY ================= */

  const applyHandler = async () => {
    try {
      await axiosInstance.post(`/applications/${id}`);
      toast.success("Applied Successfully 🚀");
      setApplied(true);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Application failed"
      );
    }
  };

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!drive) {
    return (
      <Layout>
        <p className="text-center mt-10">
          Drive not found
        </p>
      </Layout>
    );
  }

  /* ================= UI ================= */

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-4 pb-20"
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors"
        >
          <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
            <ArrowLeft size={16} />
          </div>
          Back to Drives
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

          {/* HEADER IMAGE / BANNER (Optional Pattern) */}
          <div className="h-32 bg-gradient-to-r from-indigo-300 to-purple-300"></div>

          <div className="px-6 md:px-10 pb-10 -mt-12">

            {/* LOGO & TITLE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-white">
                  {drive.company?.name?.charAt(0) || "C"}
                </div>
                <div className="mb-2">
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                    {drive.jobRole}
                  </h2>
                  <p className="text-lg font-medium text-slate-500">
                    {drive.company?.name}
                  </p>
                </div>
              </div>

              {/* STATUS TAGS */}
              <div className="flex flex-wrap gap-2 mb-2">
                {applied && (
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-100">
                    <CheckCircle size={14} />
                    Applied
                  </span>
                )}
                {timeLeft && (
                  <span
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border ${timeLeft === "Expired"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                  >
                    <Clock size={14} />
                    {timeLeft}
                  </span>
                )}
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <Info icon={MapPin} label="Location" value={drive.location} />
              <Info icon={Briefcase} label="Qualification" value={drive.qualification} />
              <Info icon={Users} label="Vacancies" value={drive.vacancies || "N/A"} />
              <Info icon={DollarSign} label="Package" value={drive.package || "N/A"} />
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* LEFT: DESCRIPTION */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                    About the Role
                  </h3>
                  <div className="prose prose-slate text-slate-600 leading-relaxed whitespace-pre-line">
                    {drive.description || "No description provided."}
                  </div>
                </div>
              </div>

              {/* RIGHT: SIDEBAR ACTION */}
              <div className="bg-slate-50 p-6 rounded-3xl h-fit border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Application Deadline</h4>

                <div className="flex items-center gap-3 text-slate-600 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <CalendarDays className="text-indigo-500" size={20} />
                  <span className="font-medium">
                    {drive.deadline ? new Date(drive.deadline).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No Deadline'}
                  </span>
                </div>

                <button
                  onClick={applyHandler}
                  disabled={applied || timeLeft === "Expired"}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${applied
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300"
                    }`}
                >
                  {applied ? "Application Sent" : timeLeft === "Expired" ? "Deadline Passed" : "Apply Now"}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  By applying, you agree to share your profile with the recruiter.
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </Layout>
  );
}

/* ================= INFO COMPONENT ================= */

function Info({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2 hover:bg-indigo-50/50 transition-colors">
      <div className="p-2 bg-white rounded-full shadow-sm text-indigo-600">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
        <p className="font-bold text-slate-800 text-sm line-clamp-1">{value || "N/A"}</p>
      </div>
    </div>
  );
}
