import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { LinkedinLogo } from "@phosphor-icons/react";

export default function Team() {
  const [team, setTeam] = useState([]);
  useEffect(() => { api.get("/public/team").then((r) => setTeam(r.data)); }, []);
  return (
    <div>
      <SEO title="Team — Brevitus Technology" description="Meet the practitioners behind Brevitus Technology." />
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Our people</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Practitioners, not lecturers.</h1>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="team-grid">
          {team.map((m) => (
            <div key={m.id} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 transition" data-testid={`team-${m.id}`}>
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-heading text-xl font-bold overflow-hidden">
                {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> : m.name?.[0]}
              </div>
              <div className="mt-4 font-heading text-xl font-bold text-slate-900">{m.name}</div>
              <div className="text-sm text-purple-700">{m.role}</div>
              <p className="text-sm text-slate-600 mt-3">{m.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(m.credentials || []).map((c) => <span key={c} className="text-[11px] uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-700">{c}</span>)}
              </div>
              {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-purple-700"><LinkedinLogo size={16} /> LinkedIn</a>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
