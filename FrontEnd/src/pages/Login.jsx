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
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-amber-100 to-stone-300 text-slate-800
                 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-center text-amber-700 mb-8">
          התחברות 🔑
        </h1>

        {/* אימייל */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          אימייל
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-5
                     focus:outline-none focus:ring-2 focus:ring-amber-300"
        />

        {/* סיסמה */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          סיסמה
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-6
                     focus:outline-none focus:ring-2 focus:ring-amber-300"
        />

        {/* כפתור */}
        <button
          type="submit"
          className="w-full rounded-xl py-3 font-semibold text-white
                     bg-amber-600 hover:bg-amber-700 transition shadow-sm"
        >
          התחבר
        </button>

        {/* טקסט תחתון */}
        <p className="text-center text-slate-600 mt-6">
          אין לך חשבון?{" "}
          <span className="text-amber-700 font-semibold cursor-pointer hover:underline">
            צור אחד כאן
          </span>
        </p>
      </div>
    </div>
  );
}
