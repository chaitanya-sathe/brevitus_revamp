import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { CheckCircle } from "@phosphor-icons/react";

const STATUS_OPTIONS = ["Student", "Fresher", "Working Professional"];
const MODE_OPTIONS = ["Online", "Offline", "Hybrid"];

export default function Admission() {
  const [params] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    current_status: STATUS_OPTIONS[0],
    college_or_company: "",
    course_interested: params.get("course") || "",
    preferred_mode: MODE_OPTIONS[0],
    message: "",
    honeypot: "",
  });

  useEffect(() => {
    api.get("/public/courses").then((r) => {
      setCourses(r.data || []);
      if (!form.course_interested && r.data?.length) {
        setForm((f) => ({ ...f, course_interested: r.data[0].title }));
      }
    });
    // eslint-disable-next-line
  }, []);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.course_interested) {
      toast.error("Please fill Name, Email, Phone and Course.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/leads", form);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-24 text-center" data-testid="admission-success">
        <SEO title="Application received — Brevitus Technology" description="We've received your enquiry." />
        <div className="inline-flex w-20 h-20 rounded-full bg-emerald-100 items-center justify-center text-emerald-600">
          <CheckCircle size={44} weight="fill" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-6">Application received!</h1>
        <p className="mt-4 text-slate-600">Our team will reach out to you on <b>{form.email}</b> or <b>{form.phone}</b> within 24 hours.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/courses" className="px-5 py-2.5 rounded-full bg-brand-gradient text-white font-semibold text-sm">Explore more courses</Link>
          <Link to="/" className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-sm">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO title="Apply — Admission | Brevitus Technology" description="Book a free demo or apply to a Brevitus program." />
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Apply</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Book a free demo.</h1>
        <p className="mt-4 text-slate-600 max-w-2xl">Tell us a bit about yourself and we'll design the right learning path for you.</p>

        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm" data-testid="admission-form">
          <input type="text" name="website" value={form.honeypot} onChange={(e) => update("honeypot", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

          <FormField label="Full Name*"><input required data-testid="field-name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputCls} /></FormField>
          <FormField label="Email*"><input required type="email" data-testid="field-email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} /></FormField>
          <FormField label="Phone / WhatsApp*"><input required type="tel" data-testid="field-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} /></FormField>
          <FormField label="Current Status*">
            <select data-testid="field-status" value={form.current_status} onChange={(e) => update("current_status", e.target.value)} className={inputCls}>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="College / Company"><input data-testid="field-college" value={form.college_or_company} onChange={(e) => update("college_or_company", e.target.value)} className={inputCls} /></FormField>
          <FormField label="Course Interested*">
            <select data-testid="field-course" value={form.course_interested} onChange={(e) => update("course_interested", e.target.value)} className={inputCls}>
              {courses.map((c) => <option key={c.id}>{c.title}</option>)}
            </select>
          </FormField>
          <FormField label="Preferred Mode*">
            <select data-testid="field-mode" value={form.preferred_mode} onChange={(e) => update("preferred_mode", e.target.value)} className={inputCls}>
              {MODE_OPTIONS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Message (optional)"><textarea rows={4} data-testid="field-message" value={form.message} onChange={(e) => update("message", e.target.value)} className={inputCls} placeholder="Tell us your goals, background, or questions." /></FormField>
          </div>

          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <div className="text-xs text-slate-500">By submitting you agree to be contacted by Brevitus Technology.</div>
            <button type="submit" disabled={submitting} data-testid="submit-admission" className="px-6 py-3 rounded-full bg-brand-gradient text-white font-semibold shadow-lg shadow-purple-500/30 disabled:opacity-60">
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-purple-500";

function FormField({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1.5">{label}</div>
      {children}
    </label>
  );
}
