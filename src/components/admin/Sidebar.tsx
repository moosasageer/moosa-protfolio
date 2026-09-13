"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Sparkles,
  Briefcase,
  Mail,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/8 bg-ink-900 p-4">
      <Link href="/admin" className="px-2 py-3 font-display text-lg text-mist-100">
        Moosa<span className="text-signal">.</span>
        <span className="ml-1 text-xs text-mist-500 font-body align-middle">CMS</span>
      </Link>

      <nav className="mt-4 flex-1 space-y-1">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-signal/12 text-mist-100" : "text-mist-500 hover:bg-white/5 hover:text-mist-200"
              }`}
            >
              <Icon size={16} className={active ? "text-signal-soft" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-mist-500 hover:bg-white/5 hover:text-red-400 transition-colors"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </aside>
  );
}
