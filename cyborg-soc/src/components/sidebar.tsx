"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Command Center", icon: "◈" },
  { href: "/threats", label: "Threat Intelligence", icon: "⚑" },
  { href: "/indicators", label: "Indicators", icon: "◎" },
  { href: "/lookup", label: "IOC Lookup", icon: "⌕" },
  { href: "/ip-reputation", label: "IP Reputation", icon: "⬡" },
  { href: "/manual", label: "Operator Manual", icon: "☰" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-cyan-500/10 bg-[#05070d]/95 px-5 py-6 backdrop-blur xl:flex">
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            C
          </div>
          <div>
            <p className="text-lg font-bold tracking-[0.18em] text-white">CYBORG</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/70">
              SOC Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                active
                  ? "bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-400/30 shadow-[inset_0_0_24px_rgba(34,211,238,0.08)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg text-sm",
                  active ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-500",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
          Secure Channel
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Cyborg is optimized for SOC triage, IOC enrichment, and threat correlation workflows.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#05070d]/95 backdrop-blur xl:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-slate-950">
            C
          </div>
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-white">CYBORG</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">SOC</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold",
                active
                  ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30"
                  : "bg-white/5 text-slate-400",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
