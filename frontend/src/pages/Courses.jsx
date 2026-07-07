import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { CourseCard } from "./Home";

export default function Courses() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("All");
  useEffect(() => { api.get("/public/courses").then((r) => setItems(r.data)); }, []);
  const filtered = mode === "All" ? items : items.filter((c) => c.mode === mode);
  const modes = ["All", "Online", "Offline", "Hybrid"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((c, i) => ({
      "@type": "ListItem", "position": i + 1, "url": `${typeof window !== "undefined" ? window.location.origin : ""}/courses/${c.slug}`, "name": c.title,
    })),
  };

  return (
    <div>
      <SEO title="Courses — Brevitus Technology" description="All Brevitus programs: Data Science, AI, Analytics, Python, SQL, Power BI, Tableau." jsonLd={jsonLd} />
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Programs</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Every skill your career needs.</h1>
        <p className="mt-4 text-slate-600 max-w-2xl">Career-oriented, mentor-led programs across AI, Data & Analytics — designed with hiring managers.</p>
      </section>
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-2 mb-8" data-testid="course-mode-filters">
          {modes.map((m) => (
            <button key={m} data-testid={`filter-${m.toLowerCase()}`} onClick={() => setMode(m)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${mode === m ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-purple-500"}`}>{m}</button>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="courses-grid">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
        {filtered.length === 0 && <div className="text-center text-slate-500 py-12">No courses in this mode yet.</div>}
      </section>
    </div>
  );
}
