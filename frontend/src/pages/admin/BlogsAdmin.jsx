import { useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Card, Btn, Input, Textarea, Switch, ImageInput, TagsInput, Field,
  useAdminList, saveItem, deleteItem,
} from "@/components/admin/AdminUtils";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react";

const blankBlog = () => ({
  title: "", slug: "", excerpt: "", content: "",
  cover_image: "", cover_alt: "",
  category: "", tags: [], author: "Brevitus Team",
  seo_title: "", seo_description: "",
  is_published: true,
});

export default function BlogsAdmin() {
  const { items, reload } = useAdminList("/admin/blogs");
  const [editing, setEditing] = useState(null);

  async function save() {
    try {
      await saveItem("/admin/blogs", editing);
      toast.success("Saved");
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Save failed");
    }
  }

  async function del(id) {
    if (!window.confirm("Delete post?")) return;
    await deleteItem("/admin/blogs", id);
    toast.success("Deleted");
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">{items.length} posts</div>
        <Btn onClick={() => setEditing(blankBlog())} testid="new-blog"><Plus size={14} className="inline mr-1" /> New Post</Btn>
      </div>
      <Card>
        <div className="divide-y divide-[#1f1f22]" data-testid="blogs-list">
          {items.map((b) => (
            <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02]">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{b.title} {!b.is_published && <span className="ml-2 text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Draft</span>}</div>
                <div className="text-xs text-zinc-500">/{b.slug} · {b.category}</div>
              </div>
              <button onClick={() => setEditing(b)} data-testid={`edit-${b.id}`} className="p-2 rounded hover:bg-white/10 text-purple-300"><PencilSimple size={16} /></button>
              <button onClick={() => del(b.id)} data-testid={`delete-${b.id}`} className="p-2 rounded hover:bg-white/10 text-red-300"><Trash size={16} /></button>
            </div>
          ))}
          {items.length === 0 && <div className="p-8 text-center text-zinc-500 text-sm">No blog posts yet.</div>}
        </div>
      </Card>

      {editing && <BlogFormModal blog={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BlogFormModal({ blog, onChange, onSave, onClose }) {
  const b = blog;
  const set = (k, v) => onChange({ ...b, [k]: v });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-4xl bg-[#111114] border border-[#27272a] rounded-t-2xl md:rounded-2xl p-6 max-h-[92vh] overflow-y-auto admin-scrollbar" data-testid="blog-form">
        <div className="flex items-center justify-between mb-6">
          <div className="font-heading text-2xl font-bold">{b.id ? "Edit Post" : "New Post"}</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title"><Input value={b.title} onChange={(v) => set("title", v)} testid="field-title" /></Field>
            <Field label="Slug (optional)"><Input value={b.slug} onChange={(v) => set("slug", v)} placeholder="auto-generated" /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category"><Input value={b.category} onChange={(v) => set("category", v)} /></Field>
            <Field label="Author"><Input value={b.author} onChange={(v) => set("author", v)} /></Field>
          </div>
          <Field label="Excerpt"><Textarea rows={2} value={b.excerpt} onChange={(v) => set("excerpt", v)} /></Field>
          <Field label="Cover image"><ImageInput value={b.cover_image} onChange={(v) => set("cover_image", v)} testid="field-cover" /></Field>
          <Field label="Cover alt"><Input value={b.cover_alt} onChange={(v) => set("cover_alt", v)} /></Field>
          <Field label="Tags"><TagsInput value={b.tags} onChange={(v) => set("tags", v)} testid="field-tags" /></Field>
          <Field label="Content"><RichTextEditor value={b.content} onChange={(v) => set("content", v)} /></Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="SEO Title"><Input value={b.seo_title} onChange={(v) => set("seo_title", v)} /></Field>
            <Field label="SEO Description"><Input value={b.seo_description} onChange={(v) => set("seo_description", v)} /></Field>
          </div>
          <Field label="Published?"><Switch checked={!!b.is_published} onChange={(v) => set("is_published", v)} testid="publish-toggle" /></Field>
        </div>
        <div className="mt-6 flex justify-end gap-2 sticky bottom-0 pt-4 bg-[#111114]">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={onSave} testid="save-blog">Save Post</Btn>
        </div>
      </div>
    </div>
  );
}
