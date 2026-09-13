"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        if (body.fieldErrors) setErrors(body.fieldErrors);
        toast.error(body.error || "Something went wrong. Please try again.");
        return;
      }
      toast.success("Message sent — I'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-3xl p-6 md:p-8 space-y-5" noValidate>
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" name="name" error={errors.name} />
        <Field label="Email" name="email" type="email" error={errors.email} />
      </div>
      <Field label="Subject" name="subject" error={errors.subject} />
      <div>
        <label className="block text-xs font-mono text-mist-500 mb-2" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-mist-100 placeholder:text-mist-500 focus:border-signal/50 outline-none transition-colors resize-none"
          placeholder="Tell me about your project or idea..."
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-soft disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        Send Message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-mist-500 mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-mist-100 placeholder:text-mist-500 focus:border-signal/50 outline-none transition-colors"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
