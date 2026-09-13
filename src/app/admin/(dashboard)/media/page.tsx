"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, Copy, Trash2, Loader2 } from "lucide-react";
import { Card, PageHeader, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin/ui";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/media")
      .then((r) => r.json())
      .then(setItems);
  }
  useEffect(load, []);

  async function handleUpload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || `Could not upload ${file.name}.`);
      }
    }
    setUploading(false);
    toast.success("Upload complete.");
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success("Image URL copied.");
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/media/${deleteTarget.id}`, { method: "DELETE" });
    toast.success("Image deleted.");
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Media"
        description="Upload and manage images used across your projects and profile. JPG, PNG, WEBP — up to 8MB."
        action={
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-soft disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload Image
          </button>
        }
      />
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleUpload(e.target.files);
          e.target.value = "";
        }}
      />

      {!items ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Card>
          <EmptyState label="No media uploaded yet" hint="Uploaded images will appear here for reuse across your site." />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((m) => (
            <Card key={m.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-white/[0.02]">
                <Image src={m.url} alt={m.filename} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                  <button onClick={() => copyUrl(m.url)} className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white" title="Copy URL">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(m)} className="p-2 rounded-lg bg-black/60 hover:bg-red-500/80 text-white" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[11px] text-mist-400 truncate">{m.filename}</p>
                <p className="text-[10px] text-mist-500">{(m.size / 1024).toFixed(0)} KB</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this image?"
        description="If it's used elsewhere on your site, that reference will break."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
