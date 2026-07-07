import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { ArrowRight } from "@phosphor-icons/react";

export default function Internships() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/public/internships").then((r) => setItems(r.data)); }, []);
  return (
    <div>
      <SEO title="Internships — Brevitus Technology" description="Live internship opportunities with our hiring network." />
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Internships</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Learn by doing.</h1>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {items.length === 0 && <div className="text-center text-slate-500 py-16">No open internships right now. Follow us to be notified.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it) => (
            <div key={it.id} className="p-6 rounded-2xl bg-white border border-slate-200" data-testid={`internship-${it.id}`}>
              <div className="font-heading text-xl font-bold text-slate-900">{it.title}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {it.duration && <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">⏱ {it.duration}</span>}
                {it.stipend && <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">{it.stipend}</span>}
              </div>
              <p className="text-sm text-slate-600 mt-3">{it.description}</p>
              {it.apply_link && <a href={it.apply_link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700">Apply <ArrowRight size={14} /></a>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
