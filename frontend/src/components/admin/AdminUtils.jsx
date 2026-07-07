import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function Label({ children }) {
  return <div className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-1.5">{children}</div>;
}

export function Field({ label, children }) {
  return <div><Label>{label}</Label>{children}</div>;
}

export function Input({ value, onChange, placeholder, type = "text", testid }) {
  return (
    <input
      data-testid={testid}
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-[#0e0e11] border border-[#27272a] rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
    />
  );
}

export function Textarea({ value, onChange, rows = 3, placeholder, testid }) {
  return (
    <textarea
      data-testid={testid}
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-[#0e0e11] border border-[#27272a] rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
    />
  );
}

export function Select({ value, onChange, options, testid }) {
  return (
    <select
      data-testid={testid}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-[#0e0e11] border border-[#27272a] rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
    >
      {options.map((o) => (
        <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  );
}

export function Switch({ checked, onChange, testid }) {
  return (
    <button
      type="button"
      data-testid={testid}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition relative ${checked ? "bg-purple-600" : "bg-zinc-700"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function Btn({ onClick, variant = "primary", children, type = "button", testid, disabled }) {
  const styles = {
    primary: "bg-purple-600 hover:bg-purple-500 text-white",
    secondary: "bg-white/5 hover:bg-white/10 text-zinc-100 border border-[#27272a]",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      data-testid={testid}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${styles[variant]} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

export function ImageInput({ value, onChange, testid }) {
  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 900_000) {
      toast.error("Please pick an image under ~900KB (stored as base64).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }
  return (
    <div className="flex items-center gap-3" data-testid={testid}>
      {value ? (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#0e0e11] border border-[#27272a]">
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-lg border border-dashed border-[#333] flex items-center justify-center text-xs text-zinc-500">No image</div>
      )}
      <div className="flex flex-col gap-2">
        <label className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-[#27272a] text-xs cursor-pointer">
          Upload image
          <input type="file" accept="image/*" onChange={handle} className="hidden" />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-300 hover:text-red-200">Remove</button>
        )}
      </div>
    </div>
  );
}

export function TagsInput({ value, onChange, testid }) {
  const list = Array.isArray(value) ? value : [];
  const [txt, setTxt] = useState("");
  return (
    <div data-testid={testid}>
      <div className="flex flex-wrap gap-2 mb-2">
        {list.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-200 text-xs">
            {t}
            <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="hover:text-white">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={txt} onChange={setTxt} placeholder="Add and press +" testid={`${testid}-input`} />
        <Btn variant="secondary" onClick={() => { if (txt.trim()) { onChange([...list, txt.trim()]); setTxt(""); } }}>+</Btn>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`bg-[#111114] border border-[#1f1f22] rounded-xl ${className}`}>{children}</div>;
}

export function useAdminList(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data || []);
    } catch (e) {
      toast.error("Failed to load");
    }
    setLoading(false);
  }, [endpoint]); // ✅ stable function tied to endpoint

  useEffect(() => {
    load();
  }, [load]); // ✅ ESLint satisfied

  return { items, loading, reload: load, setItems };
}

export async function saveItem(endpoint, item) {
  if (item.id) {
    const { data } = await api.put(`${endpoint}/${item.id}`, item);
    return data;
  }
  const { data } = await api.post(endpoint, item);
  return data;
}

export async function deleteItem(endpoint, id) {
  await api.delete(`${endpoint}/${id}`);
}
