import { useOutletContext, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react";

export default function Contact() {
  const { settings } = useOutletContext();
  return (
    <div>
      <SEO title="Contact — Brevitus Technology" description="Get in touch with Brevitus Technology." />
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16">
        <div className="text-xs uppercase tracking-widest font-bold text-purple-700">Contact</div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mt-3">Let's build your career.</h1>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings?.contact_email && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <EnvelopeSimple size={24} className="text-purple-700" />
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mt-3">Email</div>
              <a href={`mailto:${settings.contact_email}`} className="mt-1 block font-heading font-bold text-lg text-slate-900 break-all">{settings.contact_email}</a>
            </div>
          )}
          {settings?.contact_phone && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <Phone size={24} className="text-purple-700" />
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mt-3">Phone</div>
              <a href={`tel:${settings.contact_phone}`} className="mt-1 block font-heading font-bold text-lg text-slate-900">{settings.contact_phone}</a>
            </div>
          )}
          {settings?.contact_address && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <MapPin size={24} className="text-purple-700" />
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mt-3">Address</div>
              <div className="mt-1 font-heading font-bold text-lg text-slate-900">{settings.contact_address}</div>
            </div>
          )}
        </div>

        <div className="mt-14 p-10 rounded-3xl bg-brand-gradient text-white text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Prefer a live conversation?</h2>
          <p className="mt-2 opacity-90">Book a free demo and we'll walk you through the right program in 20 minutes.</p>
          <Link to="/admission" data-testid="contact-apply" className="mt-6 inline-block px-6 py-3 rounded-full bg-white text-purple-800 font-semibold">Book Free Demo</Link>
        </div>
      </section>
    </div>
  );
}
