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

      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, is_open: res.data.is_open } : j
        )
      );
    } catch (e) {
      console.error(e);
      alert("עדכון סטטוס נכשל");
    }
  }; // ✅ חשוב! סוגר את הפונקציה

return (
  <div dir="rtl" className="w-full text-right">
    {/* Header row */}
    <div className="w-full flex items-center justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold text-slate-800">המשרות שלי</h1>

      <button
        onClick={() => setCreating(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                   bg-amber-600 text-white shadow-sm
                   hover:bg-amber-700 hover:shadow transition"
      >
        <span className="text-lg leading-none">+</span>
        <span>משרה חדשה</span>
      </button>
    </div>

    {/* Create form */}
    {creating && (
      <form
        onSubmit={createJob}
        className="bg-white rounded-2xl shadow p-6 mb-8 w-full grid md:grid-cols-2 gap-4 border border-slate-200"
      >
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="כותרת משרה *"
          className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          required
        />
        <input
          name="employment_type"
          value={form.employment_type}
          onChange={onChange}
          placeholder="סוג העסקה (Full/Part)"
          className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <input
          name="work_location"
          value={form.work_location}
          onChange={onChange}
          placeholder="מיקום עבודה (Office/Home/Hybrid)"
          className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <input
          name="required_technologies"
          value={form.required_technologies}
          onChange={onChange}
          placeholder="טכנולוגיות נדרשות (CSV: AWS, Docker, K8s)"
          className="border border-slate-200 rounded-xl px-3 py-2 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <input
          type="number"
          min="0"
          name="required_experience"
          value={form.required_experience}
          onChange={onChange}
          placeholder="שנות ניסיון נדרשות"
          className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />

        <label className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            name="is_open"
            checked={form.is_open}
            onChange={onChange}
            className="accent-amber-600"
          />
          משרה פתוחה לקליטה
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="תיאור משרה"
          className="border border-slate-200 rounded-xl px-3 py-2 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          rows={3}
        />

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 text-white
                       hover:bg-amber-700 transition shadow-sm"
          >
            שמור
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700
                       hover:bg-slate-200 transition"
          >
            בטל
          </button>
        </div>
      </form>
    )}

    {/* List */}
    {loading ? (
      <p className="text-slate-600">טוען משרות…</p>
    ) : jobs.length === 0 ? (
      <p className="text-slate-600">אין משרות עדיין.</p>
    ) : (
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6
                       flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                    ${job.is_open ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}
                  `}
                >
                  {job.is_open ? "פתוחה" : "סגורה"}
                </span>

                <h3 className="text-xl font-bold text-slate-800 truncate">
                  {job.title}
                </h3>
              </div>

              <p className="text-slate-600">
                {job.work_location || "—"} · {job.employment_type || "—"} ·{" "}
                {job.required_experience != null ? `${job.required_experience}y exp` : "ניסיון לא צוין"}
              </p>

              {job.required_technologies && (
                <p className="text-slate-600 mt-2">
                  <span className="font-semibold text-slate-700">טכנולוגיות:</span>{" "}
                  {job.required_technologies}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => toggleOpen(job)}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700
                           hover:bg-slate-200 transition"
              >
                {job.is_open ? "סגור" : "פתח"}
              </button>

              <button
                onClick={() => deleteJob(job.id)}
                className="px-3 py-2 rounded-xl bg-rose-600 text-white
                           hover:bg-rose-700 transition"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);}

