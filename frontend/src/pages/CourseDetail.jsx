import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { CheckCircle, Wrench, Briefcase, CalendarCheck, ArrowRight, GraduationCap } from "@phosphor-icons/react";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    api.get(`/public/courses/${slug}`).then((r) => setCourse(r.data)).catch(() => setError(true));
  }, [slug]);

  if (error) return <div className="mx-auto max-w-4xl px-6 py-24 text-center"><h1 className="font-heading text-4xl">Course not found</h1><Link to="/courses" className="mt-4 inline-block text-purple-700 underline">Back to courses</Link></div>;
  if (!course) return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-slate-500">Loading…</div>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.short_summary || course.long_description,
    "provider": { "@type": "Organization", "name": "Brevitus Technology" },
  };

  return (
    <div>
      <SEO title={course.seo_title || `${course.title} — Brevitus`} description={course.seo_description || course.short_summary} jsonLd={jsonLd} image={course.thumbnail} />

      <section className="mx-auto max-w-7xl px-6 pt-14 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <div className="text-xs uppercase tracking-widest font-bold text-purple-700">{course.mode} Program</div>
          <h1 data-testid="course-title" className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3 leading-[1.05]">{course.title}</h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">{course.short_summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {course.duration && <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-sm">⏱ {course.duration}</span>}
            {course.price && <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 font-semibold text-sm">{course.price}</span>}
            {course.next_batch_date && <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm">Next batch: {course.next_batch_date}</span>}
          </div>
          <div className="mt-8">
            <Link to={`/admission?course=${encodeURIComponent(course.title)}`} data-testid="course-apply-btn" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-gradient text-white font-semibold shadow-lg shadow-purple-500/30">
              Apply Now <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-900 to-purple-700 flex items-center justify-center overflow-hidden shadow-xl">
            {course.thumbnail ? <img src={course.thumbnail} alt={course.thumbnail_alt || course.title} className="w-full h-full object-cover" /> : <GraduationCap size={80} weight="duotone" className="text-white/70" />}
          </div>
        </div>
      </section>

      {course.long_description && (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-lg text-slate-700 leading-relaxed">{course.long_description}</p>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {course.curriculum?.length > 0 && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-purple-700 mb-4"><CheckCircle size={22} weight="duotone" /><span className="text-xs uppercase tracking-widest font-bold">Curriculum</span></div>
            <ul className="space-y-2 text-sm text-slate-700">
              {course.curriculum.map((m, i) => (<li key={i} className="flex gap-2"><span className="text-purple-600">→</span>{m}</li>))}
            </ul>
          </div>
        )}
        {course.tools?.length > 0 && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-purple-700 mb-4"><Wrench size={22} weight="duotone" /><span className="text-xs uppercase tracking-widest font-bold">Tools</span></div>
            <div className="flex flex-wrap gap-2">
              {course.tools.map((t) => <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs">{t}</span>)}
            </div>
          </div>
        )}
        {course.projects?.length > 0 && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-purple-700 mb-4"><Briefcase size={22} weight="duotone" /><span className="text-xs uppercase tracking-widest font-bold">Projects</span></div>
            <ul className="space-y-2 text-sm text-slate-700">
              {course.projects.map((p, i) => (<li key={i} className="flex gap-2"><span className="text-purple-600">✦</span>{p}</li>))}
            </ul>
          </div>
        )}
      </section>

      {course.faqs?.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">Course FAQs</h2>
          <div className="space-y-3">
            {course.faqs.map((f, i) => (
              <details key={i} className="group p-5 rounded-2xl bg-white border border-slate-200">
                <summary className="cursor-pointer flex items-center justify-between font-heading font-bold text-slate-900">{f.question}<span className="text-purple-600 group-open:rotate-45 transition text-2xl leading-none">+</span></summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-brand-gradient p-10 md:p-14 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold opacity-80"><CalendarCheck size={14} className="inline" /> Next batch {course.next_batch_date || "opening soon"}</div>
            <h3 className="font-heading text-3xl md:text-4xl font-bold mt-2">Reserve your seat in {course.title}</h3>
          </div>
          <Link to={`/admission?course=${encodeURIComponent(course.title)}`} data-testid="course-cta-bottom" className="px-6 py-3 rounded-full bg-white text-purple-800 font-semibold">Apply Now</Link>
        </div>
      </section>
    </div>
  );
}
