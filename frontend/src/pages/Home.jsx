import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import {
  ArrowRight, Target, Handshake, Briefcase, Rocket, Star, Sparkle, GraduationCap,
} from "@phosphor-icons/react";

const ICONS = { Target, Handshake, Briefcase, Rocket };

export default function Home() {
  const [homepage, setHomepage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/public/homepage").then((r) => setHomepage(r.data));
    api.get("/public/courses").then((r) => setCourses(r.data));
    api.get("/public/testimonials").then((r) => setTestimonials(r.data));
    api.get("/public/projects").then((r) => setProjects(r.data));
  }, []);

  const h = homepage || {};

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Brevitus Technology",
    "description": h.hero_subheading,
    "url": typeof window !== "undefined" ? window.location.origin : "",
  };

  return (
    <div>
      <SEO
        title="Brevitus Technology — Master AI, Data & Analytics"
        description={h.hero_subheading}
        jsonLd={orgJsonLd}
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-300/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs uppercase tracking-widest font-bold text-purple-700 shadow-sm">
                <Sparkle size={14} weight="fill" /> New Batches • Feb–Mar 2026
              </div>
              <h1 data-testid="hero-heading" className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mt-6 text-slate-900 leading-[1.02]">
                {h.hero_heading || "Master AI, Data & Analytics"}<br />
                <span className="text-gradient-brand">Ship Your Career.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
                {h.hero_subheading || "Job-ready programs, live mentorship, real projects, and a placement network that actually works."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/admission" data-testid="hero-primary-cta" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:opacity-95 transition">
                  {h.hero_cta_primary || "Book Free Demo"} <ArrowRight size={16} weight="bold" />
                </Link>
                <Link to="/courses" data-testid="hero-secondary-cta" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-slate-900 font-semibold text-sm hover:border-purple-500 transition">
                  {h.hero_cta_secondary || "Explore Courses"}
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="hero-stats">
                {(h.stats || []).map((s) => (
                  <div key={s.label}>
                    <div className="font-heading text-3xl md:text-4xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="floaty aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-blue-700 p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
                  {h.hero_image && (
                    <img src={h.hero_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                  )}
                  <GraduationCap size={32} weight="duotone" className="relative" />
                  <div className="relative">
                    <div className="text-xs uppercase tracking-widest opacity-80">Featured</div>
                    <div className="font-heading text-xl font-bold mt-1">Agentic AI</div>
                    <div className="text-sm opacity-90">5-month program</div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-lg">
                  <Star size={28} weight="fill" className="text-amber-400" />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-500">Rated 4.9/5</div>
                    <div className="font-heading text-lg font-bold text-slate-900 mt-1">by 2,400+ learners</div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between shadow-lg col-span-2">
                  <div className="text-xs uppercase tracking-widest text-slate-400">Live Cohorts</div>
                  <div>
                    <div className="font-heading text-2xl md:text-3xl font-bold">92% Placement Rate</div>
                    <div className="text-sm text-slate-400 mt-1">Across 80+ hiring partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Why Brevitus</div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3">
            {h.what_we_do_heading || "How Brevitus is different"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(h.what_we_do_items || []).map((it, idx) => {
            const Icon = ICONS[it.icon] || Target;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-lg transition" data-testid={`feature-${idx}`}>
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Icon size={22} weight="duotone" />
                </div>
                <div className="font-heading text-lg font-bold text-slate-900 mt-4">{it.title}</div>
                <p className="text-sm text-slate-600 mt-2">{it.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Programs</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3">Popular courses</h2>
          </div>
          <Link to="/courses" data-testid="see-all-courses" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-purple-700 hover:text-purple-900">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl mb-10">
            <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Learner projects</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3">Real work, real outcomes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="group rounded-2xl bg-slate-900 text-white shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition overflow-hidden" data-testid={`project-${p.id}`}>
                {p.thumbnail && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={p.thumbnail} alt={p.thumbnail_alt || p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-purple-300 font-bold">{p.category}</div>
                  <div className="font-heading text-lg font-bold mt-2">{p.title}</div>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(p.tech_tags || []).map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-white/10">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl mb-10">
            <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Learner stories</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3">{h.testimonial_heading || "What our learners say"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div key={t.id} className={`p-6 rounded-2xl bg-white border border-slate-200 ${i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`} data-testid={`testimonial-${t.id}`}>
                <div className="flex text-amber-400 mb-3">
                  {Array.from({ length: t.rating || 5 }).map((_, k) => <Star key={k} size={16} weight="fill" />)}
                </div>
                <p className={`${i === 0 ? "text-xl" : "text-base"} font-heading font-medium text-slate-900 leading-snug`}>“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-heading font-bold overflow-hidden">
                    {t.photo ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" /> : t.name?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}{t.company ? ` · ${t.company}` : ""}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {(h.faqs || []).length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-widest font-bold text-purple-700">FAQs</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3">Answers, upfront</h2>
          </div>
          <div className="space-y-3" data-testid="home-faqs">
            {(h.faqs || []).map((f, i) => (
              <details key={i} className="group p-5 rounded-2xl bg-white border border-slate-200 open:border-purple-400 transition">
                <summary className="cursor-pointer flex items-center justify-between font-heading font-bold text-slate-900">
                  {f.question}
                  <span className="text-purple-600 group-open:rotate-45 transition text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 md:p-16 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
          <div className="relative max-w-3xl">
            <h2 className="font-heading text-3xl md:text-5xl font-bold">Ready to change your career trajectory?</h2>
            <p className="mt-4 text-white/85">Book a free demo. No pressure, no fluff — just clarity on what fits you best.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/admission" data-testid="cta-book-demo" className="px-6 py-3 rounded-full bg-white text-purple-800 font-semibold text-sm">Book Free Demo</Link>
              <Link to="/courses" data-testid="cta-explore" className="px-6 py-3 rounded-full border border-white/40 text-white font-semibold text-sm hover:bg-white/10">Explore Courses</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`} data-testid={`course-card-${course.slug}`} className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
      <div className="aspect-[16/9] bg-gradient-to-br from-blue-900 to-purple-700 relative">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.thumbnail_alt || course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={56} weight="duotone" className="text-white/70" />
          </div>
        )}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-bold text-purple-800 uppercase tracking-widest">{course.mode}</div>
      </div>
      <div className="p-6">
        <div className="font-heading font-bold text-xl text-slate-900 group-hover:text-purple-700 transition">{course.title}</div>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{course.short_summary}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          {course.duration && <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">⏱ {course.duration}</span>}
          {course.price && <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">{course.price}</span>}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-purple-700 flex items-center gap-1">Apply Now <ArrowRight size={14} /></span>
        </div>
      </div>
    </Link>
  );
}
