import { count } from "drizzle-orm";
import { db } from "@/db";
import { indicators, ipReputations, threats } from "@/db/schema";
import { seedIndicators, seedIpReputations, seedThreats } from "@/lib/seed-data";

export async function ensureSeedData() {
  const [{ value: threatCount }] = await db.select({ value: count() }).from(threats);
  if (threatCount > 0) return { seeded: false };

  const insertedThreats = await db
    .insert(threats)
    .values(seedThreats)
    .returning({ id: threats.id });

  const threatIds = insertedThreats.map((t) => t.id);

  await db.insert(indicators).values(
    seedIndicators.map((indicator, index) => ({
      ...indicator,
      threatId: threatIds[index % threatIds.length],
    })),
  );

  await db.insert(ipReputations).values(seedIpReputations);

  return { seeded: true };
}
