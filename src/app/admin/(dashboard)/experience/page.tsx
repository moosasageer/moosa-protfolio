"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, PageHeader, EmptyState, LoadingState, ConfirmDialog, Modal, Field, inputClass } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

type Experience = {
  id: string;
  position: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  technologies: string;
  order: number;
};

const emptyExp = {
  position: "",
  organization: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  technologies: "",
  order: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[] | null>(null);
  const [editing, setEditing] = useState<Experience | typeof emptyExp | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/experience")
      .then((r) => r.json())
      .then(setItems);
  }
  useEffect(load, []);

  async function onSave() {
    if (!editing) return;
    setSaving(true);
    const isEdit = "id" in editing;
    try {
      const payload = {
        ...editing,
        startDate: editing.startDate ? new Date(editing.startDate).toISOString() : "",
        endDate: editing.endDate ? new Date(editing.endDate).toISOString() : "",
      };
      const res = await fetch(isEdit ? `/api/experience/${editing.id}` : "/api/experience", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Experience updated." : "Experience added.");
      setEditing(null);
      load();
    } catch {
      toast.error("Could not save entry.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/experience/${deleteTarget.id}`, { method: "DELETE" });
    toast.success("Entry deleted.");
    setDeleteTarget(null);
    load();
  }

  function toInputDate(v: string) {
    if (!v) return "";
    return new Date(v).toISOString().slice(0, 10);
  }

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Manage the journey timeline shown on the portfolio."
        action={
          <button
            onClick={() => setEditing(emptyExp)}
            className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-soft"
          >
            <Plus size={15} /> Add Experience
          </button>
        }
      />

      <Card className="p-2">
        {!items ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState label="No experience entries yet" />
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-sm text-mist-100">{it.position}</p>
                  <p className="text-xs text-signal-soft mt-0.5">{it.organization}</p>
                  <p className="text-xs text-mist-500 mt-1 font-mono">
                    {formatDate(it.startDate)} — {it.current ? "Present" : formatDate(it.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-mist-500 shrink-0">
                  <button
                    onClick={() =>
                      setEditing({
                        ...it,
                        startDate: toInputDate(it.startDate),
                        endDate: it.endDate ? toInputDate(it.endDate) : "",
                      })
                    }
                    className="p-1.5 hover:text-mist-200"
                  >
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(it)} className="p-1.5 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && "id" in editing ? "Edit Experience" : "Add Experience"} wide>
        {editing && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Position">
                <input className={inputClass} value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} />
              </Field>
              <Field label="Organization">
                <input
                  className={inputClass}
                  value={editing.organization}
                  onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                rows={3}
                className={inputClass}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Start Date">
                <input
                  type="date"
                  className={inputClass}
                  value={editing.startDate}
                  onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                />
              </Field>
              <Field label="End Date">
                <input
                  type="date"
                  className={inputClass}
                  disabled={editing.current}
                  value={editing.endDate || ""}
                  onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2.5 text-sm text-mist-300">
              <input
                type="checkbox"
                checked={editing.current}
                onChange={(e) => setEditing({ ...editing, current: e.target.checked, endDate: e.target.checked ? "" : editing.endDate ?? "" })}
                className="accent-signal"
              />
              This is my current position
            </label>
            <Field label="Technologies" hint="Comma-separated">
              <input
                className={inputClass}
                value={editing.technologies}
                onChange={(e) => setEditing({ ...editing, technologies: e.target.value })}
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-mist-300 hover:bg-white/5">
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving || !editing.position || !editing.startDate}
                className="rounded-lg bg-signal px-4 py-2 text-sm text-white hover:bg-signal-soft disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this entry?"
        description={`"${deleteTarget?.position}" at ${deleteTarget?.organization} will be removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
