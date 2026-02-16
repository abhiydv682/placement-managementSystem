import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

export default function DriveApplicants() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const driveId = "YOUR_DRIVE_ID"; // Replace dynamically later

  const fetchApps = async () => {
    const { data } = await axiosInstance.get(
      `/applications/drive/${driveId}?page=${page}&search=${search}`
    );

    setApps(data.applications);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchApps();
  }, [page, search]);

  const updateStatus = async (id, status) => {
    await axiosInstance.put(`/applications/${id}/status`, {
      status,
    });

    toast.success("Status Updated");
    fetchApps();
  };

  return (
    <Layout>
      {/* Search */}
      <div className="flex items-center bg-white rounded-xl px-4 py-2 shadow mb-6">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by status..."
          className="ml-3 outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-indigo-700">
                  {app.student?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {app.student?.email}
                </p>
              </div>

              <StatusBadge status={app.status} />
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              {["Shortlisted", "Selected", "Rejected"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      updateStatus(app._id, status)
                    }
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500"
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </Layout>
  );
}
