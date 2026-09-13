"use client";

import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl text-mist-100">{title}</h1>
        {description && <p className="text-sm text-mist-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/8 bg-ink-800 ${className}`}>{children}</div>;
}

export function EmptyState({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="text-mist-500 mb-3" size={28} />
      <p className="text-mist-300 text-sm">{label}</p>
      {hint && <p className="text-mist-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-mist-500">
      <Loader2 className="animate-spin" size={22} />
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-800 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-red-500/15 flex items-center justify-center">
                <AlertTriangle size={17} className="text-red-400" />
              </div>
              <h3 className="font-display text-lg text-mist-100">{title}</h3>
            </div>
            {description && <p className="text-sm text-mist-500 mb-6">{description}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-mist-300 hover:bg-white/5">
                Cancel
              </button>
              <button onClick={onConfirm} className="rounded-lg bg-red-500/90 px-4 py-2 text-sm text-white hover:bg-red-500">
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/60 p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} my-8 rounded-2xl border border-white/10 bg-ink-800 p-6`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg text-mist-100">{title}</h3>
              <button onClick={onClose} className="text-mist-500 hover:text-mist-200 text-sm">
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-mist-500 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-mist-500 mt-1">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-sm text-mist-100 outline-none focus:border-signal/50 transition-colors";
