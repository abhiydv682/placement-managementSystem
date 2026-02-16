import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SelectionPie({
  selected,
  rejected,
}) {
  const data = [
    { name: "Selected", value: selected },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="h-64">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
