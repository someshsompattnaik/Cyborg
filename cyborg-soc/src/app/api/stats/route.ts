import { count, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { indicators, ipReputations, lookupLogs, threats } from "@/db/schema";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeedData();

    const [threatCount] = await db.select({ value: count() }).from(threats);
    const [indicatorCount] = await db.select({ value: count() }).from(indicators);
    const [ipCount] = await db.select({ value: count() }).from(ipReputations);
    const [lookupCount] = await db.select({ value: count() }).from(lookupLogs);

    const severityBreakdown = await db
      .select({
        severity: threats.severity,
        value: count(),
      })
      .from(threats)
      .groupBy(threats.severity);

    const indicatorTypes = await db
      .select({
        type: indicators.type,
        value: count(),
      })
      .from(indicators)
      .groupBy(indicators.type);

    const riskBreakdown = await db
      .select({
        riskLevel: ipReputations.riskLevel,
        value: count(),
      })
      .from(ipReputations)
      .groupBy(ipReputations.riskLevel);

    const recentThreats = await db
      .select()
      .from(threats)
      .orderBy(desc(threats.createdAt))
      .limit(5);

    const recentLookups = await db
      .select()
      .from(lookupLogs)
      .orderBy(desc(lookupLogs.createdAt))
      .limit(8);

    const [criticalActive] = await db
      .select({ value: count() })
      .from(threats)
      .where(
        sql`${threats.severity} in ('critical', 'high') and ${threats.status} = 'active'`,
      );

    return Response.json({
      data: {
        totals: {
          threats: threatCount.value,
          indicators: indicatorCount.value,
          ips: ipCount.value,
          lookups: lookupCount.value,
          criticalActive: criticalActive?.value ?? 0,
        },
        severityBreakdown,
        indicatorTypes,
        riskBreakdown,
        recentThreats,
        recentLookups,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
