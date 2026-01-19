import { Outlet, useNavigate } from "react-router-dom";

export default function ManagerLayout() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-purple-600 via-sky-600 to-green-400"
    >
      <div className="p-10">
        {/* Top bar כללי למנהל */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/15 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-white/20 transition"
          >
            ← חזרה
          </button>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-assistant text-white drop-shadow-xl">
              Manager Area
            </div>
            <div className="text-white/80 mt-1">
              ניהול משרות · מועמדים · מועמדויות
            </div>
          </div>

          <div className="w-[90px]" />
        </div>

        {/* תוכן העמודים של המנהל יושב כאן */}
        <div className="max-w-6xl mx-auto bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
