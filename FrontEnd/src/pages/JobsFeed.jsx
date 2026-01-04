import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobsFeed() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // טעינת כל המשרות
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/jobs/", { headers: authHeader });
        setJobs(res.data || []);
      } catch (err) {
        console.error("שגיאה בטעינת משרות:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // טעינת המועמדויות של המשתמש
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await api.get(`/apply/user/${user.id}`, { headers: authHeader });
        setApplications(res.data || []);
      } catch (err) {
        console.error("שגיאה בטעינת מועמדויות:", err);
      }
    })();
  }, [user]);

  // בדיקה אם כבר הוגשה מועמדות
  const hasApplied = (jobId) => {
    return applications.some((app) => app.job_id === jobId);
  };

  // הגשת מועמדות למשרה
  const applyToJob = async (jobId) => {
    if (!user) return alert("יש להתחבר קודם");
    try {
      await api.post(
        `/apply/${jobId}`,
        { applicant_id: user.id },
        { headers: authHeader }
      );
      alert("המועמדות נשלחה בהצלחה ✅");
      setApplications((prev) => [...prev, { job_id: jobId, applicant_id: user.id }]);
    } catch (err) {
      console.error("שגיאה בהגשת מועמדות:", err);
      alert("שגיאה בהגשת מועמדות ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-blue-300 p-6">
      <br />
      {loading ? (
        <p className="text-center text-gray-600">טוען משרות…</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-600">אין משרות כרגע.</p>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gradient-to-r from-yellow-200 to-green-300 rounded-xl shadow hover:shadow-xl transition p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
              <p className="text-gray-500 mt-1">
                {job.work_location || "מיקום לא צוין"} · {job.employment_type || "היקף לא צוין"}
              </p>
              <p className="text-gray-700 mt-3">{job.description}</p>
              <button
                onClick={() => applyToJob(job.id)}
                disabled={hasApplied(job.id)}
                className={`mt-4 px-5 py-2 rounded-lg text-white transition ${
                  hasApplied(job.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 hover:shadow-lg"
                }`}
              >
                {hasApplied(job.id) ? "כבר הוגשה מועמדות" : "הגש מועמדות"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
