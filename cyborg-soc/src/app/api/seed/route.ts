import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await ensureSeedData();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Seed failed", error);
    return Response.json({ ok: false, error: "Failed to seed database" }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
