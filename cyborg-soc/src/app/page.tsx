"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  LoadingBlock,
  PageHeader,
  SeverityBadge,
  StatCard,
  TagList,
} from "@/components/ui";
import { formatDate, scoreToBarColor, titleCase } from "@/lib/utils";

type StatsResponse = {
  totals: {
    threats: number;
    indicators: number;
    ips: number;
    lookups: number;
    criticalActive: number;
  };
  severityBreakdown: Array<{ severity: string; value: number }>;
  indicatorTypes: Array<{ type: string; value: number }>;
  riskBreakdown: Array<{ riskLevel: string; value: number }>;
  recentThreats: Array<{
    id: number;
    title: string;
    severity: string;
    category: string;
    status: string;
    confidence: number;
    source: string;
    tags: string[];
    createdAt: string;
  }>;
  recentLookups: Array<{
    id: number;
    query: string;
    queryType: string;
    riskLevel: string;
    resultSummary: string;
    matched: number;
    createdAt: string;
  }>;
};

export default function HomePage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load stats");
        if (mounted) setStats(json.data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingBlock label="Initializing Cyborg command center..." />;
  if (error || !stats) {
    return <EmptyState title="Command center offline" description={error || "No data"} />;
  }

  const maxSeverity = Math.max(1, ...stats.severityBreakdown.map((s) => s.value));

  return (
    <div>
      <PageHeader
        eyebrow="Cyborg SOC"
        title="Command Center"
        description="Unified threat intelligence workspace for SOC analysts. Monitor active campaigns, triage indicators, run IOC lookups, and assess IP reputation from a single dark-ops console."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lookup"
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
            >
              Run IOC Lookup
            </Link>
            <Link
              href="/threats"
              className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
            >
              Browse Threats
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Threats" value={stats.totals.threats} hint="Tracked campaigns" accent="cyan" />
        <StatCard
          label="Indicators"
          value={stats.totals.indicators}
          hint="IOC corpus size"
          accent="violet"
        />
        <StatCard label="IP Records" value={stats.totals.ips} hint="Reputation database" accent="amber" />
        <StatCard label="Lookups" value={stats.totals.lookups} hint="Historical queries" accent="emerald" />
        <StatCard
          label="Critical/High"
          value={stats.totals.criticalActive}
          hint="Active priority cases"
          accent="rose"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Threat Severity Distribution"
            subtitle="Live breakdown of intelligence severity across the corpus"
          />
          <div className="space-y-4 p-5">
            {stats.severityBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400">No severity data yet.</p>
            ) : (
              stats.severityBreakdown.map((item) => (
                <div key={item.severity}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-slate-300">
                      {titleCase(item.severity)}
                    </span>
                    <span className="text-slate-400">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${scoreToBarColor(
                        item.severity === "critical"
                          ? 95
                          : item.severity === "high"
                            ? 80
                            : item.severity === "medium"
                              ? 55
                              : 25,
                      )}`}
                      style={{ width: `${(item.value / maxSeverity) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="IOC Type Mix" subtitle="Indicator inventory by type" />
          <div className="space-y-3 p-5">
            {stats.indicatorTypes.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 ring-1 ring-white/5"
              >
                <span className="text-sm font-medium text-slate-200">{titleCase(item.type)}</span>
                <Badge>{item.value}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent Threat Intelligence"
            subtitle="Newest campaigns and adversary activity"
            action={
              <Link href="/threats" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                View all
              </Link>
            }
          />
          <div className="divide-y divide-white/5">
            {stats.recentThreats.map((threat) => (
              <div key={threat.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-100">{threat.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {threat.category} · {threat.source} · {formatDate(threat.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <SeverityBadge value={threat.severity} />
                    <Badge>{titleCase(threat.status)}</Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <TagList tags={threat.tags ?? []} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent IOC Lookups"
            subtitle="Analyst query history with risk outcomes"
            action={
              <Link href="/lookup" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                Open lookup
              </Link>
            }
          />
          <div className="divide-y divide-white/5">
            {stats.recentLookups.length === 0 ? (
              <div className="p-5 text-sm text-slate-400">No lookups yet. Run your first IOC search.</div>
            ) : (
              stats.recentLookups.map((log) => (
                <div key={log.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="mono text-sm text-cyan-200">{log.query}</p>
                    <SeverityBadge value={log.riskLevel} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{log.resultSummary}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                    {log.queryType} · {log.matched} matches · {formatDate(log.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Threat Intelligence",
            text: "Track adversary campaigns, MITRE tactics, confidence, and lifecycle status.",
            href: "/threats",
          },
          {
            title: "IOC Lookup",
            text: "Pivot instantly across IPs, domains, URLs, hashes, and emails in the Cyborg corpus.",
            href: "/lookup",
          },
          {
            title: "IP Reputation",
            text: "Score source addresses, abuse volume, ASN/ISP context, and risk categories.",
            href: "/ip-reputation",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]">
              <div className="p-5">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
