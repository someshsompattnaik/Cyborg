import { and, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { indicators } from "@/db/schema";
import { ensureSeedData } from "@/lib/seed";
import { isSeverity, normalizeTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureSeedData();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const type = searchParams.get("type")?.trim() ?? "";
    const severity = searchParams.get("severity")?.trim() ?? "";

    const filters: SQL[] = [];
    if (q) {
      filters.push(
        or(ilike(indicators.value, `%${q}%`), ilike(indicators.description, `%${q}%`))!,
      );
    }
    if (type) filters.push(eq(indicators.type, type));
    if (severity) filters.push(eq(indicators.severity, severity));

    const rows = await db
      .select()
      .from(indicators)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(indicators.createdAt));

    return Response.json({ data: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch indicators" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = String(body.type ?? "").toLowerCase().trim();
    const value = String(body.value ?? "").trim();
    const description = String(body.description ?? "").trim();
    const source = String(body.source ?? "manual").trim() || "manual";
    const severity = String(body.severity ?? "medium").toLowerCase();
    const confidence = Math.min(100, Math.max(0, Number(body.confidence ?? 50)));
    const status = String(body.status ?? "active").toLowerCase();
    const tags = normalizeTags(body.tags);
    const threatIdRaw = body.threatId;
    const threatId =
      threatIdRaw === null || threatIdRaw === undefined || threatIdRaw === ""
        ? null
        : Number(threatIdRaw);

    if (!type || !value) {
      return Response.json({ error: "type and value are required" }, { status: 400 });
    }
    if (!isSeverity(severity)) {
      return Response.json({ error: "invalid severity" }, { status: 400 });
    }

    const [row] = await db
      .insert(indicators)
      .values({
        type,
        value,
        description,
        source,
        severity,
        confidence,
        status,
        tags,
        threatId: threatId !== null && Number.isFinite(threatId) ? threatId : null,
      })
      .returning();

    return Response.json({ data: row }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create indicator" }, { status: 500 });
  }
}
