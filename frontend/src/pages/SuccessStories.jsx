import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { Star, Quotes } from "@phosphor-icons/react";

export default function SuccessStories() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => { api.get("/public/testimonials").then((r) => setTestimonials(r.data)); }, []);
  return (
    <div>
      <SEO title="Success Stories — Brevitus Technology" description="Real learners, real placements, real hikes." />
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Placements</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Real careers. Real hikes.</h1>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="stories-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="p-8 rounded-2xl bg-white border border-slate-200" data-testid={`story-${t.id}`}>
              <Quotes size={28} weight="fill" className="text-purple-500" />
              <p className="mt-3 font-heading text-2xl text-slate-900 leading-snug">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-heading font-bold overflow-hidden">
                  {t.photo ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" /> : t.name?.[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}{t.company ? ` · ${t.company}` : ""}</div>
                </div>
                <div className="ml-auto flex text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, k) => <Star key={k} size={14} weight="fill" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
