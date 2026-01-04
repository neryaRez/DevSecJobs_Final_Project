import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Jobs() {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    employment_type: "",
    work_location: "",
    description: "",
    required_technologies: "",
    required_experience: "",
    is_open: true,
  });

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // טעינת משרות (לפי ה־API שלך – GET /jobs/)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/jobs/", { headers: authHeader });
        setJobs(res.data || []);
      } catch (e) {
        console.error(e);
        alert("נכשל בטעינת משרות");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // יצירת משרה (POST /jobs/) — דורש JWT + אדמין, ושולחים publisher_id לפי המודל שלך
  const createJob = async (e) => {
    e.preventDefault();
    if (!user) return alert("יש להתחבר");
    if (!form.title.trim()) return alert("חובה למלא כותרת משרה");

    try {
      const payload = {
        ...form,
        required_experience: form.required_experience
          ? Number(form.required_experience)
          : null,
        publisher_id: user.id, // ה־Backend לא גוזר זאת מהטוקן, אז שולחים מפה
      };
      await api.post("/jobs/", payload, { headers: authHeader });
      // רענון הרשימה
      const list = await api.get("/jobs/", { headers: authHeader });
      setJobs(list.data || []);
      setCreating(false);
      setForm({
        title: "",
        employment_type: "",
        work_location: "",
        description: "",
        required_technologies: "",
        required_experience: "",
        is_open: true,
      });
    } catch (e) {
      console.error(e);
      alert("יצירת משרה נכשלה (נדרש Admin + JWT תקף)");
    }
  };

  // מחיקת משרה (DELETE /jobs/<id>) — דורש JWT + אדמין
  const deleteJob = async (id) => {
    if (!confirm("למחוק את המשרה?")) return;
    try {
      await api.delete(`/jobs/${id}`, { headers: authHeader });
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (e) {
      console.error(e);
      alert("מחיקה נכשלה (נדרש Admin + JWT)");
    }
  };

  // עדכון סטטוס is_open (PUT /jobs/<id>)
  const toggleOpen = async (job) => {
    try {
      const res = await api.put(
        `/jobs/${job.id}`,
        { is_open: !job.is_open },
        { headers: authHeader }
      );
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, is_open: res.data.is_open } : j)));
    } catch (e) {
      console.error(e);
      alert("עדכון סטטוס נכשל");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-gray-600 to-blue-400 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-assistant-semibold text-gray-800">המשרות שלי</h1>
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105 hover:shadow-md transition"
          >
            + משרה חדשה
          </button>
        </div>

        {creating && (
          <form
            onSubmit={createJob}
            className="bg-white rounded-xl shadow p-6 mb-8 grid md:grid-cols-2 gap-4"
          >
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="כותרת משרה *"
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              name="employment_type"
              value={form.employment_type}
              onChange={onChange}
              placeholder="סוג העסקה (Full/Part)"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="work_location"
              value={form.work_location}
              onChange={onChange}
              placeholder="מיקום עבודה (Office/Home/Hybrid)"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="required_technologies"
              value={form.required_technologies}
              onChange={onChange}
              placeholder="טכנולוגיות נדרשות (CSV: AWS, Docker, K8s)"
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
            <input
              type="number"
              min="0"
              name="required_experience"
              value={form.required_experience}
              onChange={onChange}
              placeholder="שנות ניסיון נדרשות"
              className="border rounded-lg px-3 py-2"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_open"
                checked={form.is_open}
                onChange={onChange}
              />
              משרה פתוחה לקליטה
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="תיאור משרה"
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows={3}
            />
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105 transition"
              >
                שמור
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                בטל
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>טוען משרות…</p>
        ) : jobs.length === 0 ? (
          <p>אין משרות עדיין.</p>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-gray-500 mt-1">
                    {job.work_location || "—"} · {job.employment_type || "—"} ·{" "}
                    {job.required_experience != null ? `${job.required_experience}y exp` : "ניסיון לא צוין"}
                  </p>
                  {job.required_technologies && (
                    <p className="text-gray-600 mt-2">
                      טכנולוגיות: {job.required_technologies}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => toggleOpen(job)}
                    className={`px-3 py-1.5 rounded-lg text-white ${
                      job.is_open ? "bg-emerald-600" : "bg-slate-500"
                    }`}
                  >
                    {job.is_open ? "פתוחה" : "סגורה"}
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white"
                  >
                    מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
