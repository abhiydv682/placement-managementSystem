import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#ef4444"]; // Emerald-500, Red-500

export default function SelectionPie({ selected, rejected }) {
  const data = [
    { name: "Selected", value: selected },
    { name: "Rejected", value: rejected },
  ];

  // If no data, show a gray placeholder
  if (selected === 0 && rejected === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">
        No stats available yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
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
            formatter={(value, entry) => (
              <span className="text-slate-600 dark:text-slate-300 font-medium ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
