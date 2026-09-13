"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Copy, Trash2, Eye, Star } from "lucide-react";
import { Card, PageHeader, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin/ui";

type Project = {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  published: boolean;
  slug: string;
  createdAt: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  function load() {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects);
  }
  useEffect(load, []);

  async function togglePublished(p: Project) {
    setProjects((list) => list?.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)) || null);
    await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-published" }),
    });
  }

  async function duplicate(p: Project) {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    if (res.ok) {
      toast.success("Project duplicated as a draft.");
      load();
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" });
    toast.success("Project deleted.");
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio's project showcase."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-soft"
          >
            <Plus size={15} /> Add Project
          </Link>
        }
      />

      <Card className="overflow-hidden">
        {!projects ? (
          <LoadingState />
        ) : projects.length === 0 ? (
          <EmptyState label="No projects yet" hint="Click “Add Project” to create your first one." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-mist-500">
                  <th className="px-5 py-3 font-normal">Title</th>
                  <th className="px-5 py-3 font-normal hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3 font-normal hidden md:table-cell">Featured</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                  <th className="px-5 py-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 text-mist-200">{p.title}</td>
                    <td className="px-5 py-3.5 text-mist-500 hidden sm:table-cell">{p.category}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {p.featured && <Star size={14} className="text-signal-amber fill-signal-amber" />}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => togglePublished(p)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-mono ${
                          p.published ? "bg-emerald-500/15 text-emerald-400" : "bg-mist-500/15 text-mist-400"
                        }`}
                      >
                        {p.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 text-mist-500">
                        {p.published && (
                          <Link href={`/projects/${p.slug}`} target="_blank" className="p-1.5 hover:text-mist-200" title="Preview">
                            <Eye size={15} />
                          </Link>
                        )}
                        <Link href={`/admin/projects/${p.id}`} className="p-1.5 hover:text-mist-200" title="Edit">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => duplicate(p)} className="p-1.5 hover:text-mist-200" title="Duplicate">
                          <Copy size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 hover:text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this project?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
