import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-slate-50">
      <SEO title="404 — Not found | Brevitus" description="Page not found." />
      <div className="font-heading text-8xl font-bold text-gradient-brand">404</div>
      <h1 className="mt-4 font-heading text-3xl font-bold text-slate-900">This page took a wrong turn.</h1>
      <Link to="/" className="mt-6 px-5 py-2.5 rounded-full bg-brand-gradient text-white font-semibold text-sm">Back home</Link>
    </div>
  );
}
