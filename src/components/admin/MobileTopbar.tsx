"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export default function MobileTopbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden sticky top-0 z-30 border-b border-white/8 bg-ink-900/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-display text-mist-100">
          Moosa<span className="text-signal">.</span> <span className="text-xs text-mist-500">CMS</span>
        </span>
        <button onClick={() => setOpen((o) => !o)} className="text-mist-200 p-1.5" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/8 p-2">
          {items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm ${
                  active ? "bg-signal/12 text-mist-100" : "text-mist-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-mist-500"
          >
            <LogOut size={15} /> Log Out
          </button>
        </nav>
      )}
    </div>
  );
}
