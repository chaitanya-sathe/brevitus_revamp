import { useState } from "react";
import { toast } from "sonner";
import {
  Card, Btn, Input, Textarea, Select, Switch, ImageInput, TagsInput, Field,
  useAdminList, saveItem, deleteItem,
} from "@/components/admin/AdminUtils";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react";

const MODES = ["Online", "Offline", "Hybrid"];

const blankCourse = () => ({
  title: "", slug: "", short_summary: "", long_description: "",
  thumbnail: "", thumbnail_alt: "",
  curriculum: [], tools: [], projects: [],
  duration: "", price: "", mode: "Online", next_batch_date: "",
  seo_title: "", seo_description: "",
  faqs: [], batches: [],
  is_published: true, order: 0,
});

export default function CoursesAdmin() {
  const { items, reload } = useAdminList("/admin/courses");
  const [editing, setEditing] = useState(null);

  async function save() {
    try {
      await saveItem("/admin/courses", editing);
      toast.success("Saved");
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Save failed");
    }
  }
  async function del(id) {
    if (!window.confirm("Delete course?")) return;
    await deleteItem("/admin/courses", id);
    toast.success("Deleted");
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">{items.length} courses</div>
        <Btn onClick={() => setEditing(blankCourse())} testid="new-course"><Plus size={14} className="inline mr-1" /> New Course</Btn>
      </div>

      <Card>
        <div className="divide-y divide-[#1f1f22]" data-testid="courses-list">
          {items.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02]">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{c.title} <span className="text-zinc-500 font-normal">· {c.mode} · {c.duration}</span></div>
                <div className="text-xs text-zinc-500">/{c.slug} {c.is_published ? "" : " · draft"}</div>
              </div>
              <div className="text-sm text-purple-300 font-mono">{c.price}</div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(c)} data-testid={`edit-${c.id}`} className="p-2 rounded hover:bg-white/10 text-purple-300"><PencilSimple size={16} /></button>
                <button onClick={() => del(c.id)} data-testid={`delete-${c.id}`} className="p-2 rounded hover:bg-white/10 text-red-300"><Trash size={16} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="p-8 text-center text-zinc-500 text-sm">No courses yet.</div>}
        </div>
      </Card>

      {editing && (
        <CourseFormModal course={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function CourseFormModal({ course, onChange, onSave, onClose }) {
  const c = course;
  const set = (k, v) => onChange({ ...c, [k]: v });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-3xl bg-[#111114] border border-[#27272a] rounded-t-2xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto admin-scrollbar" data-testid="course-form">
        <div className="flex items-center justify-between mb-6">
          <div className="font-heading text-2xl font-bold">{c.id ? "Edit Course" : "New Course"}</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title"><Input value={c.title} onChange={(v) => set("title", v)} testid="field-title" /></Field>
            <Field label="Slug (optional)"><Input value={c.slug} onChange={(v) => set("slug", v)} placeholder="auto-generated from title" testid="field-slug" /></Field>
          </div>
          <Field label="Short summary"><Textarea value={c.short_summary} onChange={(v) => set("short_summary", v)} rows={2} testid="field-short-summary" /></Field>
          <Field label="Long description"><Textarea value={c.long_description} onChange={(v) => set("long_description", v)} rows={5} testid="field-long-desc" /></Field>
          <Field label="Thumbnail"><ImageInput value={c.thumbnail} onChange={(v) => set("thumbnail", v)} testid="field-thumb" /></Field>
          <Field label="Thumbnail alt text"><Input value={c.thumbnail_alt} onChange={(v) => set("thumbnail_alt", v)} /></Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Duration"><Input value={c.duration} onChange={(v) => set("duration", v)} placeholder="e.g. 6 months" /></Field>
            <Field label="Price"><Input value={c.price} onChange={(v) => set("price", v)} placeholder="e.g. ₹49,999" /></Field>
            <Field label="Mode"><Select value={c.mode} onChange={(v) => set("mode", v)} options={MODES} /></Field>
          </div>
          <Field label="Next batch date"><Input value={c.next_batch_date} onChange={(v) => set("next_batch_date", v)} placeholder="YYYY-MM-DD" /></Field>

          <Field label="Curriculum (modules)"><TagsInput value={c.curriculum} onChange={(v) => set("curriculum", v)} testid="curriculum" /></Field>
          <Field label="Tools"><TagsInput value={c.tools} onChange={(v) => set("tools", v)} testid="tools" /></Field>
          <Field label="Projects"><TagsInput value={c.projects} onChange={(v) => set("projects", v)} testid="projects" /></Field>

          <FAQsField value={c.faqs} onChange={(v) => set("faqs", v)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="SEO Title"><Input value={c.seo_title} onChange={(v) => set("seo_title", v)} /></Field>
            <Field label="SEO Description"><Input value={c.seo_description} onChange={(v) => set("seo_description", v)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort order"><Input type="number" value={c.order} onChange={(v) => set("order", Number(v))} /></Field>
            <Field label="Published?"><Switch checked={!!c.is_published} onChange={(v) => set("is_published", v)} testid="publish-toggle" /></Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 sticky bottom-0 pt-4 bg-[#111114]">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={onSave} testid="save-course">Save Course</Btn>
        </div>
      </div>
    </div>
  );
}

function FAQsField({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <Field label="FAQs">
      <div className="space-y-2">
        {list.map((f, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-start">
            <Input value={f.question} onChange={(v) => onChange(list.map((x, k) => k === i ? { ...x, question: v } : x))} placeholder="Question" />
            <div className="md:col-span-3">
              <Textarea rows={2} value={f.answer} onChange={(v) => onChange(list.map((x, k) => k === i ? { ...x, answer: v } : x))} placeholder="Answer" />
            </div>
            <Btn variant="danger" onClick={() => onChange(list.filter((_, k) => k !== i))}>Remove</Btn>
          </div>
        ))}
        <Btn variant="secondary" onClick={() => onChange([...list, { question: "", answer: "" }])}>+ Add FAQ</Btn>
      </div>
    </Field>
  );
}
