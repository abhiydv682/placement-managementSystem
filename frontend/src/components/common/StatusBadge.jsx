export default function StatusBadge({ status }) {
  const colors = {
    Applied: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-purple-100 text-purple-700",
    "Interview Scheduled": "bg-yellow-100 text-yellow-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    "On Hold": "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
