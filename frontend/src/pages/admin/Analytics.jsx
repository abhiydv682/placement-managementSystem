import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend
} from 'recharts';
import { Award, TrendingUp, Download, Filter } from "lucide-react";

export default function Analytics() {
    const [recruiterRanking, setRecruiterRanking] = useState([]);
    const [driveAnalytics, setDriveAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rankingRes, drivesRes] = await Promise.all([
                    axiosInstance.get("/admin/recruiter-ranking"),
                    axiosInstance.get("/admin/drive-analytics")
                ]);
                setRecruiterRanking(rankingRes.data);
                setDriveAnalytics(drivesRes.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter drive data for charts (e.g., top 10 active drives)
    const driveChartData = driveAnalytics.slice(0, 5).map(d => ({
        name: d.drive,
        Applications: d.total,
        Selected: d.selected
    }));

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6 md:space-y-8 max-w-[1600px] mx-auto p-4 md:p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Recruitment Analytics</h1>
                        <p className="text-sm md:text-base text-slate-500">Deep dive into recruiter performance and drive efficiency.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors w-full md:w-auto shadow-sm">
                        <Download size={16} /> Export Data
                    </button>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

                    {/* 1. Recruiter Leaderboard */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Award className="text-amber-500" size={20} />
                                Top Recruiters
                            </h2>
                            <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-lg">Selections</span>
                        </div>

                        <div className="h-[300px] md:h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={recruiterRanking.slice(0, 10)} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={80}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        style={{
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden'
                                        }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="selected" fill="#8a6144" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Drive Efficiency */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp className="text-indigo-500" size={20} />
                                Drive Efficiency
                            </h2>
                            <button className="p-2 hover:bg-slate-50 rounded-lg">
                                <Filter size={16} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="h-[300px] md:h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={driveChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        interval={0}
                                        angle={-10}
                                        textAnchor="end"
                                        height={40}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="Applications" fill="#f5e6d3" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="Selected" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Detailed Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-slate-800">Drive Performance Details</h2>
                        <input
                            type="text"
                            placeholder="Search drives..."
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full sm:w-64"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                            <thead className="bg-slate-50 text-slate-700 font-bold">
                                <tr>
                                    <th className="p-4 whitespace-nowrap">Drive Name</th>
                                    <th className="p-4 whitespace-nowrap">Total Applications</th>
                                    <th className="p-4 whitespace-nowrap">Selected Candidates</th>
                                    <th className="p-4 whitespace-nowrap">Conversion Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {driveAnalytics.map((drive, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-900">{drive.drive}</td>
                                        <td className="p-4">{drive.total}</td>
                                        <td className="p-4 text-emerald-600 font-bold">{drive.selected}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        style={{ width: `${drive.total > 0 ? ((drive.selected / drive.total) * 100) : 0}%` }}
                                                    ></div>
                                                </div>
                                                <span>{drive.total > 0 ? ((drive.selected / drive.total) * 100).toFixed(1) : 0}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {driveAnalytics.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
