import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";

export default function Leaderboard() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/recruiter-ranking")
      .then((res) => {
        setRanking(res.data);
      });
  }, []);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        Recruiter Leaderboard 🏆
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow">
        {ranking.map((r, index) => (
          <div
            key={r._id}
            className="flex justify-between p-5 border-b dark:border-slate-700"
          >
            <div>
              <p className="font-semibold">
                #{index + 1} {r.name}
              </p>
            </div>

            <p className="text-indigo-600 font-bold">
              {r.selected} Selected
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
