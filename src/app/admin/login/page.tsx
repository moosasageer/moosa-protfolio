"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-signal/15 border border-signal/30 flex items-center justify-center">
            <Lock size={16} className="text-signal-soft" />
          </div>
          <span className="font-display text-lg text-mist-100">Admin</span>
        </div>

        <form onSubmit={onSubmit} className="bg-ink-800 border border-white/8 rounded-2xl p-7 space-y-4">
          <div>
            <label className="block text-xs text-mist-500 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-sm text-mist-100 outline-none focus:border-signal/50"
            />
          </div>
          <div>
            <label className="block text-xs text-mist-500 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-sm text-mist-100 outline-none focus:border-signal/50"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-signal py-2.5 text-sm font-medium text-white hover:bg-signal-soft transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Log In
          </button>
        </form>
        <p className="text-center text-xs text-mist-500 mt-6">Portfolio CMS — authorized access only.</p>
      </div>
    </div>
  );
}
