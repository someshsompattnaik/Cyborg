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
import { SEVERITIES, THREAT_STATUSES } from "@/lib/types";
import { formatDate, titleCase } from "@/lib/utils";

type Threat = {
  id: number;
  title: string;
  description: string;
  severity: string;
  category: string;
  source: string;
  confidence: number;
  status: string;
  tags: string[];
  mitreTactics: string[];
  createdAt: string;
  lastSeen: string;
};

const emptyForm = {
  title: "",
  description: "",
  category: "",
  source: "SOC Analyst",
  severity: "high",
  confidence: "80",
  status: "active",
  tags: "",
  mitreTactics: "",
};

export default function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (severity) params.set("severity", severity);
      if (status) params.set("status", status);
      const res = await fetch(`/api/threats?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load threats");
      setThreats(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load threats");
    } finally {
      setLoading(false);
    }
  }, [q, severity, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/threats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          confidence: Number(form.confidence),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create threat");
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create threat");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: number, nextStatus: string) {
    const res = await fetch(`/api/threats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) await load();
  }

  async function removeThreat(id: number) {
    if (!confirm("Delete this threat record?")) return;
    const res = await fetch(`/api/threats/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Intelligence Desk"
        title="Threat Intelligence"
        description="Ingest, triage, and manage adversary campaigns with severity scoring, MITRE tactics, confidence levels, and lifecycle status for SOC prioritization."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close Form" : "Add Threat"}
          </Button>
        }
      />

      {showForm ? (
        <Card className="mb-6">
          <CardHeader title="Create Threat Record" subtitle="Capture a new campaign or adversary activity" />
          <form onSubmit={onSubmit} className="grid gap-4 p-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Cobalt Strike Beacon C2 Campaign"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Detailed analyst notes, observed TTPs, victimology..."
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Phishing, C2, Ransomware..."
              />
            </div>
            <div>
              <Label>Source</Label>
              <Input
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
              />
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {titleCase(s)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {THREAT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {titleCase(s)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Confidence (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.confidence}
                onChange={(e) => setForm((f) => ({ ...f, confidence: e.target.value }))}
              />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="c2, finance, beacon"
              />
            </div>
            <div className="md:col-span-2">
              <Label>MITRE Tactics (comma separated)</Label>
              <Input
                value={form.mitreTactics}
                onChange={(e) => setForm((f) => ({ ...f, mitreTactics: e.target.value }))}
                placeholder="Initial Access, Command and Control"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Threat"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="mb-6">
        <div className="grid gap-3 p-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label>Search</Label>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, description, category..."
            />
          </div>
          <div>
            <Label>Severity</Label>
            <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="">All severities</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {titleCase(s)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {THREAT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {titleCase(s)}
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
      ) : threats.length === 0 ? (
        <EmptyState
          title="No threats matched"
          description="Adjust filters or create a new threat intelligence record."
        />
      ) : (
        <div className="grid gap-4">
          {threats.map((threat) => (
            <Card key={threat.id}>
              <div className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{threat.title}</h3>
                      <SeverityBadge value={threat.severity} />
                      <Badge>{titleCase(threat.status)}</Badge>
                      <Badge tone="info">{threat.confidence}% conf</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{threat.description}</p>
                    <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
                      <p>
                        <span className="text-slate-400">Category:</span> {threat.category}
                      </p>
                      <p>
                        <span className="text-slate-400">Source:</span> {threat.source}
                      </p>
                      <p>
                        <span className="text-slate-400">Created:</span> {formatDate(threat.createdAt)}
                      </p>
                      <p>
                        <span className="text-slate-400">Last seen:</span> {formatDate(threat.lastSeen)}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Tags
                      </p>
                      <TagList tags={threat.tags ?? []} />
                    </div>
                    <div className="mt-3">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        MITRE Tactics
                      </p>
                      <TagList tags={threat.mitreTactics ?? []} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                    <Select
                      value={threat.status}
                      onChange={(e) => void updateStatus(threat.id, e.target.value)}
                      className="min-w-[160px]"
                    >
                      {THREAT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {titleCase(s)}
                        </option>
                      ))}
                    </Select>
                    <Button variant="danger" onClick={() => void removeThreat(threat.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
