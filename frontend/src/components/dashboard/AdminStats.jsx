import { motion } from "framer-motion";

export default function AdminStats({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-slate-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-indigo-700 mt-2">
        {value}
      </p>
    </motion.div>
  );
}
