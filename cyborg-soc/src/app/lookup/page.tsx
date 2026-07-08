"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Input,
  Label,
  LoadingBlock,
  PageHeader,
  SeverityBadge,
  TagList,
} from "@/components/ui";
import { formatDate, scoreToBarColor, titleCase } from "@/lib/utils";

type LookupResult = {
  query: string;
  normalizedQuery: string;
  queryType: string;
  riskLevel: string;
  resultSummary: string;
  indicators: Array<{
    id: number;
    type: string;
    value: string;
    severity: string;
    confidence: number;
    description: string;
    tags: string[];
    source: string;
  }>;
  threats: Array<{
    id: number;
    title: string;
    severity: string;
    category: string;
    description: string;
    tags: string[];
  }>;
  reputation: {
    ip: string;
    score: number;
    riskLevel: string;
    country: string;
    asn: string;
    isp: string;
    abuseReports: number;
    categories: string[];
    notes: string;
    synthetic?: boolean;
  } | null;
};

type HistoryItem = {
  id: number;
  query: string;
  queryType: string;
  riskLevel: string;
  resultSummary: string;
  matched: number;
  createdAt: string;
};

export default function LookupPage() {
  const [query, setQuery] = useState("185.220.101.45");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function loadHistory() {
    const res = await fetch("/api/lookup?history=1", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setHistory(json.data);
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function runLookup(value?: string) {
    const q = (value ?? query).trim();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lookup failed");
      setResult(json.data);
      setQuery(q);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void runLookup();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Investigations"
        title="IOC Lookup"
        description="Pivot across the Cyborg intelligence corpus. Automatically detects IP, domain, URL, hash, and email formats, then correlates matching indicators, threats, and reputation."
      />

      <Card className="mb-6">
        <form onSubmit={onSubmit} className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
          <div>
            <Label>Indicator / Observable</Label>
            <Input
              className="mono"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="IP, domain, URL, hash, or email..."
            />
            <p className="mt-2 text-xs text-slate-500">
              Tip: defanged values like <code className="text-cyan-300">evil[.]com</code> are supported.
            </p>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? "Searching..." : "Lookup"}
            </Button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 border-t border-white/5 px-5 py-4">
          {["185.220.101.45", "8.8.8.8", "secure-login-m365[.]online", "payments@vendor-support-secure.com"].map(
            (sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => void runLookup(sample)}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10 hover:bg-cyan-500/10 hover:text-cyan-200"
              >
                {sample}
              </button>
            ),
          )}
        </div>
      </Card>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? <LoadingBlock label="Correlating intelligence sources..." /> : null}

      {!loading && result ? (
        <div className="mb-6 grid gap-6">
          <Card>
            <div className="grid gap-4 p-5 md:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Query Result
                </p>
                <p className="mono mt-2 break-all text-xl font-semibold text-cyan-200">{result.query}</p>
                <p className="mt-3 text-sm text-slate-400">{result.resultSummary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{titleCase(result.queryType)}</Badge>
                  <SeverityBadge value={result.riskLevel} />
                  {result.normalizedQuery !== result.query ? (
                    <Badge tone="info">Normalized: {result.normalizedQuery}</Badge>
                  ) : null}
                </div>
              </div>
              {result.reputation ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">IP Reputation</p>
                    <SeverityBadge value={result.reputation.riskLevel} />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-white">{result.reputation.score}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${scoreToBarColor(result.reputation.score)}`}
                      style={{ width: `${result.reputation.score}%` }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <p>Country: {result.reputation.country}</p>
                    <p>ASN: {result.reputation.asn}</p>
                    <p>ISP: {result.reputation.isp}</p>
                    <p>Abuse: {result.reputation.abuseReports}</p>
                  </div>
                  {result.reputation.synthetic ? (
                    <p className="mt-3 text-xs text-amber-300">
                      Synthetic baseline — no stored reputation record.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
                  No IP reputation context for this query type.
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader
                title="Matched Indicators"
                subtitle={`${result.indicators.length} IOC hit(s)`}
              />
              <div className="divide-y divide-white/5">
                {result.indicators.length === 0 ? (
                  <div className="p-5 text-sm text-slate-400">No indicator matches.</div>
                ) : (
                  result.indicators.map((item) => (
                    <div key={item.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{titleCase(item.type)}</Badge>
                        <SeverityBadge value={item.severity} />
                        <Badge tone="info">{item.confidence}%</Badge>
                      </div>
                      <p className="mono mt-2 break-all text-sm text-cyan-200">{item.value}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                      <div className="mt-2">
                        <TagList tags={item.tags ?? []} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Related Threats" subtitle={`${result.threats.length} campaign hit(s)`} />
              <div className="divide-y divide-white/5">
                {result.threats.length === 0 ? (
                  <div className="p-5 text-sm text-slate-400">No related threat intelligence.</div>
                ) : (
                  result.threats.map((threat) => (
                    <div key={threat.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{threat.title}</p>
                        <SeverityBadge value={threat.severity} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{threat.category}</p>
                      <p className="mt-2 text-sm text-slate-400">{threat.description}</p>
                      <div className="mt-2">
                        <TagList tags={threat.tags ?? []} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {!loading && !result ? (
        <EmptyState
          title="Ready for pivot"
          description="Enter an observable above or use a sample query to begin enrichment."
        />
      ) : null}

      <Card className="mt-6">
        <CardHeader title="Lookup History" subtitle="Most recent analyst queries" />
        <div className="divide-y divide-white/5">
          {history.length === 0 ? (
            <div className="p-5 text-sm text-slate-400">History will appear after your first lookup.</div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void runLookup(item.query)}
                className="flex w-full flex-col gap-2 px-5 py-4 text-left hover:bg-cyan-500/[0.04] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="mono text-sm text-cyan-200">{item.query}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.queryType} · {item.matched} matches · {formatDate(item.createdAt)}
                  </p>
                </div>
                <SeverityBadge value={item.riskLevel} />
              </button>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
