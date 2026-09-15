import { NextResponse } from "next/server";

/**
 * TODO (Semaine 1, voir docs/05-unipile.md) : webhook Unipile — réception
 * des réponses (replied_at, reply_snippet sur messages). À vérifier contre
 * la doc officielle Unipile avant d'implémenter (endpoints/paramètres non
 * figés) ; prévoir la vérification de la signature du webhook.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Pas encore implémenté" },
    { status: 501 }
  );
}
