"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
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
  Select,
  SeverityBadge,
  TagList,
  Textarea,
} from "@/components/ui";
import { formatDate, riskFromScore, scoreToBarColor, titleCase } from "@/lib/utils";

type IpRecord = {
  id: number;
  ip: string;
  score: number;
  riskLevel: string;
  country: string;
  asn: string;
  isp: string;
  abuseReports: number;
  categories: string[];
  notes: string;
  lastChecked: string;
  createdAt: string;
};

const emptyForm = {
  ip: "",
  score: "50",
  riskLevel: "medium",
  country: "",
  asn: "",
  isp: "",
  abuseReports: "0",
  categories: "",
  notes: "",
};

export default function IpReputationPage() {
  const [records, setRecords] = useState<IpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (risk) params.set("risk", risk);
      const res = await fetch(`/api/ip-reputation?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load IP reputations");
      setRecords(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load IP reputations");
    } finally {
      setLoading(false);
    }
  }, [q, risk]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const score = Number(form.score);
      const res = await fetch("/api/ip-reputation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          score,
          riskLevel: form.riskLevel || riskFromScore(score),
          abuseReports: Number(form.abuseReports),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save reputation");
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save reputation");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Network Intelligence"
        title="IP Reputation"
        description="Score and contextualize source addresses with abuse volume, ASN/ISP metadata, geographic hints, and risk categories for perimeter triage."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close Form" : "Add / Update IP"}
          </Button>
        }
      />

      {showForm ? (
        <Card className="mb-6">
          <CardHeader
            title="Upsert IP Reputation"
            subtitle="Create a new record or update an existing IP address"
          />
          <form onSubmit={onSubmit} className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <Label>IP Address</Label>
              <Input
                required
                className="mono"
                value={form.ip}
                onChange={(e) => setForm((f) => ({ ...f, ip: e.target.value }))}
                placeholder="203.0.113.10"
              />
            </div>
            <div>
              <Label>Score (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.score}
                onChange={(e) => {
                  const score = e.target.value;
                  setForm((f) => ({
                    ...f,
                    score,
                    riskLevel: riskFromScore(Number(score) || 0),
                  }));
                }}
              />
            </div>
            <div>
              <Label>Risk Level</Label>
              <Select
                value={form.riskLevel}
                onChange={(e) => setForm((f) => ({ ...f, riskLevel: e.target.value }))}
              >
                {["critical", "high", "medium", "low", "clean"].map((r) => (
                  <option key={r} value={r}>
                    {titleCase(r)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Abuse Reports</Label>
              <Input
                type="number"
                min={0}
                value={form.abuseReports}
                onChange={(e) => setForm((f) => ({ ...f, abuseReports: e.target.value }))}
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="US"
              />
            </div>
            <div>
              <Label>ASN</Label>
              <Input
                value={form.asn}
                onChange={(e) => setForm((f) => ({ ...f, asn: e.target.value }))}
                placeholder="AS15169"
              />
            </div>
            <div>
              <Label>ISP</Label>
              <Input
                value={form.isp}
                onChange={(e) => setForm((f) => ({ ...f, isp: e.target.value }))}
                placeholder="Provider name"
              />
            </div>
            <div>
              <Label>Categories</Label>
              <Input
                value={form.categories}
                onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))}
                placeholder="c2, scanning, proxy"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Analyst notes, incident linkage, blocking guidance..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Reputation"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="mb-6">
        <div className="grid gap-3 p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Label>Search IP</Label>
            <Input
              className="mono"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by IP address..."
            />
          </div>
          <div>
            <Label>Risk</Label>
            <Select value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option value="">All risk levels</option>
              {["critical", "high", "medium", "low", "clean"].map((r) => (
                <option key={r} value={r}>
                  {titleCase(r)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingBlock />
      ) : records.length === 0 ? (
        <EmptyState title="No IP records" description="Add reputation data to begin network triage." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {records.map((record) => (
            <Card key={record.id}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="mono text-lg font-semibold text-cyan-200">{record.ip}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Last checked {formatDate(record.lastChecked)}
                    </p>
                  </div>
                  <SeverityBadge value={record.riskLevel} />
                </div>

                <div className="mt-5">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Risk score</span>
                    <span className="font-semibold text-white">{record.score}/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${scoreToBarColor(record.score)}`}
                      style={{ width: `${record.score}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Country</p>
                    <p className="mt-1 text-slate-200">{record.country}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Abuse</p>
                    <p className="mt-1 text-slate-200">{record.abuseReports}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">ASN</p>
                    <p className="mt-1 text-slate-200">{record.asn}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">ISP</p>
                    <p className="mt-1 text-slate-200">{record.isp}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Categories
                  </p>
                  <TagList tags={record.categories ?? []} />
                </div>

                {record.notes ? (
                  <p className="mt-4 text-sm leading-6 text-slate-400">{record.notes}</p>
                ) : null}

                <div className="mt-4">
                  <Badge tone={record.riskLevel}>{titleCase(record.riskLevel)} priority</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
