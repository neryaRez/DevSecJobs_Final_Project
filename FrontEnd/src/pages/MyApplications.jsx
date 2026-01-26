import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageShell from "../components/ui/PageShell";
import Card, { CardHeader, CardContent } from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";


export default function MyApplications() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // טעינת המועמדויות
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await api.get(`/apply/user/${user.id}`, { headers: authHeader });
        setApplications(res.data || []);
      } catch (err) {
        console.error("שגיאה בטעינת מועמדויות:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <PageShell
      title="My Applications"
      subtitle="Track the status of jobs you've applied to."
    >
      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app._id}>
            <CardHeader className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{app.jobTitle}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {app.companyName}
                </div>
              </div>

              <StatusBadge value={app.status} />
            </CardHeader>

            <CardContent>
              <div className="text-sm text-slate-700">
                Applied on: {app.createdAtReadable}
              </div>

              {/* אם יש לך כפתורים/פעולות – נשאיר, רק יפים יותר */}
              <div className="mt-4 flex gap-2">
                <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                  View Job
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
