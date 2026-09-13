import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/admin/ui";
import { FolderKanban, FileCheck2, FileClock, Sparkles, Briefcase, MailOpen, Plus, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const [totalProjects, publishedProjects, draftProjects, totalSkills, experienceCount, unreadMessages, recentProjects, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: FolderKanban },
    { label: "Published", value: publishedProjects, icon: FileCheck2 },
    { label: "Drafts", value: draftProjects, icon: FileClock },
    { label: "Total Skills", value: totalSkills, icon: Sparkles },
    { label: "Experience Entries", value: experienceCount, icon: Briefcase },
    { label: "Unread Messages", value: unreadMessages, icon: MailOpen },
  ];

  const quickActions = [
    { href: "/admin/projects/new", label: "Add Project", icon: Plus },
    { href: "/admin/skills", label: "Add Skill", icon: Plus },
    { href: "/admin/experience", label: "Add Experience", icon: Plus },
    { href: "/admin/messages", label: "View Messages", icon: MailOpen },
    { href: "/admin/profile", label: "Edit Profile", icon: Sparkles },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your portfolio content." />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <s.icon size={17} className="text-signal-soft mb-3" />
            <p className="font-display text-2xl text-mist-100">{s.value}</p>
            <p className="text-xs text-mist-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-mist-200">Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs text-signal-soft hover:underline">
              View all
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-mist-500">No projects yet.</p>
          ) : (
            <div className="space-y-1">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.03]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="truncate text-sm text-mist-200">{p.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono ${
                        p.published ? "bg-emerald-500/15 text-emerald-400" : "bg-mist-500/15 text-mist-400"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <Link href={`/admin/projects/${p.id}`} className="text-mist-500 hover:text-mist-200 text-xs shrink-0">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium text-mist-200 mb-4">Quick Actions</h2>
          <div className="space-y-1.5">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-mist-300 hover:bg-white/5 transition-colors"
              >
                <a.icon size={15} className="text-signal-soft" />
                {a.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-mist-200">Recent Messages</h2>
          <Link href="/admin/messages" className="text-xs text-signal-soft hover:underline">
            View all
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-mist-500">No messages yet.</p>
        ) : (
          <div className="space-y-1">
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.03]">
                <div className="min-w-0">
                  <p className="text-sm text-mist-200 truncate">
                    {m.name} — <span className="text-mist-500">{m.subject}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-signal" />}
                  <Eye size={13} className="text-mist-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
