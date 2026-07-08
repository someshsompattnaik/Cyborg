import { eq } from "drizzle-orm";
import { db } from "@/db";
import { threats } from "@/db/schema";
import { isSeverity, normalizeTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const updates: Partial<typeof threats.$inferInsert> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined) updates.description = String(body.description).trim();
    if (body.category !== undefined) updates.category = String(body.category).trim();
    if (body.source !== undefined) updates.source = String(body.source).trim();
    if (body.status !== undefined) updates.status = String(body.status).toLowerCase();
    if (body.confidence !== undefined) {
      updates.confidence = Math.min(100, Math.max(0, Number(body.confidence)));
    }
    if (body.severity !== undefined) {
      const severity = String(body.severity).toLowerCase();
      if (!isSeverity(severity)) {
        return Response.json({ error: "invalid severity" }, { status: 400 });
      }
      updates.severity = severity;
    }
    if (body.tags !== undefined) updates.tags = normalizeTags(body.tags);
    if (body.mitreTactics !== undefined) updates.mitreTactics = normalizeTags(body.mitreTactics);
    updates.lastSeen = new Date();

    const [row] = await db.update(threats).set(updates).where(eq(threats.id, id)).returning();
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: row });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update threat" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    const [row] = await db.delete(threats).where(eq(threats.id, id)).returning();
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: row });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete threat" }, { status: 500 });
  }
}
