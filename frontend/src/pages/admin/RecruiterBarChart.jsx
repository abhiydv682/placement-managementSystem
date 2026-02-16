import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

export default function RecruiterBarChart({ stats }) {
  const data = [
    { name: "Applications", value: stats.totalApplications, color: "#6366f1" }, // Indigo-500
    { name: "Selected", value: stats.selected, color: "#10b981" }, // Emerald-500
    { name: "Rejected", value: stats.rejected, color: "#ef4444" }, // Red-500
  ];

  if (!stats) return null;

  return (
    <div className="h-48 mt-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
