import { and, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { threats } from "@/db/schema";
import { ensureSeedData } from "@/lib/seed";
import { isSeverity, normalizeTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureSeedData();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const severity = searchParams.get("severity")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";

    const filters: SQL[] = [];
    if (q) {
      filters.push(
        or(
          ilike(threats.title, `%${q}%`),
          ilike(threats.description, `%${q}%`),
          ilike(threats.category, `%${q}%`),
        )!,
      );
    }
    if (severity) filters.push(eq(threats.severity, severity));
    if (status) filters.push(eq(threats.status, status));

    const rows = await db
      .select()
      .from(threats)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(threats.createdAt));

    return Response.json({ data: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch threats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const category = String(body.category ?? "").trim();
    const source = String(body.source ?? "SOC Analyst").trim() || "SOC Analyst";
    const severity = String(body.severity ?? "medium").toLowerCase();
    const confidence = Math.min(100, Math.max(0, Number(body.confidence ?? 50)));
    const status = String(body.status ?? "active").toLowerCase();
    const tags = normalizeTags(body.tags);
    const mitreTactics = normalizeTags(body.mitreTactics);

    if (!title || !description || !category) {
      return Response.json(
        { error: "title, description, and category are required" },
        { status: 400 },
      );
    }

    if (!isSeverity(severity)) {
      return Response.json({ error: "invalid severity" }, { status: 400 });
    }

    const [row] = await db
      .insert(threats)
      .values({
        title,
        description,
        category,
        source,
        severity,
        confidence,
        status,
        tags,
        mitreTactics,
      })
      .returning();

    return Response.json({ data: row }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create threat" }, { status: 500 });
  }
}
