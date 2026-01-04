// 📁 src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // שליחת בקשה ל-API שלך
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // שמירת טוקן + פרטי משתמש
      login(res.data.user, res.data.access_token);

      // הפניה למסך המתאים
      if (res.data.user.is_admin) {
        navigate("/dashboard");
      } else {
        navigate("/user-home");
      }
    } catch (error) {
      console.error(error);
      alert("שגיאה בהתחברות - בדוק את פרטי המשתמש שלך");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          התחברות 🔑
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          אין לך חשבון?{" "}
          <a href="/register" className="text-pink-600 hover:underline">
            צור אחד כאן
          </a>
        </p>
      </form>
    </div>
  );
}
