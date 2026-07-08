import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { indicators, ipReputations, lookupLogs, threats } from "@/db/schema";
import { ensureSeedData } from "@/lib/seed";
import { detectQueryType, riskFromScore } from "@/lib/utils";

export const dynamic = "force-dynamic";

function stripDefang(value: string) {
  return value
    .replace(/\[\.\]/g, ".")
    .replace(/hxxps?:\/\//gi, (m) => m.toLowerCase().replace("hxxp", "http"))
    .trim();
}

export async function GET(request: Request) {
  try {
    await ensureSeedData();
    const { searchParams } = new URL(request.url);
    const history = searchParams.get("history");

    if (history === "1") {
      const logs = await db
        .select()
        .from(lookupLogs)
        .orderBy(desc(lookupLogs.createdAt))
        .limit(25);
      return Response.json({ data: logs });
    }

    const rawQuery = searchParams.get("q")?.trim() ?? "";
    if (!rawQuery) {
      return Response.json({ error: "q is required" }, { status: 400 });
    }

    const query = stripDefang(rawQuery);
    const queryType = detectQueryType(query);

    const matchedIndicators = await db
      .select()
      .from(indicators)
      .where(
        or(
          ilike(indicators.value, `%${query}%`),
          ilike(indicators.value, `%${rawQuery}%`),
          sql`replace(${indicators.value}, '[.]', '.') ilike ${`%${query}%`}`,
        ),
      )
      .limit(20);

    const matchedThreats = await db
      .select()
      .from(threats)
      .where(
        or(
          ilike(threats.title, `%${query}%`),
          ilike(threats.description, `%${query}%`),
          sql`cast(${threats.tags} as text) ilike ${`%${query}%`}`,
        ),
      )
      .limit(10);

    let reputation = null as typeof ipReputations.$inferSelect | null;
    if (queryType === "ip") {
      const rows = await db
        .select()
        .from(ipReputations)
        .where(eq(ipReputations.ip, query))
        .limit(1);
      reputation = rows[0] ?? null;
    }

    const highestIndicatorSeverity = matchedIndicators[0]?.severity ?? "unknown";
    let riskLevel = "unknown";
    if (reputation) {
      riskLevel = reputation.riskLevel;
    } else if (matchedIndicators.length > 0) {
      riskLevel = highestIndicatorSeverity;
    } else if (matchedThreats.length > 0) {
      riskLevel = matchedThreats[0].severity;
    }

    const matched = matchedIndicators.length + matchedThreats.length + (reputation ? 1 : 0);
    const resultSummary =
      matched === 0
        ? "No intelligence matches found in Cyborg corpus."
        : `Found ${matchedIndicators.length} indicator(s), ${matchedThreats.length} threat(s)${
            reputation ? ", and IP reputation record" : ""
          }.`;

    const [log] = await db
      .insert(lookupLogs)
      .values({
        query: rawQuery,
        queryType,
        resultSummary,
        riskLevel,
        matched,
      })
      .returning();

    const enrichment =
      queryType === "ip" && !reputation
        ? {
            ip: query,
            score: 20,
            riskLevel: riskFromScore(20),
            country: "Unknown",
            asn: "Unknown",
            isp: "Unknown",
            abuseReports: 0,
            categories: ["unlisted"],
            notes: "No stored reputation. Baseline score applied for investigative triage.",
            synthetic: true,
          }
        : reputation
          ? { ...reputation, synthetic: false }
          : null;

    return Response.json({
      data: {
        query: rawQuery,
        normalizedQuery: query,
        queryType,
        riskLevel,
        resultSummary,
        indicators: matchedIndicators,
        threats: matchedThreats,
        reputation: enrichment,
        log,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }
}
