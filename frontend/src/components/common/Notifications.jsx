import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    axiosInstance.get("/notifications").then((res) => {
      setNotifications(res.data);
    });
  }, []);

  const markRead = async (id) => {
    await axiosInstance.put(
      `/notifications/${id}/read`
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Notifications
      </h2>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-xl shadow ${
              n.isRead
                ? "bg-gray-100 dark:bg-slate-700"
                : "bg-white dark:bg-slate-800"
            }`}
          >
            <Link to={n.link}>
              <h4 className="font-semibold">
                {n.title}
              </h4>
              <p className="text-sm">
                {n.message}
              </p>
            </Link>

            {!n.isRead && (
              <button
                onClick={() => markRead(n._id)}
                className="text-xs text-indigo-600 mt-2"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
