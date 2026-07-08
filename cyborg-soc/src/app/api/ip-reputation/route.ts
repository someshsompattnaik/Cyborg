import { and, desc, eq, ilike, SQL } from "drizzle-orm";
import { db } from "@/db";
import { ipReputations } from "@/db/schema";
import { ensureSeedData } from "@/lib/seed";
import { normalizeTags, riskFromScore } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureSeedData();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const risk = searchParams.get("risk")?.trim() ?? "";

    const filters: SQL[] = [];
    if (q) filters.push(ilike(ipReputations.ip, `%${q}%`));
    if (risk) filters.push(eq(ipReputations.riskLevel, risk));

    const rows = await db
      .select()
      .from(ipReputations)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(ipReputations.score));

    return Response.json({ data: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch IP reputations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip = String(body.ip ?? "").trim();
    const score = Math.min(100, Math.max(0, Number(body.score ?? 50)));
    const riskLevel = String(body.riskLevel ?? riskFromScore(score)).toLowerCase();
    const country = String(body.country ?? "Unknown").trim() || "Unknown";
    const asn = String(body.asn ?? "Unknown").trim() || "Unknown";
    const isp = String(body.isp ?? "Unknown").trim() || "Unknown";
    const abuseReports = Math.max(0, Number(body.abuseReports ?? 0));
    const categories = normalizeTags(body.categories);
    const notes = String(body.notes ?? "").trim();

    if (!ip) {
      return Response.json({ error: "ip is required" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(ipReputations)
      .where(eq(ipReputations.ip, ip))
      .limit(1);

    if (existing[0]) {
      const [row] = await db
        .update(ipReputations)
        .set({
          score,
          riskLevel,
          country,
          asn,
          isp,
          abuseReports,
          categories,
          notes,
          lastChecked: new Date(),
        })
        .where(eq(ipReputations.ip, ip))
        .returning();
      return Response.json({ data: row, updated: true });
    }

    const [row] = await db
      .insert(ipReputations)
      .values({
        ip,
        score,
        riskLevel,
        country,
        asn,
        isp,
        abuseReports,
        categories,
        notes,
      })
      .returning();

    return Response.json({ data: row, updated: false }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to save IP reputation" }, { status: 500 });
  }
}
