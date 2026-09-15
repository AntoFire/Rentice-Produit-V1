import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Dispatch des relances programmées (J0/J+4/J+8).
 * Déclenché par Vercel Cron toutes les 15 minutes (voir vercel.json).
 *
 * Idempotent : une ligne déjà `done_at` non nul n'est jamais rejouée.
 * Compteur `attempts`, abandon après 3 échecs (voir docs/02-architecture.md).
 *
 * TODO : l'envoi réel via Unipile (lib/unipile.ts) reste à implémenter en
 * Semaine 1 — voir docs/05-unipile.md. TODO : notification email à l'admin
 * après abandon — canal d'envoi à définir (pas encore posé dans la stack).
 */

const MAX_ATTEMPTS = 3;

/**
 * TODO (Semaine 1, voir docs/05-unipile.md) : implémenter l'envoi réel via
 * lib/unipile.ts une fois les endpoints Unipile vérifiés.
 */
async function sendScheduledMessage(
  _send: { id: string; message_id: string }
): Promise<void> {
  throw new Error("Envoi Unipile non implémenté");
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: dueSends, error } = await db
    .from("scheduled_sends")
    .select("*")
    .is("done_at", null)
    .lte("due_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; status: "sent" | "failed" | "abandoned" }> = [];

  for (const send of dueSends ?? []) {
    try {
      await sendScheduledMessage(send);
      await db
        .from("scheduled_sends")
        .update({ done_at: new Date().toISOString() })
        .eq("id", send.id);
      results.push({ id: send.id, status: "sent" });
    } catch (err) {
      const attempts = (send.attempts ?? 0) + 1;
      const lastError = err instanceof Error ? err.message : String(err);

      if (attempts >= MAX_ATTEMPTS) {
        // TODO : notifier l'admin par email (canal à définir).
        await db
          .from("scheduled_sends")
          .update({ attempts, last_error: lastError })
          .eq("id", send.id);
        results.push({ id: send.id, status: "abandoned" });
      } else {
        await db
          .from("scheduled_sends")
          .update({ attempts, last_error: lastError })
          .eq("id", send.id);
        results.push({ id: send.id, status: "failed" });
      }
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
