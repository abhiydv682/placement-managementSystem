// import { NavLink } from "react-router-dom";
// import { Home, Briefcase, Users, FileText, X } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// export default function Sidebar({ open, setOpen }) {
//   const { user } = useAuth();

//   const menu = {
//     admin: [
//       { name: "Dashboard", path: "/admin", icon: Home },
//       { name: "Companies", path: "/admin/companies", icon: Users },
//       { name: "Drives", path: "/admin/drives", icon: Briefcase },
//       { name: "Applications", path: "/admin/applications", icon: FileText },
//     ],
//     student: [
//       { name: "Dashboard", path: "/student", icon: Home },
//       { name: "Drives", path: "/student/drives", icon: Briefcase },
//       { name: "My Applications", path: "/student/applications", icon: FileText },
//     ],
//     recruiter: [
//       { name: "Dashboard", path: "/recruiter", icon: Home },
//       { name: "Drive Applicants", path: "/recruiter/drives", icon: Briefcase },
//     ],
//   };

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed md:static z-50 w-64 bg-gradient-to-b from-indigo-900 to-slate-900 text-white transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 transition-transform duration-300`}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-white/20">
//           <h2 className="text-xl font-bold">Avani Portal</h2>
//           <X
//             className="md:hidden cursor-pointer"
//             onClick={() => setOpen(false)}
//           />
//         </div>

//         <nav className="p-4 space-y-2">
//           {menu[user?.role]?.map((item) => {
//             const Icon = item.icon;

//             return (
//               <NavLink
//                 key={item.name}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 p-3 rounded-lg transition ${
//                     isActive
//                       ? "bg-indigo-600"
//                       : "hover:bg-indigo-700"
//                   }`
//                 }
//               >
//                 <Icon size={18} />
//                 {item.name}
//               </NavLink>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// }



import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  User,
  Bell,
  LogOut,
  X,
  BarChart2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: Home },
      { name: "Companies", path: "/admin/companies", icon: Users },
      { name: "Drives", path: "/admin/drives", icon: Briefcase },
      { name: "Applications", path: "/admin/applications", icon: FileText },
      { name: "Analytics", path: "/admin/analytics", icon: BarChart2 },
    ],

    student: [
      { name: "Dashboard", path: "/student", icon: Home },
      { name: "Explore Drives", path: "/student/drives", icon: Briefcase },
      { name: "My Applications", path: "/student/applications", icon: FileText },
      { name: "My Profile", path: "/student/profile", icon: User },
      { name: "Notifications", path: "/notifications", icon: Bell },
    ],

    recruiter: [
      { name: "Dashboard", path: "/recruiter", icon: Home },
      { name: "Drive Applicants", path: "/recruiter/drives", icon: Briefcase },
      { name: "Notifications", path: "/notifications", icon: Bell },
    ],
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 h-screen w-64 flex flex-col bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl transform ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-wide">
            Avani Enterprise
          </h2>

          <X
            className="md:hidden cursor-pointer hover:text-red-400 transition"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menu[user?.role]?.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-indigo-600 shadow-lg"
                    : "hover:bg-indigo-700/70"
                  }`
                }
              >
                <Icon
                  size={18}
                  className="group-hover:scale-110 transition"
                />
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 py-2 rounded-xl hover:bg-red-700 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
