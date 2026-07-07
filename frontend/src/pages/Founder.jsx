import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";

export default function Founder() {
  const [founder, setFounder] = useState(null);
  useEffect(() => {
    api.get("/public/team").then((r) => {
      const list = Array.isArray(r?.data) ? r.data : [];
      setFounder(list.find((m) => m.is_founder) || list[0] || null);
    }).catch(() => {});
  }, []);
  if (!founder) return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-slate-500">Loading…</div>;
  return (
    <div>
      <SEO title={`${founder.name} — Founder | Brevitus Technology`} description={founder.bio} />
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-24 grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-2">
          <div className="aspect-square rounded-3xl bg-brand-gradient flex items-center justify-center text-white font-heading text-6xl font-bold overflow-hidden shadow-xl">
            {founder.photo ? <img src={founder.photo} alt={founder.name} className="w-full h-full object-cover" /> : founder.name?.[0]}
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Founder</div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3">{founder.name}</h1>
          <div className="text-purple-700 text-lg mt-1">{founder.role}</div>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">{founder.bio}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(founder.credentials || []).map((c) => <span key={c} className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-700">{c}</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
