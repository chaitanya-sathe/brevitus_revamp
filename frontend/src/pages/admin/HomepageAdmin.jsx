import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card, Btn, Input, Textarea, Field, ImageInput } from "@/components/admin/AdminUtils";
import { Plus, X } from "@phosphor-icons/react";

export default function HomepageAdmin() {
  const [h, setH] = useState(null);

  useEffect(() => { api.get("/admin/homepage").then((r) => setH(r.data || {})); }, []);

  if (!h) return <div className="text-zinc-500">Loading…</div>;

  const set = (k, v) => setH({ ...h, [k]: v });

  async function save() {
    try {
      const { data } = await api.put("/admin/homepage", h);
      setH(data);
      toast.success("Homepage saved");
    } catch (e) { toast.error("Save failed"); }
  }

  return (
    <div className="space-y-5" data-testid="homepage-editor">
      <Card className="p-6 space-y-4">
        <div className="font-heading text-lg font-bold">Hero</div>
        <Field label="Hero heading"><Input value={h.hero_heading} onChange={(v) => set("hero_heading", v)} testid="hero-heading" /></Field>
        <Field label="Hero subheading"><Textarea value={h.hero_subheading} onChange={(v) => set("hero_subheading", v)} /></Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Primary CTA text"><Input value={h.hero_cta_primary} onChange={(v) => set("hero_cta_primary", v)} /></Field>
          <Field label="Secondary CTA text"><Input value={h.hero_cta_secondary} onChange={(v) => set("hero_cta_secondary", v)} /></Field>
        </div>
        <Field label="Hero image"><ImageInput value={h.hero_image} onChange={(v) => set("hero_image", v)} /></Field>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-heading text-lg font-bold">Stats</div>
          <Btn variant="secondary" onClick={() => set("stats", [...(h.stats || []), { label: "", value: "" }])}>+ Add stat</Btn>
        </div>
        <div className="space-y-2">
          {(h.stats || []).map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <Input value={s.value} onChange={(v) => set("stats", h.stats.map((x, k) => k === i ? { ...x, value: v } : x))} placeholder="Value (e.g. 2,400+)" />
              <div className="md:col-span-3">
                <Input value={s.label} onChange={(v) => set("stats", h.stats.map((x, k) => k === i ? { ...x, label: v } : x))} placeholder="Label" />
              </div>
              <Btn variant="danger" onClick={() => set("stats", h.stats.filter((_, k) => k !== i))}>Remove</Btn>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <Field label="'What we do' section heading"><Input value={h.what_we_do_heading} onChange={(v) => set("what_we_do_heading", v)} /></Field>
        <div className="flex items-center justify-between">
          <div className="font-heading text-lg font-bold">Feature items</div>
          <Btn variant="secondary" onClick={() => set("what_we_do_items", [...(h.what_we_do_items || []), { title: "", description: "", icon: "Target" }])}>+ Add</Btn>
        </div>
        <div className="space-y-3">
          {(h.what_we_do_items || []).map((it, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
              <div className="md:col-span-3"><Input value={it.icon} onChange={(v) => set("what_we_do_items", h.what_we_do_items.map((x, k) => k === i ? { ...x, icon: v } : x))} placeholder="Icon: Target/Handshake/Briefcase/Rocket" /></div>
              <div className="md:col-span-3"><Input value={it.title} onChange={(v) => set("what_we_do_items", h.what_we_do_items.map((x, k) => k === i ? { ...x, title: v } : x))} placeholder="Title" /></div>
              <div className="md:col-span-5"><Textarea rows={2} value={it.description} onChange={(v) => set("what_we_do_items", h.what_we_do_items.map((x, k) => k === i ? { ...x, description: v } : x))} placeholder="Description" /></div>
              <div className="md:col-span-1"><Btn variant="danger" onClick={() => set("what_we_do_items", h.what_we_do_items.filter((_, k) => k !== i))}>×</Btn></div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-heading text-lg font-bold">FAQs</div>
          <Btn variant="secondary" onClick={() => set("faqs", [...(h.faqs || []), { question: "", answer: "" }])}>+ Add FAQ</Btn>
        </div>
        <div className="space-y-2">
          {(h.faqs || []).map((f, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-start">
              <Input value={f.question} onChange={(v) => set("faqs", h.faqs.map((x, k) => k === i ? { ...x, question: v } : x))} placeholder="Question" />
              <div className="md:col-span-3"><Textarea rows={2} value={f.answer} onChange={(v) => set("faqs", h.faqs.map((x, k) => k === i ? { ...x, answer: v } : x))} placeholder="Answer" /></div>
              <Btn variant="danger" onClick={() => set("faqs", h.faqs.filter((_, k) => k !== i))}>Remove</Btn>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Btn onClick={save} testid="save-homepage">Save homepage</Btn>
      </div>
    </div>
  );
}
