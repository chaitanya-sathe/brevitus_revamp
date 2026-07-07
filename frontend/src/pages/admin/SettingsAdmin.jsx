import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card, Btn, Input, Textarea, Field, ImageInput } from "@/components/admin/AdminUtils";

export default function SettingsAdmin() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/admin/settings").then((r) => setS(r.data || {})); }, []);
  if (!s) return <div className="text-zinc-500">Loading…</div>;
  const set = (k, v) => setS({ ...s, [k]: v });
  async function save() {
    try {
      const { data } = await api.put("/admin/settings", s);
      setS(data); toast.success("Settings saved");
    } catch { toast.error("Save failed"); }
  }
  return (
    <div className="space-y-5" data-testid="settings-editor">
      <Card className="p-6 space-y-4">
        <div className="font-heading text-lg font-bold">Site identity</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site name"><Input value={s.site_name} onChange={(v) => set("site_name", v)} /></Field>
          <Field label="Site tagline"><Input value={s.site_tagline} onChange={(v) => set("site_tagline", v)} /></Field>
        </div>
        <Field label="Logo"><ImageInput value={s.logo} onChange={(v) => set("logo", v)} /></Field>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="font-heading text-lg font-bold">SEO defaults</div>
        <Field label="Default SEO title"><Input value={s.default_seo_title} onChange={(v) => set("default_seo_title", v)} /></Field>
        <Field label="Default SEO description"><Textarea rows={2} value={s.default_seo_description} onChange={(v) => set("default_seo_description", v)} /></Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="GA4 Measurement ID"><Input value={s.ga4_id} onChange={(v) => set("ga4_id", v)} placeholder="G-XXXXXXX" /></Field>
          <Field label="Search Console verification"><Input value={s.gsc_verification} onChange={(v) => set("gsc_verification", v)} /></Field>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="font-heading text-lg font-bold">Contact</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email"><Input value={s.contact_email} onChange={(v) => set("contact_email", v)} /></Field>
          <Field label="Phone"><Input value={s.contact_phone} onChange={(v) => set("contact_phone", v)} /></Field>
          <Field label="Address"><Input value={s.contact_address} onChange={(v) => set("contact_address", v)} /></Field>
          <Field label="WhatsApp number (digits only)"><Input value={s.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} placeholder="919000000000" /></Field>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="font-heading text-lg font-bold">Social</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="LinkedIn URL"><Input value={s.social_linkedin} onChange={(v) => set("social_linkedin", v)} /></Field>
          <Field label="Instagram URL"><Input value={s.social_instagram} onChange={(v) => set("social_instagram", v)} /></Field>
          <Field label="YouTube URL"><Input value={s.social_youtube} onChange={(v) => set("social_youtube", v)} /></Field>
          <Field label="Twitter URL"><Input value={s.social_twitter} onChange={(v) => set("social_twitter", v)} /></Field>
        </div>
      </Card>

      <div className="flex justify-end">
        <Btn onClick={save} testid="save-settings">Save settings</Btn>
      </div>
    </div>
  );
}
