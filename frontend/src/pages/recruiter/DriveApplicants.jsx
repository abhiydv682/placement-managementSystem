import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";
import { Search, Filter, Eye, UserCheck, XCircle, CheckCircle } from "lucide-react";

export default function DriveApplicants() {
  const { driveId } = useParams();
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]); // For client-side filtering
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // NOTE: Ideally, pagination/search should be backend-side. 
  // However, recruiterController.getDriveApplicants returns ALL applicants.
  // We will do client-side filtering for valid search/sort.

  const fetchApps = async () => {
    try {
      const { data } = await axiosInstance.get(`/recruiter/drive/${driveId}/applicants`);
      setApps(data);
      setFilteredApps(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [driveId]);

  useEffect(() => {
    let result = apps;

    // Search
    if (search) {
      result = result.filter(app =>
        app.student?.name.toLowerCase().includes(search.toLowerCase()) ||
        app.student?.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter
    if (statusFilter !== "All") {
      result = result.filter(app => app.status === statusFilter);
    }

    setFilteredApps(result);
  }, [search, statusFilter, apps]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/recruiter/application/${id}/stage`, { status });
      toast.success(`Marked as ${status}`);
      fetchApps(); // Refresh to update UI
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Applicants</h1>
            <p className="text-slate-500 text-sm">{filteredApps.length} candidates found</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredApps.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400">No applicants found matching your criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredApps.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                            {app.student?.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{app.student?.name}</h3>
                            <p className="text-xs text-slate-500">{app.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        {/* Quick Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                          <button onClick={() => updateStatus(app._id, "Shortlisted")} title="Shortlist" className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"><UserCheck size={18} /></button>
                          <button onClick={() => updateStatus(app._id, "Selected")} title="Select" className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"><CheckCircle size={18} /></button>
                          <button onClick={() => updateStatus(app._id, "Rejected")} title="Reject" className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><XCircle size={18} /></button>
                        </div>

                        <Link
                          to={`/recruiter/candidate/${app._id}`}
                          className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          View <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
