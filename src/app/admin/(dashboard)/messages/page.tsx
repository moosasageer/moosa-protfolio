"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Reply, Search } from "lucide-react";
import { Card, PageHeader, EmptyState, LoadingState, ConfirmDialog, Modal } from "@/components/admin/ui";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [open, setOpen] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  function load() {
    fetch("/api/messages")
      .then((r) => r.json())
      .then(setMessages);
  }
  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!messages) return [];
    return messages
      .filter((m) => (filter === "all" ? true : filter === "unread" ? !m.read : m.read))
      .filter((m) =>
        query
          ? `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(query.toLowerCase())
          : true
      );
  }, [messages, filter, query]);

  async function setRead(m: Message, read: boolean) {
    setMessages((list) => list?.map((x) => (x.id === m.id ? { ...x, read } : x)) || null);
    await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function openMessage(m: Message) {
    setOpen(m);
    if (!m.read) await setRead(m, true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/messages/${deleteTarget.id}`, { method: "DELETE" });
    toast.success("Message deleted.");
    setDeleteTarget(null);
    setOpen(null);
    load();
  }

  return (
    <div>
      <PageHeader title="Messages" description="Contact form submissions from your portfolio." />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 pl-9 pr-3 py-2.5 text-sm text-mist-100 outline-none focus:border-signal/50"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs capitalize ${
                filter === f ? "bg-signal/15 text-signal-soft" : "text-mist-500 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {!messages ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No messages found" />
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-white/[0.02]"
              >
                {m.read ? <MailOpen size={16} className="text-mist-500 shrink-0" /> : <Mail size={16} className="text-signal shrink-0" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${m.read ? "text-mist-300" : "text-mist-100 font-medium"}`}>{m.name}</span>
                    <span className="text-xs text-mist-500 truncate">— {m.subject}</span>
                  </div>
                  <p className="text-xs text-mist-500 truncate mt-0.5">{m.message}</p>
                </div>
                <span className="text-[11px] text-mist-500 shrink-0 font-mono">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.subject || ""}>
        {open && (
          <div className="space-y-4">
            <div className="text-sm">
              <p className="text-mist-100">{open.name}</p>
              <p className="text-mist-500">{open.email}</p>
              <p className="text-mist-500 text-xs mt-1">{new Date(open.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm text-mist-300 leading-relaxed whitespace-pre-line border-t border-white/8 pt-4">{open.message}</p>
            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setDeleteTarget(open)} className="inline-flex items-center gap-1.5 text-xs text-mist-500 hover:text-red-400">
                <Trash2 size={14} /> Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setRead(open, !open.read)}
                  className="rounded-lg border border-white/10 px-3.5 py-2 text-xs text-mist-300 hover:bg-white/5"
                >
                  Mark as {open.read ? "Unread" : "Read"}
                </button>
                <a
                  href={`mailto:${open.email}?subject=${encodeURIComponent("Re: " + open.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-signal px-3.5 py-2 text-xs text-white hover:bg-signal-soft"
                >
                  <Reply size={13} /> Reply by Email
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this message?"
        description="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
