// 📁 src/pages/Dashboard.jsx
export default function Dashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-gray-600 to-blue-400 p-10 flex flex-col items-center">
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
            onClick={() => (window.location.href = card.link)}
          >
            <h2 className="text-2xl font-bold mb-3">{card.title}</h2>
            <p className="text-white/90">{card.description}</p>
          </div>
        ))}
      </div>

      {/* כפתור צף ליצירת משרה */}
      <button
        onClick={() => alert("פתיחת טופס יצירת משרה חדשה")}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-4xl flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-pink-400/80 transition"
      >
        +
      </button>
    </div>
  );
}
