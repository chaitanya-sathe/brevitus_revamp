import { WhatsappLogo, Sparkle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function StickyCTA({ whatsappNumber }) {
  const number = (whatsappNumber || "").replace(/[^0-9]/g, "");
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3" data-testid="sticky-cta">
      {number && (
        <a
          href={`https://wa.me/${number}?text=Hi%20Brevitus%2C%20I%27d%20like%20to%20know%20more%20about%20your%20courses.`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="whatsapp-cta"
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white font-semibold text-sm transition"
        >
          <WhatsappLogo size={20} weight="fill" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      )}
      <Link
        to="/admission"
        data-testid="book-demo-cta"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-brand-gradient shadow-lg shadow-purple-600/30 text-white font-semibold text-sm hover:opacity-95 transition"
      >
        <Sparkle size={18} weight="fill" />
        <span>Book Free Demo</span>
      </Link>
    </div>
  );
}
