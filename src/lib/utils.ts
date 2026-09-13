import { type ClassValue, clsx } from "./clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function splitTech(technologies: string): string[] {
  return technologies
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
