import { Menu, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ setOpen }) {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm px-4 md:px-6 py-4 flex justify-between items-center">
      <Menu
        className="md:hidden cursor-pointer dark:text-white"
        onClick={() => setOpen(true)}
      />

      <h1 className="text-lg md:text-xl font-semibold text-slate-700 dark:text-white">
        Welcome, {user?.name}
      </h1>

      <div className="flex items-center gap-4">
        <button onClick={() => setDark(!dark)}>
          {dark ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon />
          )}
        </button>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
