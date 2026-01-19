import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "המשרות שלי", description: "צפה ונהל את כל המשרות שפרסמת במערכת", link: "/dashboard/jobs", color: "from-blue-500 to-purple-600" },
    { title: "מועמדויות שהוגשו", description: "בדוק מי הגיש מועמדות למשרות שלך ונהל את הסטטוס", link: "/dashboard/applications", color: "from-green-400 to-green-700" },
    { title: "מאגר מועמדים", description: "גישה לרשימת מועמדים פוטנציאליים במערכת", link: "/dashboard/applicants", color: "from-pink-500 to-purple-500" },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-5xl font-assistant text-stone-900 drop-shadow-xl mb-10 text-right">
        Dashboard Manager 📊
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.link)}
            className="text-right bg-white border border-slate-200
                      rounded-2xl shadow-sm p-8
                      hover:shadow-md hover:border-amber-300
                      transition"
          >
            <h2 className="text-xl font-bold text-amber-700 mb-3">
              {card.title}
            </h2>
            <p className="text-slate-600">
              {card.description}
            </p>
          </button>
        ))}
      </div>

    </div>
  );
}
