"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { PageHeader, Card, Field, inputClass, LoadingState } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";
import { getSocialIcon, SOCIAL_ICON_NAMES } from "@/lib/icons";

type Stat = { value: string; label: string; order: number };
type SocialLink = { label: string; url: string; icon: string; order: number };
type ProfileData = {
  name: string;
  jobTitle: string;
  heroGreeting: string;
  heroSubtitle: string;
  heroStatement: string;
  aboutHeading: string;
  bio: string;
  shortBio: string;
  location: string;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  email: string;
  phone?: string | null;
  currentlyBuilding: string;
  stats: Stat[];
  socialLinks: SocialLink[];
};

export default function AdminProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <LoadingState />;

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d));
  }

  function updateStat(index: number, field: keyof Stat, value: string) {
    setData((d) => {
      if (!d) return d;
      const stats = [...d.stats];
      stats[index] = { ...stats[index], [field]: field === "order" ? Number(value) : value };
      return { ...d, stats };
    });
  }

  function updateSocial(index: number, field: keyof SocialLink, value: string) {
    setData((d) => {
      if (!d) return d;
      const socialLinks = [...d.socialLinks];
      socialLinks[index] = { ...socialLinks[index], [field]: value };
      return { ...d, socialLinks };
    });
  }

  function addSocial() {
    setData((d) =>
      d
        ? {
            ...d,
            socialLinks: [...d.socialLinks, { label: "", url: "", icon: "link", order: d.socialLinks.length }],
          }
        : d
    );
  }

  function removeSocial(index: number) {
    setData((d) => (d ? { ...d, socialLinks: d.socialLinks.filter((_, i) => i !== index) } : d));
  }

  function moveSocial(index: number, direction: -1 | 1) {
    setData((d) => {
      if (!d) return d;
      const target = index + direction;
      if (target < 0 || target >= d.socialLinks.length) return d;
      const socialLinks = [...d.socialLinks];
      [socialLinks[index], socialLinks[target]] = [socialLinks[target], socialLinks[index]];
      const reordered = socialLinks.map((s, i) => ({ ...s, order: i }));
      return { ...d, socialLinks: reordered };
    });
  }

  async function onSave() {
    if (!data) return;
    setSaving(true);
    try {
      // Drop any social-link rows the user added but never filled in — an
      // empty label/url would otherwise fail validation and block the
      // entire save with no clear reason shown.
      const payload = {
        ...data,
        socialLinks: data.socialLinks
          .filter((s) => s.url.trim())
          .map((s, i) => ({
            ...s,
            label: s.label.trim() || s.icon.charAt(0).toUpperCase() + s.icon.slice(1),
            order: i,
          })),
      };

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const detail = err?.issues?.map((i: { path: (string | number)[]; message: string }) => `${i.path.join(".")}: ${i.message}`).join(", ");
        throw new Error(detail || err?.error || "Save failed");
      }
      toast.success("Profile saved — live on the portfolio.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Everything here is reflected live on the public portfolio."
        action={
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-mist-200 hover:bg-white/5"
            >
              <Eye size={15} /> Preview
            </Link>
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-soft disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
          </div>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Identity</h2>
          <ImageUploader label="Profile Photo" value={data.avatarUrl} onChange={(url) => update("avatarUrl", url)} cropShape="round" />
          <Field label="Name">
            <input className={inputClass} value={data.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Job Title">
            <input className={inputClass} value={data.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
          </Field>
          <Field label="Location">
            <input className={inputClass} value={data.location} onChange={(e) => update("location", e.target.value)} />
          </Field>
          <Field label="Resume URL">
            <input className={inputClass} value={data.resumeUrl || ""} onChange={(e) => update("resumeUrl", e.target.value)} />
          </Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Hero Section</h2>
          <Field label="Hero Greeting" hint='e.g. "Hi, I&apos;m Moosa."'>
            <input className={inputClass} value={data.heroGreeting} onChange={(e) => update("heroGreeting", e.target.value)} />
          </Field>
          <Field label="Hero Subtitle">
            <input className={inputClass} value={data.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} />
          </Field>
          <Field label="Hero Statement">
            <textarea
              rows={3}
              className={inputClass}
              value={data.heroStatement}
              onChange={(e) => update("heroStatement", e.target.value)}
            />
          </Field>
          <Field label="Currently Building" hint="One line per item — shown in the typing terminal.">
            <textarea
              rows={3}
              className={`${inputClass} font-mono`}
              value={data.currentlyBuilding}
              onChange={(e) => update("currentlyBuilding", e.target.value)}
            />
          </Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">About</h2>
          <Field label="About Heading">
            <input className={inputClass} value={data.aboutHeading} onChange={(e) => update("aboutHeading", e.target.value)} />
          </Field>
          <Field label="Bio (full)">
            <textarea rows={5} className={inputClass} value={data.bio} onChange={(e) => update("bio", e.target.value)} />
          </Field>
          <Field label="Short Bio" hint="Used in meta descriptions / previews.">
            <textarea rows={2} className={inputClass} value={data.shortBio} onChange={(e) => update("shortBio", e.target.value)} />
          </Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Contact</h2>
          <Field label="Email">
            <input className={inputClass} value={data.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Phone (optional)">
            <input className={inputClass} value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} />
          </Field>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-mist-200">Social Links</h2>
              <p className="text-xs text-mist-500 mt-0.5">
                Shown as small icon boxes under your profile photo, in the order below.
              </p>
            </div>
            <button
              onClick={addSocial}
              className="inline-flex items-center gap-1.5 text-xs text-signal-soft hover:underline shrink-0"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>

          {data.socialLinks.length === 0 ? (
            <p className="text-sm text-mist-500 py-4">No social links yet — add one to show it on the site.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.socialLinks.map((s, i) => {
                const Icon = getSocialIcon(s.icon);
                return (
                  <div key={i} className="rounded-lg border border-white/10 p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                        <Icon size={16} className="text-signal-soft" />
                      </div>

                      <select
                        className={`${inputClass} flex-1 min-w-0`}
                        value={s.icon}
                        onChange={(e) => updateSocial(i, "icon", e.target.value)}
                      >
                        {SOCIAL_ICON_NAMES.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-col shrink-0">
                        <button
                          onClick={() => moveSocial(i, -1)}
                          disabled={i === 0}
                          className="text-mist-500 hover:text-mist-200 disabled:opacity-25 disabled:hover:text-mist-500"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moveSocial(i, 1)}
                          disabled={i === data.socialLinks.length - 1}
                          className="text-mist-500 hover:text-mist-200 disabled:opacity-25 disabled:hover:text-mist-500"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeSocial(i)}
                        className="shrink-0 text-mist-500 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <input
                      className={inputClass}
                      placeholder="Label (e.g. LinkedIn)"
                      value={s.label}
                      onChange={(e) => updateSocial(i, "label", e.target.value)}
                    />

                    <input
                      className={inputClass}
                      placeholder="https://..."
                      value={s.url}
                      onChange={(e) => updateSocial(i, "url", e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-mist-200">About Stats</h2>
            <button
              onClick={() => update("stats", [...data.stats, { value: "", label: "", order: data.stats.length }])}
              className="inline-flex items-center gap-1.5 text-xs text-signal-soft hover:underline"
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className="rounded-lg border border-white/10 p-3 space-y-2 relative">
                <button
                  onClick={() => update("stats", data.stats.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 text-mist-500 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
                <input
                  className={`${inputClass} font-display`}
                  placeholder="10+"
                  value={s.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Projects"
                  value={s.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
