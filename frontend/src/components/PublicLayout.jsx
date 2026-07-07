import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import StickyCTA from "./StickyCTA";
import { api } from "@/lib/api";

export default function PublicLayout() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    api.get("/public/settings").then((r) => setSettings(r.data || {})).catch(() => {});
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header settings={settings} />
      <main className="flex-1">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
      <StickyCTA whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
