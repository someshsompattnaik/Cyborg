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
import { INDICATOR_TYPES, SEVERITIES } from "@/lib/types";
import { formatDate, titleCase } from "@/lib/utils";

type Indicator = {
  id: number;
  type: string;
  value: string;
  threatId: number | null;
  severity: string;
  confidence: number;
  tags: string[];
  description: string;
  source: string;
  status: string;
  createdAt: string;
  lastSeen: string;
};

const emptyForm = {
  type: "ip",
  value: "",
  description: "",
  source: "manual",
  severity: "high",
  confidence: "75",
  status: "active",
  tags: "",
  threatId: "",
};

export default function IndicatorsPage() {
  const [items, setItems] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (type) params.set("type", type);
      if (severity) params.set("severity", severity);
      const res = await fetch(`/api/indicators?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load indicators");
      setItems(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load indicators");
    } finally {
      setLoading(false);
    }
  }, [q, type, severity]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          confidence: Number(form.confidence),
          threatId: form.threatId ? Number(form.threatId) : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create indicator");
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create indicator");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: number) {
    if (!confirm("Delete this indicator?")) return;
    const res = await fetch(`/api/indicators/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="IOC Management"
        title="Indicators"
        description="Maintain the Cyborg indicator corpus — IPs, domains, URLs, file hashes, emails, and filenames used for detection engineering and incident response."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close Form" : "Add Indicator"}
          </Button>
        }
      />

      {showForm ? (
        <Card className="mb-6">
          <CardHeader title="Register Indicator" subtitle="Add a new IOC to the Cyborg knowledge base" />
          <form onSubmit={onSubmit} className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                {INDICATOR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {titleCase(t)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                required
                className="mono"
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                placeholder="185.220.101.45 / evil.example.com / hash..."
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Context, campaign linkage, detection notes..."
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
              <Label>Confidence</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.confidence}
                onChange={(e) => setForm((f) => ({ ...f, confidence: e.target.value }))}
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
              <Label>Linked Threat ID (optional)</Label>
              <Input
                value={form.threatId}
                onChange={(e) => setForm((f) => ({ ...f, threatId: e.target.value }))}
                placeholder="e.g. 1"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Tags</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="c2, phishing, malware"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Indicator"}
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
              placeholder="Search IOC value or description..."
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              {INDICATOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {titleCase(t)}
                </option>
              ))}
            </Select>
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
        </div>
      </Card>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState title="No indicators found" description="Add IOCs or clear filters." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-cyan-500/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-left text-sm">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Seen</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/40">
                {items.map((item) => (
                  <tr key={item.id} className="align-top hover:bg-cyan-500/[0.03]">
                    <td className="px-4 py-4">
                      <Badge>{titleCase(item.type)}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="mono max-w-xs break-all text-cyan-200">{item.value}</p>
                      <p className="mt-1 max-w-sm text-xs text-slate-500">{item.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <SeverityBadge value={item.severity} />
                    </td>
                    <td className="px-4 py-4 text-slate-300">{item.confidence}%</td>
                    <td className="px-4 py-4">
                      <TagList tags={item.tags ?? []} />
                    </td>
                    <td className="px-4 py-4 text-slate-400">{item.source}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <div>{formatDate(item.lastSeen)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <Button variant="danger" onClick={() => void removeItem(item.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
