import type { RiskLevel, Severity } from "./types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function severityTone(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-rose-500/15 text-rose-300 ring-rose-500/40";
    case "high":
      return "bg-orange-500/15 text-orange-300 ring-orange-500/40";
    case "medium":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/40";
    case "low":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40";
    case "clean":
      return "bg-cyan-500/15 text-cyan-300 ring-cyan-500/40";
    default:
      return "bg-slate-500/15 text-slate-300 ring-slate-500/40";
  }
}

export function riskFromScore(score: number): RiskLevel {
  if (score >= 90) return "critical";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  if (score >= 15) return "low";
  return "clean";
}

export function detectQueryType(query: string): "ip" | "domain" | "url" | "hash" | "email" | "unknown" {
  const value = query.trim();
  if (!value) return "unknown";
  if (/^https?:\/\//i.test(value) || value.includes("/")) return "url";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  if (
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/.test(value) ||
    value.includes(":")
  ) {
    return "ip";
  }
  if (/^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(value)) return "hash";
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return "domain";
  return "unknown";
}

export function normalizeTags(input: string | string[] | undefined): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((t) => t.trim()).filter(Boolean);
  }
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function scoreToBarColor(score: number) {
  if (score >= 90) return "from-rose-500 to-red-400";
  if (score >= 70) return "from-orange-500 to-amber-400";
  if (score >= 40) return "from-amber-500 to-yellow-400";
  if (score >= 15) return "from-lime-500 to-emerald-400";
  return "from-cyan-500 to-emerald-400";
}

export function titleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function isSeverity(value: string): value is Severity {
  return ["critical", "high", "medium", "low", "info"].includes(value);
}
