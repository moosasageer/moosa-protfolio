"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { PageHeader, Card, Field, inputClass, LoadingState } from "@/components/admin/ui";

type Settings = {
  siteTitle: string;
  siteDescription: string;
  faviconUrl?: string | null;
  accentColor: string;
  footerText: string;
  contactEmail: string;
  analyticsId?: string | null;
  maintenanceMode: boolean;
  keywords?: string | null;
};

export default function AdminSettingsPage() {
  const [data, setData] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <LoadingState />;

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d));
  }

  async function onSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved.");
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Global configuration for the public portfolio."
        action={
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-white hover:bg-signal-soft disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">General & SEO</h2>
          <Field label="Site Title">
            <input className={inputClass} value={data.siteTitle} onChange={(e) => update("siteTitle", e.target.value)} />
          </Field>
          <Field label="Site Description">
            <textarea
              rows={3}
              className={inputClass}
              value={data.siteDescription}
              onChange={(e) => update("siteDescription", e.target.value)}
            />
          </Field>
          <Field label="Keywords" hint="Comma-separated">
            <input className={inputClass} value={data.keywords || ""} onChange={(e) => update("keywords", e.target.value)} />
          </Field>
          <Field label="Favicon URL">
            <input className={inputClass} value={data.faviconUrl || ""} onChange={(e) => update("faviconUrl", e.target.value)} />
          </Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-mist-200">Branding & Contact</h2>
          <Field label="Accent Color">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.accentColor}
                onChange={(e) => update("accentColor", e.target.value)}
                className="h-10 w-14 rounded-lg border border-white/10 bg-transparent"
              />
              <input className={inputClass} value={data.accentColor} onChange={(e) => update("accentColor", e.target.value)} />
            </div>
          </Field>
          <Field label="Contact Email">
            <input className={inputClass} value={data.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
          </Field>
          <Field label="Footer Text">
            <input className={inputClass} value={data.footerText} onChange={(e) => update("footerText", e.target.value)} />
          </Field>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <h2 className="text-sm font-medium text-mist-200">Advanced</h2>
          <Field label="Analytics ID" hint="e.g. a Google Analytics measurement ID">
            <input className={inputClass} value={data.analyticsId || ""} onChange={(e) => update("analyticsId", e.target.value)} />
          </Field>
          <label className="flex items-center gap-2.5 text-sm text-mist-300">
            <input
              type="checkbox"
              checked={data.maintenanceMode}
              onChange={(e) => update("maintenanceMode", e.target.checked)}
              className="accent-signal"
            />
            Maintenance mode
          </label>
          {data.maintenanceMode && (
            <p className="text-xs text-signal-amber">
              Note: enabling this flag alone does not block traffic — wire it into `middleware.ts` if you want the public
              site to show a maintenance page while it's on.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
