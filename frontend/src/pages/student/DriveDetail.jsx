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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Drives
        </button>

        {/* MAIN CARD */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-2xl">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-indigo-400">
                {drive.jobRole}
              </h2>
              <p className="text-gray-400 mt-1">
                {drive.company?.name || "Company Name"}
              </p>
            </div>

            <div className="flex flex-col gap-3 items-end">
              {applied && (
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                  <CheckCircle size={16} />
                  Already Applied
                </span>
              )}

              {timeLeft && (
                <span
                  className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-semibold ${
                    timeLeft === "Expired"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  <Clock size={16} />
                  {timeLeft}
                </span>
              )}
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-4 gap-5 mb-8">

            <Info
              icon={MapPin}
              label="Location"
              value={drive.location || "Not specified"}
            />

            <Info
              icon={Briefcase}
              label="Qualification"
              value={drive.qualification || "Not specified"}
            />

            <Info
              icon={Users}
              label="Vacancies"
              value={drive.vacancies || "Not specified"}
            />

            <Info
              icon={DollarSign}
              label="Package"
              value={drive.package || "Not disclosed"}
            />
          </div>

          {/* DEADLINE */}
          <div className="mb-6 text-gray-300">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              Deadline:
              {drive.deadline
                ? new Date(
                    drive.deadline
                  ).toLocaleDateString()
                : "Not specified"}
            </span>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-3 text-indigo-300">
              Job Description
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {drive.description ||
                "No description provided."}
            </p>
          </div>

          {/* APPLY BUTTON */}
          <button
            onClick={applyHandler}
            disabled={applied || timeLeft === "Expired"}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              applied
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:scale-105"
            }`}
          >
            {applied
              ? "Already Applied"
              : timeLeft === "Expired"
              ? "Drive Expired"
              : "Apply Now"}
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}

/* ================= INFO COMPONENT ================= */

function Info({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-700 p-4 rounded-xl flex items-center gap-3">
      <Icon size={18} />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
