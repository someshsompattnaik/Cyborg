export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type RiskLevel = "critical" | "high" | "medium" | "low" | "clean" | "unknown";
export type IndicatorType = "ip" | "domain" | "url" | "hash" | "email" | "filename";
export type ThreatStatus = "active" | "monitoring" | "resolved" | "false_positive";

export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "info"];
export const INDICATOR_TYPES: IndicatorType[] = [
  "ip",
  "domain",
  "url",
  "hash",
  "email",
  "filename",
];
export const THREAT_STATUSES: ThreatStatus[] = [
  "active",
  "monitoring",
  "resolved",
  "false_positive",
];
