"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import ImageCropModal from "./ImageCropModal";

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  cropShape,
  aspect = 1,
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  cropShape?: "round" | "rect";
  aspect?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ src: string; file: File } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error || "Upload failed.");
        return;
      }
      onChange(body.url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelected(file: File) {
    if (cropShape) {
      const src = URL.createObjectURL(file);
      setPendingImage({ src, file });
    } else {
      uploadFile(file);
    }
  }

  function handleCropCancel() {
    if (pendingImage) URL.revokeObjectURL(pendingImage.src);
    setPendingImage(null);
  }

  function handleCropConfirm(croppedFile: File) {
    if (pendingImage) URL.revokeObjectURL(pendingImage.src);
    setPendingImage(null);
    uploadFile(croppedFile);
  }

  return (
    <div>
      <label className="block text-xs text-mist-500 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className={`relative h-20 w-20 shrink-0 border border-white/10 bg-white/[0.02] overflow-hidden flex items-center justify-center ${
            cropShape === "round" ? "rounded-full" : "rounded-lg"
          }`}
        >
          {value ? (
            <Image src={value} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <Upload size={18} className="text-mist-500" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-xs text-mist-200 hover:bg-white/5"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-xs text-mist-500 hover:text-red-400"
            >
              <X size={13} /> Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
            e.target.value = "";
          }}
        />
      </div>

      {pendingImage && cropShape && (
        <ImageCropModal
          imageSrc={pendingImage.src}
          fileName={pendingImage.file.name}
          mimeType={pendingImage.file.type || "image/jpeg"}
          cropShape={cropShape}
          aspect={aspect}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}