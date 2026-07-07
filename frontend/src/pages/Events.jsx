import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { CalendarBlank, MapPin, ArrowRight } from "@phosphor-icons/react";

export default function Events() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/public/events").then((r) => setItems(r.data)); }, []);
  return (
    <div>
      <SEO title="Events — Brevitus Technology" description="Workshops, hackathons, and community events." />
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Events</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Workshops, hackathons & meets.</h1>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {items.length === 0 && <div className="text-center text-slate-500 py-16">No events posted yet. Check back soon.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((e) => (
            <div key={e.id} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 transition" data-testid={`event-${e.id}`}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-purple-700">
                <CalendarBlank size={14} /> {e.event_date}
              </div>
              <div className="font-heading text-xl font-bold text-slate-900 mt-2">{e.title}</div>
              <p className="text-sm text-slate-600 mt-2">{e.description}</p>
              {e.location && <div className="mt-3 text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {e.location}</div>}
              {e.apply_link && <a href={e.apply_link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700">Register <ArrowRight size={14} /></a>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
