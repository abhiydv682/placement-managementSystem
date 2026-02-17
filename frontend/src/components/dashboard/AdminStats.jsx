import { motion } from "framer-motion";
import { Users, Building2, Briefcase, FileText, CheckCircle, XCircle } from "lucide-react";

const icons = {
  "Total Students": Users,
  "Total Companies": Building2,
  "Total Drives": Briefcase,
  "Total Applications": FileText,
  "Selected": CheckCircle,
  "Rejected": XCircle
};

const colors = {
  "Total Students": "bg-indigo-100 text-indigo-600",
  "Total Companies": "bg-orange-100 text-orange-600",
  "Total Drives": "bg-blue-100 text-blue-600",
  "Total Applications": "bg-purple-100 text-purple-600",
  "Selected": "bg-emerald-100 text-emerald-600",
  "Rejected": "bg-red-100 text-red-600"
};

export default function AdminStats({ title, value }) {
  const Icon = icons[title] || Users;
  const colorClass = colors[title] || "bg-slate-100 text-slate-600";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
    >
      <div>
        <h3 className="text-slate-700 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">
          {value || 0}
        </p>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
        <Icon size={28} />
      </div>
    </motion.div>
  );
}
