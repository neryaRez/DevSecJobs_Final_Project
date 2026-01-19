import { Outlet, useNavigate } from "react-router-dom";

export default function ManagerLayout() {
  const navigate = useNavigate();

  return (
    <div
         dir="rtl"
        className="min-h-screen bg-gradient-to-b from-amber-100 to-stone-300 text-slate-800"
    >

      <div className="p-10">
        {/* Top bar כללי למנהל */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-10
                bg-white rounded-2xl shadow px-6 py-4">
            <button
                onClick={() => navigate(-1)}
                className="text-amber-700 border border-amber-300 px-4 py-2 rounded-xl
                hover:bg-amber-50 transition"
            >
            ← חזרה
            </button>


        <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-700">
                Manager Area
            </div>
            <div className="text-slate-600 mt-1">
                ניהול משרות · מועמדים · מועמדויות
            </div>
        </div>


          <div className="w-[90px]" />
        </div>

        {/* תוכן העמודים של המנהל יושב כאן */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
                 <Outlet />
        </div>

      </div>
    </div>
  );
}
