"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Plus, X } from "lucide-react";
import { Card, Field, inputClass } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

export type ProjectFormData = {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string;
  technologies: string;
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  published: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
  images: { url: string; alt?: string }[];
};

export const emptyProject: ProjectFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  coverImageUrl: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  category: "Web",
  featured: false,
  published: false,
  order: 0,
  metaTitle: "",
  metaDescription: "",
  images: [],
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ initial }: { initial: ProjectFormData }) {
  const [data, setData] = useState<ProjectFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const router = useRouter();

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(data.id ? `/api/projects/${data.id}` : "/api/projects", {
        method: data.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error || "Could not save project.");
        return;
      }
      toast.success(data.id ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Details</h2>
          <Field label="Title">
            <input
              required
              className={inputClass}
              value={data.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (!slugTouched) update("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="Slug" hint="Used in the URL: /projects/your-slug">
            <input
              required
              className={`${inputClass} font-mono`}
              value={data.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="Category">
            <input className={inputClass} value={data.category} onChange={(e) => update("category", e.target.value)} />
          </Field>
          <Field label="Technologies" hint="Comma-separated, e.g. React, Node.js, PostgreSQL">
            <input className={inputClass} value={data.technologies} onChange={(e) => update("technologies", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <input className={inputClass} value={data.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
            </Field>
            <Field label="Live Demo URL">
              <input className={inputClass} value={data.liveUrl} onChange={(e) => update("liveUrl", e.target.value)} />
            </Field>
          </div>
          <Field label="Display Order">
            <input
              type="number"
              className={inputClass}
              value={data.order}
              onChange={(e) => update("order", Number(e.target.value))}
            />
          </Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Content</h2>
          <Field label="Short Description" hint="Shown on the project card.">
            <textarea
              required
              rows={2}
              className={inputClass}
              value={data.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
            />
          </Field>
          <Field label="Full Description" hint="Shown on the project detail page.">
            <textarea
              required
              rows={6}
              className={inputClass}
              value={data.fullDescription}
              onChange={(e) => update("fullDescription", e.target.value)}
            />
          </Field>
          <ImageUploader label="Cover Image" value={data.coverImageUrl} onChange={(url) => update("coverImageUrl", url)} />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Gallery Images</h2>
          <div className="space-y-3">
            {data.images.map((img, i) => (
              <div key={i} className="flex items-center gap-3">
                <ImageUploader
                  label={`Image ${i + 1}`}
                  value={img.url}
                  onChange={(url) => {
                    const images = [...data.images];
                    images[i] = { ...images[i], url };
                    update("images", images);
                  }}
                />
                <button
                  type="button"
                  onClick={() => update("images", data.images.filter((_, idx) => idx !== i))}
                  className="text-mist-500 hover:text-red-400 mt-6"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update("images", [...data.images, { url: "" }])}
            className="inline-flex items-center gap-1.5 text-xs text-signal-soft hover:underline"
          >
            <Plus size={14} /> Add Image
          </button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">SEO</h2>
          <Field label="Meta Title">
            <input className={inputClass} value={data.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} />
          </Field>
          <Field label="Meta Description">
            <textarea rows={2} className={inputClass} value={data.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} />
          </Field>

          <h2 className="text-sm font-medium text-mist-200 pt-2">Status</h2>
          <label className="flex items-center gap-2.5 text-sm text-mist-300">
            <input type="checkbox" checked={data.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-signal" />
            Featured project
          </label>
          <label className="flex items-center gap-2.5 text-sm text-mist-300">
            <input type="checkbox" checked={data.published} onChange={(e) => update("published", e.target.checked)} className="accent-signal" />
            Published (visible on the live site)
          </label>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-soft disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {data.id ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
