import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/recruiter-ranking")
      .then((res) => {
        setRanking(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center h-screen items-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      </Layout>
    );
  }

  // Split top 3 and the rest
  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white flex justify-center items-center gap-3">
            <Trophy className="text-yellow-500" size={40} />
            Recruiter Leaderboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Top performers based on candidate selections</p>
        </div>

        {/* PODIUM SECTION */}
        {top3.length > 0 && (
          <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16">

            {/* 2nd Place (Desktop: Left, Mobile: Order 2) */}
            {top3[1] && (
              <div className="order-2 md:order-1 w-full md:w-1/3">
                <PodiumCard
                  recruiter={top3[1]}
                  rank={2}
                  color="bg-gradient-to-b from-slate-300 to-slate-400 border-slate-400"
                  icon={<Medal size={24} className="text-slate-600" />}
                  delay={0.2}
                  height="h-48"
                  textColor="text-slate-800"
                />
              </div>
            )}

            {/* 1st Place (Desktop: Center, Mobile: Order 1) */}
            <div className="order-1 md:order-2 w-full md:w-1/3 z-10">
              <PodiumCard
                recruiter={top3[0]}
                rank={1}
                color="bg-gradient-to-b from-[#FFD700] to-[#FDB931] border-yellow-500"
                icon={<Crown size={32} className="text-yellow-700 fill-yellow-700" />}
                delay={0}
                height="h-60"
                isWinner
                textColor="text-yellow-900"
              />
            </div>

            {/* 3rd Place (Desktop: Right, Mobile: Order 3) */}
            {top3[2] && (
              <div className="order-3 md:order-3 w-full md:w-1/3">
                <PodiumCard
                  recruiter={top3[2]}
                  rank={3}
                  color="bg-gradient-to-b from-[#cd7f32] to-[#a05a2c] border-orange-600"
                  icon={<Award size={24} className="text-orange-100" />}
                  delay={0.4}
                  height="h-40"
                  textColor="text-orange-50"
                />
              </div>
            )}
          </div>
        )}

        {/* LIST SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {others.length > 0 ? (
            others.map((r, index) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-5 border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                    #{index + 4}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Recruiter</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 rounded-full">
                  <TrendingUp size={16} />
                  {r.selected} <span className="text-xs font-normal text-indigo-400 dark:text-indigo-300">Selected</span>
                </div>
              </motion.div>
            ))
          ) : (
            top3.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No recruiter data available yet.
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}

function PodiumCard({ recruiter, rank, color, icon, delay, height, isWinner, textColor = "text-slate-900" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`relative w-full p-6 rounded-t-3xl flex flex-col items-center justify-end text-center ${height} ${color} ${isWinner ? 'shadow-2xl' : 'shadow-lg opacity-95'}`}
    >
      <div className={`absolute -top-6 ${isWinner ? 'scale-125' : ''}`}>
        <div className="bg-white p-3 rounded-full shadow-md">
          {icon}
        </div>
      </div>

      <div className="mt-8">
        <h3 className={`font-bold ${textColor} ${isWinner ? 'text-2xl' : 'text-xl'}`}>{recruiter.name}</h3>
        <p className={`${textColor} opacity-80 text-sm mb-2 font-medium`}>Rank #{rank}</p>

        <div className="inline-flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
          <span className={`font-bold ${textColor}`}>{recruiter.selected}</span>
          <span className={`text-xs ${textColor} opacity-80 uppercase tracking-wider`}>Selections</span>
        </div>
      </div>
    </motion.div>
  );
}
