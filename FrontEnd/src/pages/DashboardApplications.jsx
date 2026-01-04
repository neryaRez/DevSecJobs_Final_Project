import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardApplications() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!user || !user.is_admin) return;

    (async () => {
      try {
        const res = await api.get(`/apply/publisher/${user.id}`, {
          headers: authHeader,
        });
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
        מועמדויות למשרות שפרסמת 📄
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">טוען מועמדויות…</p>
      ) : applications.length === 0 ? (
        <p className="text-center text-gray-600">
          לא הוגשו מועמדויות למשרות שלך עדיין.
        </p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {app.job_title}
              </h2>
              <p className="text-gray-600">{app.job_description}</p>

              <p className="mt-2">
                <span className="font-bold">מועמד:</span>{" "}
                {app.applicant_name || "לא צוין"}
              </p>
              <p>
                <span className="font-bold">סטטוס:</span>{" "}
                <span
                  className={`${
                    app.status === "pending"
                      ? "text-yellow-600"
                      : app.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>
              <p>
                <span className="font-bold">ציון התאמה:</span>{" "}
                <span className="text-blue-600 font-bold">{app.score}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
