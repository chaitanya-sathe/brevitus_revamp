import { Link } from "react-router-dom";
import { InstagramLogo, LinkedinLogo, YoutubeLogo, TwitterLogo } from "@phosphor-icons/react";

export default function Footer({ settings }) {
  const s = settings || {};
  return (
    <footer data-testid="site-footer" className="mt-24 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-heading font-bold">B</div>
            <span className="font-heading text-xl font-bold text-white">Brevitus Technology</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {s.site_tagline || "Master AI, Data & Analytics. Job-ready programs with real mentorship."}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {s.social_linkedin && <a href={s.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><LinkedinLogo size={22} /></a>}
            {s.social_instagram && <a href={s.social_instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><InstagramLogo size={22} /></a>}
            {s.social_youtube && <a href={s.social_youtube} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><YoutubeLogo size={22} /></a>}
            {s.social_twitter && <a href={s.social_twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><TwitterLogo size={22} /></a>}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Programs</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-white">All Courses</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/internships" className="hover:text-white">Internships</Link></li>
            <li><Link to="/success-stories" className="hover:text-white">Success Stories</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/team" className="hover:text-white">Team</Link></li>
            <li><Link to="/founder" className="hover:text-white">Founder</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Get in touch</div>
          <ul className="space-y-2 text-sm text-slate-400">
            {s.contact_email && <li>{s.contact_email}</li>}
            {s.contact_phone && <li>{s.contact_phone}</li>}
            {s.contact_address && <li>{s.contact_address}</li>}
          </ul>
          <Link to="/admission" data-testid="footer-apply-btn" className="mt-5 inline-block px-5 py-2.5 rounded-full bg-brand-gradient text-white font-semibold text-sm">Apply Now</Link>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Brevitus Technology. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" data-testid="footer-admin-link" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
