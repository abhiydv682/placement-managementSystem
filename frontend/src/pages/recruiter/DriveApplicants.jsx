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
      <div className="max-w-7xl mx-auto space-y-8 pb-20 p-4 md:p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Applicants</h1>
            <p className="text-slate-500 text-sm mt-1">{filteredApps.length} candidates found</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm text-slate-700 font-medium placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                className="pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm appearance-none text-slate-700 font-medium cursor-pointer"
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
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredApps.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <Search size={40} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No applicants found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 pl-8">Candidate</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">Applied Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 text-right pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredApps.map((app) => (
                    <tr key={app._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100 shadow-sm">
                            {app.student?.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{app.student?.name}</h3>
                            <p className="text-xs text-slate-500 font-medium">{app.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3 pr-8">
                        {/* Quick Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => updateStatus(app._id, "Shortlisted")}
                            title="Shortlist"
                            className="p-2 hover:bg-amber-50 text-amber-500 hover:text-amber-600 rounded-xl transition-colors"
                          >
                            <UserCheck size={18} />
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, "Selected")}
                            title="Select"
                            className="p-2 hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 rounded-xl transition-colors"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, "Rejected")}
                            title="Reject"
                            className="p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl transition-colors"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>

                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        <Link
                          to={`/recruiter/candidate/${app._id}`}
                          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
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
