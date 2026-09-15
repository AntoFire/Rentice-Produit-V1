import { NextResponse } from "next/server";

/**
 * TODO (voir docs/02-architecture.md) : lecture/mise à jour d'une campagne
 * par id. Squelette posé en Semaine 0.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    { error: "Pas encore implémenté", id },
    { status: 501 }
  );
}
