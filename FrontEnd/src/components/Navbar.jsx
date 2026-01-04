// 📁 src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `transition-colors hover:text-yellow-300 ${
      isActive ? "font-bold underline underline-offset-4" : ""
    }`;

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* לוגו */}
        <NavLink
          to="/"
          className="text-3xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform"
        >
          DevSecJobs
        </NavLink>

        {/* תפריט דסקטופ */}
        <div className="hidden md:flex gap-6 items-center">
          {!user && (
            <>
              <NavLink
                to="/"
                className="px-5 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all"
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className="px-5 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:shadow-md hover:scale-105 transition"
              >
                Sign Up
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink
                to={user.is_admin ? "/dashboard" : "/user-home"}
                className={linkClass}
              >
                Home
              </NavLink>
              <button
                onClick={logout}
                className="ml-4 text-white hover:text-red-300"
              >
                Logout
              </button>
              <span className="ml-2 text-white">👤</span>
            </>
          )}
        </div>

        {/* תפריט מובייל */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* תפריט מובייל נפתח */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 bg-white/95 text-gray-900 px-6 py-4">
          {!user && (
            <>
              <NavLink
                to="/"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-1.5 bg-pink-600 text-white rounded-full"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink
                to={user.is_admin ? "/dashboard" : "/user-home"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
