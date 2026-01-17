// 📁 src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import UserHome from "./pages/UserHome.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx"; // ניצור בקרוב דשבורד בסיסי
import Register from "./pages/Register.jsx";
import Jobs from "./pages/jobs.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import JobsFeed from "./pages/JobsFeed.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import DashboardApplications from "./pages/DashboardApplications.jsx";
import DashboardApplicants from "./pages/DashboardApplicants.jsx";
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* מסך הבית הציבורי */}
        <Route path="/" element={<LandingPage />} />

        {/* דפי התחברות */}
        <Route path="/login" element={<Login />} />

        {/* דף בית של משתמש מחובר (User) */}
        <Route
          path="/user-home"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />

        {/* דשבורד של אדמין */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* אם מגיעים לנתיב לא קיים */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/jobs" element={<ProtectedRoute adminOnly><Jobs /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="/jobs-feed" element={<JobsFeed />} />
        <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path="/dashboard/applications" element={<ProtectedRoute adminOnly><DashboardApplications /></ProtectedRoute>} />
        <Route path="/dashboard/applicants" element={<ProtectedRoute adminOnly><DashboardApplicants /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 via-indigo-500 p-4">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
        Welcome to DevSecJobs!
      </h1>
      <h2 className="text-2xl font-semibold text-white drop-shadow-md mt-6">
        הדרך שלך להצליח !
      </h2>
      <p className="text-2xl text-white drop-shadow-sm mt-4">
        מחוייבים אליך לאורך כל הדרך ואוהבים אותך ❤️
      </p>
    </div>
  );
}
