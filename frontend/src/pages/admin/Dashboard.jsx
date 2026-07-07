import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/admin/AdminUtils";
import { Link } from "react-router-dom";
import {
  UserList, GraduationCap, Article, TrendUp, ArrowRight,
} from "@phosphor-icons/react";

export default function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/admin/dashboard").then((r) => setD(r.data)); }, []);
  if (!d) return <div className="text-zinc-500">Loading…</div>;

  const stats = [
    { label: "Total Leads", value: d.total_leads, Icon: UserList, color: "text-purple-400" },
    { label: "New Leads", value: d.new_leads, Icon: TrendUp, color: "text-emerald-400" },
    { label: "This week", value: d.week_leads, Icon: TrendUp, color: "text-blue-400" },
    { label: "Courses", value: d.total_courses, Icon: GraduationCap, color: "text-amber-400" },
    { label: "Blog Posts", value: d.total_blogs, Icon: Article, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-6" data-testid="dashboard">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(({ label, value, Icon, color }) => (
          <Card key={label} className="p-5">
            <div className={`${color}`}><Icon size={22} weight="duotone" /></div>
            <div className="font-heading text-3xl font-bold mt-3">{value}</div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-heading text-lg font-bold">Recent Leads</div>
          <Link to="/admin/leads" data-testid="see-leads" className="text-sm text-purple-400 flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 text-xs uppercase tracking-widest">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Course</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">When</th>
              </tr>
            </thead>
            <tbody>
              {(d.recent_leads || []).map((l) => (
                <tr key={l.id} className="border-t border-[#1f1f22]">
                  <td className="py-2.5 pr-4">{l.full_name}</td>
                  <td className="py-2.5 pr-4 text-zinc-400">{l.email}</td>
                  <td className="py-2.5 pr-4 text-zinc-400">{l.course_interested}</td>
                  <td className="py-2.5 pr-4"><span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs">{l.status}</span></td>
                  <td className="py-2.5 pr-4 text-zinc-500 text-xs">{(l.created_at || "").slice(0, 16).replace("T", " ")}</td>
                </tr>
              ))}
              {(d.recent_leads || []).length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-500">No leads yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
