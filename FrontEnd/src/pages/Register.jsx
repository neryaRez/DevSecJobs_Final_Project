// 📁 src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
        is_admin: isAdmin, // ✅ שולחים ל-Backend
      });

      // שמירת המשתמש ו-token ב-AuthContext + localStorage
      login(res.data.user, res.data.access_token);

      // הפניה למסך המתאים
      if (res.data.user.is_admin) {
        navigate("/dashboard");
      } else {
        navigate("/complete-profile"); // ניצור בקרוב דף השלמת פרופיל
      }
    } catch (error) {
      console.error(error);
      alert("שגיאה בהרשמה - אנא נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-150 to-stone-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          הרשמה 📝
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            שם משתמש
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="בחר שם משתמש"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label className="text-gray-700 font-medium">אני מגייס (Recruiter)</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? "נרשם..." : "צור חשבון"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          כבר יש לך חשבון?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            התחבר כאן
          </a>
        </p>
      </form>
    </div>
  );
}
