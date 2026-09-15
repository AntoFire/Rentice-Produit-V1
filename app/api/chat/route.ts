import { NextResponse } from "next/server";

/**
 * TODO (Semaine 2+, voir docs/01-produit.md et docs/03-ciblage.md) :
 * endpoint de chat pour le ciblage/rédaction assistés (Anthropic, via
 * lib/anthropic.ts). Squelette posé en Semaine 0.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Pas encore implémenté" },
    { status: 501 }
  );
}
