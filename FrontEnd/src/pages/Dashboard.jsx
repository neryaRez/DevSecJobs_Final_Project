// 📁 src/pages/Dashboard.jsx

import {useNavigate} from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  const cards = [
    {
      title: "המשרות שלי",
      description: "צפה ונהל את כל המשרות שפרסמת במערכת",
      link: "/dashboard/jobs",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "מועמדויות שהוגשו",
      description: "בדוק מי הגיש מועמדות למשרות שלך ונהל את הסטטוס",
      link: "/dashboard/applications",
      color: "from-green-400 to-green-700",
    },
    {
      title: "מאגר מועמדים",
      description: "גישה לרשימת מועמדים פוטנציאליים במערכת",
      link: "/dashboard/applicants",
      color: "from-pink-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-sky-600 to-green-400 p-10 flex flex-col items-center">
      {/* כותרת גדולה ובולטת */}
      <h1 className="text-5xl font-assistant text-white  drop-shadow-xl mb-12">
        <br />
        Dashboard Manager 📊
      </h1>
     


      {/* רשת הכרטיסים */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-r ${card.color} text-white rounded-2xl shadow-xl p-8 hover:scale-105 hover:shadow-2xl transition cursor-pointer`}
            onClick={() => navigate(card.link)}
          >
            <h2 className="text-2xl font-bold mb-3">{card.title}</h2>
            <p className="text-white/90">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
