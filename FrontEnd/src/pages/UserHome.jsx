// 📁 src/pages/UserHome.jsx
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "המועמדויות שלי 📄",
      desc: "צפה ונהל את כל המשרות שהגשת אליהן",
      color: "from-purple-400 to-pink-500",
      onClick: () => navigate("/my-applications"),
    },
    {
      title: "המגייסים שלי 👥",
      desc: "נהל את הקשר שלך עם המגייסים במערכת",
      color: "from-green-400 to-blue-500",
      onClick: () => navigate("/recruiters"),
    },
    {
      title: "משרות פתוחות 📢",
      desc: "צפה בכל המשרות הפתוחות והגש מועמדות",
      color: "from-yellow-400 to-red-300",
      onClick: () => navigate("/jobs-feed"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-blue-300 p-10">
      <h1 className="text-4xl font-assistant text-gray-800 text-center mb-12">
        Welcome to DevSecJobs! 🚀
      </h1>

      {/* שלוש כרטיסיות יפות */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={card.onClick}
            className={`cursor-pointer bg-gradient-to-r ${card.color} rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition p-8 text-white`}
          >
            <h2 className="text-2xl font-bold mb-3">{card.title}</h2>
            <p className="text-white/90">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
