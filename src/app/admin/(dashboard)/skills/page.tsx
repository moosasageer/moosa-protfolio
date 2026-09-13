"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Card, PageHeader, EmptyState, LoadingState, ConfirmDialog, Modal, Field, inputClass } from "@/components/admin/ui";
import { getIcon, ICON_NAMES } from "@/lib/icons";

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  active: boolean;
};

const CATEGORIES = ["FRONTEND", "BACKEND", "PROGRAMMING", "AI_ML", "DATABASE", "TOOLS"];
const CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  PROGRAMMING: "Programming",
  AI_ML: "AI / Machine Learning",
  DATABASE: "Database",
  TOOLS: "Tools",
};

const emptySkill = { name: "", category: "FRONTEND", icon: "code", order: 0, active: true };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [editing, setEditing] = useState<Skill | typeof emptySkill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/skills")
      .then((r) => r.json())
      .then(setSkills);
  }
  useEffect(load, []);

  async function toggleActive(s: Skill) {
    setSkills((list) => list?.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)) || null);
    await fetch(`/api/skills/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-active" }),
    });
  }

  async function onSave() {
    if (!editing) return;
    setSaving(true);
    const isEdit = "id" in editing;
    try {
      const res = await fetch(isEdit ? `/api/skills/${editing.id}` : "/api/skills", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Skill updated." : "Skill added.");
      setEditing(null);
      load();
    } catch {
      toast.error("Could not save skill.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/skills/${deleteTarget.id}`, { method: "DELETE" });
    toast.success("Skill deleted.");
    setDeleteTarget(null);
    load();
  }

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: (skills || []).filter((s) => s.category === cat).sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Add, edit, reorder, or disable skills shown on the portfolio."
        action={
          <button
            onClick={() => setEditing(emptySkill)}
            className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-soft"
          >
            <Plus size={15} /> Add Skill
          </button>
        }
      />

      {!skills ? (
        <LoadingState />
      ) : skills.length === 0 ? (
        <Card>
          <EmptyState label="No skills yet" hint="Add your first skill to see it here." />
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items }) => (
            <Card key={cat} className="p-5">
              <h2 className="text-sm font-medium text-mist-200 mb-3">{CATEGORY_LABELS[cat]}</h2>
              <div className="space-y-1">
                {items.map((s) => {
                  const Icon = getIcon(s.icon);
                  return (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.02]">
                      <GripVertical size={14} className="text-mist-500 shrink-0" />
                      <Icon size={16} className="text-signal-soft shrink-0" />
                      <span className={`text-sm flex-1 ${s.active ? "text-mist-200" : "text-mist-500 line-through"}`}>{s.name}</span>
                      <button
                        onClick={() => toggleActive(s)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-mono ${
                          s.active ? "bg-emerald-500/15 text-emerald-400" : "bg-mist-500/15 text-mist-400"
                        }`}
                      >
                        {s.active ? "Active" : "Disabled"}
                      </button>
                      <button onClick={() => setEditing(s)} className="p-1.5 text-mist-500 hover:text-mist-200">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} className="p-1.5 text-mist-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && "id" in editing ? "Edit Skill" : "Add Skill"}>
        {editing && (
          <div className="space-y-4">
            <Field label="Skill Name">
              <input
                className={inputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Icon">
              <select
                className={inputClass}
                value={editing.icon}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              >
                {ICON_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Display Order">
              <input
                type="number"
                className={inputClass}
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-mist-300 hover:bg-white/5">
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving || !editing.name}
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
        title="Delete this skill?"
        description={`"${deleteTarget?.name}" will be removed from the portfolio.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
