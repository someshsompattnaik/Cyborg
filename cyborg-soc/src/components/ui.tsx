import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn, severityTone, titleCase } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: string;
  className?: string;
}) {
  const mapped =
    tone === "default"
      ? "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30"
      : severityTone(tone);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset",
        mapped,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cyan-500/10 bg-slate-950/70 shadow-[0_0_0_1px_rgba(34,211,238,0.04),0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "cyan" | "rose" | "amber" | "emerald" | "violet";
}) {
  const accents = {
    cyan: "from-cyan-500/20 to-transparent text-cyan-300",
    rose: "from-rose-500/20 to-transparent text-rose-300",
    amber: "from-amber-500/20 to-transparent text-amber-300",
    emerald: "from-emerald-500/20 to-transparent text-emerald-300",
    violet: "from-violet-500/20 to-transparent text-violet-300",
  };

  return (
    <Card className="overflow-hidden">
      <div className={cn("bg-gradient-to-br p-5", accents[accent])}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
        {hint ? <p className="mt-2 text-xs text-slate-400">{hint}</p> : null}
      </div>
    </Card>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary:
      "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.25)]",
    secondary:
      "bg-white/5 text-slate-100 ring-1 ring-white/10 hover:bg-white/10",
    danger: "bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/40 hover:bg-rose-500/30",
    ghost: "bg-transparent text-slate-300 hover:bg-white/5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
      {children}
    </label>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags?.length) return <span className="text-xs text-slate-500">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function SeverityBadge({ value }: { value: string }) {
  return <Badge tone={value}>{titleCase(value)}</Badge>;
}

export function LoadingBlock({ label = "Loading Cyborg intelligence..." }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-cyan-500/10 bg-slate-950/50">
      <div className="flex items-center gap-3 text-sm text-cyan-200">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
        {label}
      </div>
    </div>
  );
}
