/*
 * Generic CRUD page for simple entities.
 * Renders list + dialog form driven by a schema definition.
 */
import { useState } from "react";
import { toast } from "sonner";
import {
  Card, Btn, Input, Textarea, Select, Switch, ImageInput, TagsInput, Field,
  useAdminList, saveItem, deleteItem,
} from "@/components/admin/AdminUtils";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react";

/* schema: array of { name, label, type, options?, placeholder? } */
export default function SimpleCrudPage({ endpoint, schema, entityLabel, rowRender }) {
  const { items, reload } = useAdminList(endpoint);
  const [editing, setEditing] = useState(null);

  function newItem() {
    const blank = {};
    schema.forEach((f) => {
      blank[f.name] = f.default ?? (f.type === "tags" ? [] : f.type === "switch" ? false : f.type === "number" ? 0 : "");
    });
    setEditing(blank);
  }

  async function save() {
    try {
      await saveItem(endpoint, editing);
      toast.success("Saved");
      setEditing(null);
      reload();
    } catch (e) {
      toast.error("Save failed");
    }
  }

  async function del(id) {
    if (!window.confirm(`Delete this ${entityLabel}?`)) return;
    await deleteItem(endpoint, id);
    toast.success("Deleted");
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">{items.length} {entityLabel}{items.length === 1 ? "" : "s"}</div>
        <Btn onClick={newItem} testid={`new-${entityLabel}`}><Plus size={14} className="inline mr-1" /> New</Btn>
      </div>

      <Card>
        <div className="divide-y divide-[#1f1f22]" data-testid={`${entityLabel}-list`}>
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02]">
              <div className="flex-1 min-w-0">{rowRender(it)}</div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(it)} data-testid={`edit-${it.id}`} className="p-2 rounded hover:bg-white/10 text-purple-300"><PencilSimple size={16} /></button>
                <button onClick={() => del(it.id)} data-testid={`delete-${it.id}`} className="p-2 rounded hover:bg-white/10 text-red-300"><Trash size={16} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="p-8 text-center text-zinc-500 text-sm">No {entityLabel}s yet. Add one to get started.</div>}
        </div>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center md:justify-center" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-2xl bg-[#111114] border border-[#27272a] rounded-t-2xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto admin-scrollbar" data-testid={`${entityLabel}-form`}>
            <div className="flex items-center justify-between mb-6">
              <div className="font-heading text-2xl font-bold">{editing.id ? `Edit ${entityLabel}` : `New ${entityLabel}`}</div>
              <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {schema.map((f) => (
                <Field key={f.name} label={f.label}>
                  {renderField(f, editing[f.name], (v) => setEditing({ ...editing, [f.name]: v }))}
                </Field>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={save} testid={`save-${entityLabel}`}>Save</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderField(f, value, onChange) {
  const testid = `field-${f.name}`;
  switch (f.type) {
    case "textarea": return <Textarea value={value} onChange={onChange} rows={f.rows || 4} placeholder={f.placeholder} testid={testid} />;
    case "select": return <Select value={value} onChange={onChange} options={f.options} testid={testid} />;
    case "switch": return <Switch checked={!!value} onChange={onChange} testid={testid} />;
    case "image": return <ImageInput value={value} onChange={onChange} testid={testid} />;
    case "tags": return <TagsInput value={value} onChange={onChange} testid={testid} />;
    case "number": return <Input type="number" value={value} onChange={(v) => onChange(Number(v))} testid={testid} />;
    default: return <Input value={value} onChange={onChange} placeholder={f.placeholder} testid={testid} />;
  }
}
