import { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, Bell, User, LogOut, Settings, Plus, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ setOpen }) {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Role Configuration
  const roleConfig = {
    admin: {
      label: "Admin Console",
      badgeColor: "bg-red-100 text-red-700 border-red-200",
      action: { label: "New Company", icon: Building2, path: "/admin/companies" }
    },
    recruiter: {
      label: "Recruiter Portal",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      action: { label: "Post Drive", icon: Plus, path: "/recruiter/drives" }
    },
    student: {
      label: "Student Zone",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      action: null // Students might not need a primary "Create" action in navbar
    }
  };

  const currentRole = roleConfig[user?.role] || { label: "Guest", badgeColor: "bg-slate-100 text-slate-700" };

  return (
    <header className="bg-white/90 backdrop-blur-md dark:bg-slate-800/90 shadow-sm sticky top-0 z-40 border-b border-indigo-50 dark:border-slate-700">
      <div className="px-4 md:px-6 h-16 flex justify-between items-center">

        {/* LEFt: Mobile Toggle & Role Badge */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-700 transition"
          >
            <Menu className="text-slate-600 dark:text-slate-200" size={24} />
          </button>

          <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${currentRole.badgeColor}`}>
            {currentRole.label}
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Role Specific Action Button */}
          {currentRole.action && (
            <Link
              to={currentRole.action.path}
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-600/20"
            >
              <currentRole.action.icon size={16} />
              {currentRole.action.label}
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors"
            title="Toggle Theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications Placeholder */}
          <Link to="/notifications" className="p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 pl-2 md:pr-4 rounded-full border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all group"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-900">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white dark:ring-slate-800 group-hover:ring-indigo-100 transition-all">
                <span className="font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 md:hidden">
                  <p className="font-bold text-slate-800 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>

                <div className="p-1">
                  <Link
                    to={`/${user?.role}/profile`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors">
                    <Settings size={16} /> Settings
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
