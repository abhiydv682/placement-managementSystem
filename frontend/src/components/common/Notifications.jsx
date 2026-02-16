import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axiosInstance from "../../services/axiosInstance";
import { Link } from "react-router-dom";
import { Bell, Check, CheckCheck, Clock, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    axiosInstance.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const markRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking read", error);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all read", error);
    }
  };

  // Helper for relative time (Simple version)
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <Bell size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-slate-500 text-sm">You have {unreadCount} unread messages</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-xl transition-colors"
            >
              <CheckCheck size={18} />
              Mark all as read
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-t-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading updates...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                <Bell size={32} className="text-slate-300 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">All caught up!</h3>
              <p className="text-slate-500 max-w-xs mt-2">No new notifications at the moment. Check back later for updates.</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${n.isRead
                      ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
                      : "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30 shadow-sm"
                    }`}
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${n.isRead ? 'bg-slate-200 dark:bg-slate-600' : 'bg-indigo-500'}`}></div>

                    <div className="flex-1">
                      <Link to={n.link} className="block group-hover:opacity-80 transition-opacity">
                        <h4 className={`text-lg transition-colors ${n.isRead ? 'font-semibold text-slate-800 dark:text-slate-200' : 'font-bold text-indigo-900 dark:text-white'}`}>
                          {n.title}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </Link>

                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                          <Clock size={12} />
                          {timeAgo(n.createdAt)}
                        </span>

                        {!n.isRead && (
                          <button
                            onClick={() => markRead(n._id)}
                            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Check size={12} />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
}
