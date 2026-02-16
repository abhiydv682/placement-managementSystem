import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentAnalytics({ apps }) {
  const selected = apps.filter(
    (a) => a.status === "Selected"
  ).length;

  const rejected = apps.filter(
    (a) => a.status === "Rejected"
  ).length;

  const applied = apps.length - selected - rejected;

  const data = [
    { name: "In Progress", value: applied },
    { name: "Selected", value: selected },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#6366f1", "#10b981", "#ef4444"];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4 dark:text-white">
        Application Analytics
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
