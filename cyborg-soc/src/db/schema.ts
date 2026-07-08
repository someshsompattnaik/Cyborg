import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const threats = pgTable("threats", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 32 }).notNull().default("medium"),
  category: varchar("category", { length: 64 }).notNull(),
  source: varchar("source", { length: 128 }).notNull(),
  confidence: integer("confidence").notNull().default(50),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  mitreTactics: jsonb("mitre_tactics").$type<string[]>().notNull().default([]),
  firstSeen: timestamp("first_seen", { withTimezone: true }).notNull().defaultNow(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const indicators = pgTable("indicators", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 32 }).notNull(),
  value: varchar("value", { length: 512 }).notNull(),
  threatId: integer("threat_id"),
  severity: varchar("severity", { length: 32 }).notNull().default("medium"),
  confidence: integer("confidence").notNull().default(50),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  description: text("description").notNull().default(""),
  source: varchar("source", { length: 128 }).notNull().default("manual"),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  firstSeen: timestamp("first_seen", { withTimezone: true }).notNull().defaultNow(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ipReputations = pgTable("ip_reputations", {
  id: serial("id").primaryKey(),
  ip: varchar("ip", { length: 64 }).notNull().unique(),
  score: integer("score").notNull().default(50),
  riskLevel: varchar("risk_level", { length: 32 }).notNull().default("medium"),
  country: varchar("country", { length: 64 }).notNull().default("Unknown"),
  asn: varchar("asn", { length: 64 }).notNull().default("Unknown"),
  isp: varchar("isp", { length: 255 }).notNull().default("Unknown"),
  abuseReports: integer("abuse_reports").notNull().default(0),
  categories: jsonb("categories").$type<string[]>().notNull().default([]),
  notes: text("notes").notNull().default(""),
  lastChecked: timestamp("last_checked", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lookupLogs = pgTable("lookup_logs", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 512 }).notNull(),
  queryType: varchar("query_type", { length: 32 }).notNull(),
  resultSummary: text("result_summary").notNull(),
  riskLevel: varchar("risk_level", { length: 32 }).notNull().default("unknown"),
  matched: integer("matched").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Threat = typeof threats.$inferSelect;
export type NewThreat = typeof threats.$inferInsert;
export type Indicator = typeof indicators.$inferSelect;
export type NewIndicator = typeof indicators.$inferInsert;
export type IpReputation = typeof ipReputations.$inferSelect;
export type NewIpReputation = typeof ipReputations.$inferInsert;
export type LookupLog = typeof lookupLogs.$inferSelect;
