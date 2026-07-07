import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, safeList } from "@/lib/api";
import SEO from "@/components/SEO";
import { ArrowRight } from "@phosphor-icons/react";

export default function Blogs() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/public/blogs").then(safeList(setItems)).catch(() => {}); }, []);
  const list = Array.isArray(items) ? items : [];
  return (
    <div>
      <SEO title="Blog — Brevitus Technology" description="Insights on AI, Data Science, Analytics, and modern careers." />
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Journal</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Insights, stories & how-tos.</h1>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="blog-grid">
          {list.map((b) => (
            <Link key={b.id} to={`/blog/${b.slug}`} data-testid={`blog-card-${b.slug}`} className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
              <div className="aspect-[16/9] bg-gradient-to-br from-purple-500 to-blue-800 flex items-center justify-center text-white font-heading text-xl overflow-hidden">
                {b.cover_image ? <img src={b.cover_image} alt={b.cover_alt || b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : b.category}
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest font-bold text-purple-700">{b.category}</div>
                <div className="font-heading font-bold text-xl text-slate-900 mt-2 group-hover:text-purple-700">{b.title}</div>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">{b.excerpt}</p>
                <div className="mt-4 text-sm font-semibold text-purple-700 flex items-center gap-1">Read <ArrowRight size={14} /></div>
              </div>
            </Link>
          ))}
          {list.length === 0 && <div className="col-span-3 text-slate-500 text-center py-12">No blog posts yet.</div>}
        </div>
      </section>
    </div>
  );
}
