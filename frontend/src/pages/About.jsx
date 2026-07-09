import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <SEO title="About — Brevitus Technology" description="Our mission, story and belief system." />
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">About Brevitus</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Education that ships careers.</h1>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
         Brevitus Technology is a leading technology, training, and career development company specializing in Data Science, Artificial Intelligence (AI), Machine Learning, Deep Learning, Generative AI, Agentic AI, Data Analytics, Business Analytics, Python Programming, SQL, Power BI, and Tableau. In addition to industry-focused training and IT placement assistance, we provide professional website development, web application development, mobile app development, AI solutions, data analytics solutions, and custom software development services. Through hands-on learning, real-world projects, mentorship, career guidance, resume building, interview preparation, and technology consulting, we help students, professionals, startups, and businesses accelerate growth, innovation, and digital transformation.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { t: "Outcomes over vanity", d: "We measure ourselves on placements and salary hikes, not enrollments." },
            { t: "Small, guided cohorts", d: "Mentorship stays personal. No 1,000-student webinars." },
            { t: "Portfolio-first", d: "Every module ends in a project you can defend in an interview." },
          ].map((p) => (
            <div key={p.t} className="p-6 rounded-2xl bg-white border border-slate-200">
              <div className="font-heading text-xl font-bold text-slate-900">{p.t}</div>
              <p className="text-sm text-slate-600 mt-2">{p.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-brand-gradient text-white">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Learn with us next.</h2>
          <p className="mt-2 opacity-90">Book a free demo to explore fit.</p>
          <Link to="/admission" className="mt-5 inline-block px-5 py-2.5 rounded-full bg-white text-purple-800 font-semibold text-sm" data-testid="about-apply">Book Free Demo</Link>
        </div>
      </section>
    </div>
  );
}
