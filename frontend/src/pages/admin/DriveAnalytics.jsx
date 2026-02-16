import Layout from "../../components/layout/Layout";
import { PieChart, Pie, Cell } from "recharts";

export default function DriveAnalytics() {
  const data = [
    { name: "Selected", value: 40 },
    { name: "Rejected", value: 25 },
    { name: "Shortlisted", value: 20 },
    { name: "Applied", value: 50 },
  ];

  const COLORS = [
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#6366F1",
  ];

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Drive Analytics
      </h2>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>
      </PieChart>
    </Layout>
  );
}
