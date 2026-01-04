import { useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [name, setName] = useState(user?.username || "");
  const [languages, setLanguages] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [flagshipProject, setFlagshipProject] = useState("");
  const [lastJob, setLastJob] = useState("");
  const [education, setEducation] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [resumePath, setResumePath] = useState("");

  const [loading, setLoading] = useState(false);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(
        `/applicants/${user.applicant_id}`, // ⚡ צריך להתאים לנתיב אצלך בבקאנד
        {
          name,
          languages,
          technologies,
          flagship_project: flagshipProject,
          last_job: lastJob,
          education,
          years_experience: parseInt(yearsExperience, 10) || 0,
          resume_path: resumePath,
        },
        { headers: authHeader }
      );

      alert("הפרופיל עודכן בהצלחה ✅");
      navigate("/user-home"); // אחרי שמילא עוברים לפיד
    } catch (err) {
      console.error("שגיאה בעדכון פרופיל:", err);
      alert("שגיאה בעדכון פרופיל ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          השלמת פרופיל מועמד 👤
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              שם מלא
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              שפות תכנות
            </label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="Python, JavaScript, Go..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              טכנולוגיות
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="AWS, Docker, Kubernetes..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              פרויקט דגל
            </label>
            <input
              type="text"
              value={flagshipProject}
              onChange={(e) => setFlagshipProject(e.target.value)}
              placeholder="פרויקט מיוחד שאתה גאה בו"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              מקום עבודה אחרון
            </label>
            <input
              type="text"
              value={lastJob}
              onChange={(e) => setLastJob(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              השכלה
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              שנות ניסיון
            </label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              קובץ קו"ח (נתיב/URL)
            </label>
            <input
              type="text"
              value={resumePath}
              onChange={(e) => setResumePath(e.target.value)}
              placeholder="למשל: uploads/resume.pdf"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "שומר..." : "שמור פרופיל"}
        </button>
      </form>
    </div>
  );
}
