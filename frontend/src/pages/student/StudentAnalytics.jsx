import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StudentAnalytics({ apps }) {
  const selected = apps.filter((a) => a.status === "Selected").length;
  const rejected = apps.filter((a) => a.status === "Rejected").length;
  const applied = apps.length - selected - rejected;

  const data = [
    { name: "In Progress", value: applied },
    { name: "Selected", value: selected },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"]; // Amber (Pending), Emerald (Selected), Red (Rejected)

  if (apps.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col justify-center items-center text-center">
        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Application Analytics</h3>
        <p className="text-slate-500 text-sm">Apply to drives to see your stats here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 h-full">
      <h3 className="font-bold text-slate-800 dark:text-white mb-6">
        Application Analytics
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "#374151", fontWeight: "600" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-slate-600 dark:text-slate-300 font-medium ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
