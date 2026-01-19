import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-50 bg-white/90 backdrop-blur
                 border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-amber-700 tracking-tight"
        >
          DevSecJobs
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold transition ${
                isActive
                  ? "text-amber-700"
                  : "text-slate-700 hover:text-amber-700"
              }`
            }
          >
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive
                    ? "text-amber-700"
                    : "text-slate-700 hover:text-amber-700"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${
                    isActive
                      ? "text-amber-700"
                      : "text-slate-700 hover:text-amber-700"
                  }`
                }
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold
                           bg-amber-600 text-white
                           hover:bg-amber-700 transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-sm font-semibold text-slate-700
                         hover:text-rose-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
