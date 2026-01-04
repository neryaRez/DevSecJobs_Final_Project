import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function MyApplications() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // טעינת המועמדויות
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await api.get(`/apply/user/${user.id}`, { headers: authHeader });
        setApplications(res.data || []);
      } catch (err) {
        console.error("שגיאה בטעינת מועמדויות:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-200 p-6">
      <h1 className="text-4xl font-assistant text-gray-800 text-center mb-10">
        המועמדויות שלי 📄
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">טוען מועמדויות…</p>
      ) : applications.length === 0 ? (
        <p className="text-center text-gray-600">לא הוגשו מועמדויות עדיין.</p>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
  {applications.map((app) => (
    <div
      key={app.id}
      className="bg-white rounded-xl shadow hover:shadow-xl transition p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        {app.job_title || "משרה ללא שם"}
      </h2>

      <p className="text-gray-600 mt-2">
        {app.description || "אין תיאור זמין"}
      </p>

      <p className="text-gray-500 mt-3">
        סטטוס:{" "}
        <span
          className={`font-semibold ${
            app.status === "pending"
              ? "text-yellow-600"
              : app.status === "approved"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {app.status || "לא צוין"}
        </span>
      </p>

      <p className="text-gray-700 mt-2">
        ציון התאמה:{" "}
        <span className="font-bold text-blue-600">
          {app.score !== null ? app.score : "לא חושב עדיין"}
        </span>
      </p>

      <p className="text-gray-700 mt-3">
        {app.notes || "אין הערות נוספות"}
      </p>
    </div>
  ))}
</div>

      )}
    </div>
  );
}
