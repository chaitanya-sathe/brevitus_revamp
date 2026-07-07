import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Card, Btn, Input, Select, Field,
} from "@/components/admin/AdminUtils";

const STATUS_OPTIONS = ["new", "contacted", "converted", "rejected"];
const STATUS_STYLES = {
  new: "bg-blue-500/10 text-blue-300",
  contacted: "bg-amber-500/10 text-amber-300",
  converted: "bg-emerald-500/10 text-emerald-300",
  rejected: "bg-red-500/10 text-red-300",
};

export default function LeadsAdmin() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    const params = {};
    if (q) params.q = q;
    if (status) params.status = status;
    try {
      const { data } = await api.get("/admin/leads", { params });
      setItems(data || []);
    } catch (e) {
      toast.error("Failed to load leads");
      setItems([]);
    }
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  const updateLead = useCallback(
    async (id, patch) => {
      try {
        await api.patch(`/admin/leads/${id}`, patch);
        toast.success("Lead updated");
        await load();
        setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
      } catch (e) {
        toast.error("Failed to update lead");
      }
    },
    [load]
  );

  const del = useCallback(
    async (id) => {
      if (!window.confirm("Delete lead?")) return;
      try {
        await api.delete(`/admin/leads/${id}`);
        toast.success("Deleted");
        await load();
        setSelected(null);
      } catch (e) {
        toast.error("Failed to delete lead");
      }
    },
    [load]
  );

  const exportCsv = useCallback(() => {
    const token = localStorage.getItem("brevitus_admin_token");
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/leads.csv`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "leads.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast.error("Failed to export CSV");
      });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            testid="leads-search"
            value={q}
            onChange={setQ}
            placeholder="Search name, email, phone, course"
          />
        </div>
        <div className="w-48">
          <Select
            testid="leads-status-filter"
            value={status}
            onChange={setStatus}
            options={[
              { value: "", label: "All statuses" },
              ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>
        <Btn variant="secondary" onClick={exportCsv} testid="export-leads-csv">
          Export CSV
        </Btn>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="leads-table">
            <thead>
              <tr className="text-left text-zinc-500 text-xs uppercase tracking-widest border-b border-[#1f1f22]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-t border-[#1f1f22] hover:bg-white/[0.02]">
                  <td className="py-3 px-4">
                    <div className="font-semibold">{l.full_name}</div>
                    <div className="text-xs text-zinc-500">{l.current_status}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    <div>{l.email}</div>
                    <div className="text-xs">{l.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{l.course_interested}</td>
                  <td className="py-3 px-4 text-zinc-400">{l.preferred_mode}</td>
                  <td className="py-3 px-4">
                    <select
                      data-testid={`lead-status-${l.id}`}
                      value={l.status}
                      onChange={(e) => updateLead(l.id, { status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border-none focus:outline-none ${STATUS_STYLES[l.status] || ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#0e0e11] text-zinc-100">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-xs text-zinc-500">
                    {(l.created_at || "").slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        data-testid={`view-lead-${l.id}`}
                        onClick={() => setSelected(l)}
                        className="text-xs text-purple-300 hover:text-purple-100"
                      >
                        View
                      </button>
                      <button
                        data-testid={`delete-lead-${l.id}`}
                        onClick={() => del(l.id)}
                        className="text-xs text-red-300 hover:text-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-zinc-500">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center md:justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-2xl bg-[#111114] border border-[#27272a] rounded-t-2xl md:rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            data-testid="lead-detail"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-heading text-2xl font-bold">{selected.full_name}</div>
                <div className="text-sm text-zinc-500">{selected.email} · {selected.phone}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Field label="Status">
                <div className={`inline-block px-3 py-1 rounded-full ${STATUS_STYLES[selected.status]}`}>
                  {selected.status}
                </div>
              </Field>
              <Field label="Preferred Mode"><div>{selected.preferred_mode}</div></Field>
              <Field label="Current Status"><div>{selected.current_status}</div></Field>
              <Field label="College / Company"><div>{selected.college_or_company || "—"}</div></Field>
              <Field label="Course Interested"><div>{selected.course_interested}</div></Field>
              <Field label="Submitted">
                <div>{(selected.created_at || "").slice(0, 16).replace("T", " ")}</div>
              </Field>
            </div>

            {selected.message && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-1.5">Message</div>
                <div className="p-3 bg-[#0e0e11] border border-[#27272a] rounded-lg text-sm whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-1.5">Internal Notes</div>
              <textarea
                data-testid="lead-notes"
                rows={4}
                defaultValue={selected.notes || ""}
                onBlur={(e) => updateLead(selected.id, { notes: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e0e11] border border-[#27272a] rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              />
              <div className="text-xs text-zinc-500 mt-1">Auto-saves on blur.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
