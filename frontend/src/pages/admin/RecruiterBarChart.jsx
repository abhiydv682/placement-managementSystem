import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RecruiterBarChart({
  stats,
}) {
  const data = [
    { name: "Applications", value: stats.totalApplications },
    { name: "Selected", value: stats.selected },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="h-40 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
