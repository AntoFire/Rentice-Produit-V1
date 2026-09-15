import { NextResponse } from "next/server";

/**
 * TODO (Semaine 1, voir docs/05-unipile.md) : callback de retour du lien
 * hébergé de connexion Unipile — récupère account_id et le stocke sur la
 * campagne (campaigns.unipile_account_id). À vérifier contre la doc
 * officielle Unipile avant d'implémenter (endpoints/paramètres non figés).
 */
export async function GET() {
  return NextResponse.json(
    { error: "Pas encore implémenté" },
    { status: 501 }
  );
}
