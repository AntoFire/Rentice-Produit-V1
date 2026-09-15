import { notFound } from "next/navigation";
import { db } from "@/lib/db";

/**
 * Page d'accès sans authentification : /c/{token}.
 * Critère de sortie Semaine 0 (docs/00-configuration-stack.md §8) :
 * affiche "Bonjour {prénom}" depuis une ligne insérée à la main dans
 * students/campaigns.
 *
 * TODO (voir docs/02-architecture.md) : vérifier le token via HMAC avec
 * CAMPAIGN_TOKEN_SECRET plutôt qu'un simple lookup — pas encore implémenté,
 * ce squelette fait un lookup direct sur campaigns.token pour satisfaire le
 * critère de sortie de Semaine 0.
 */
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: campaign } = await db
    .from("campaigns")
    .select("id, state, students(first_name)")
    .eq("token", token)
    .maybeSingle();

  if (!campaign) {
    notFound();
  }

  const firstName = Array.isArray(campaign.students)
    ? campaign.students[0]?.first_name
    : (campaign.students as { first_name?: string } | null)?.first_name;

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">
        Bonjour {firstName ?? "—"}
      </h1>
    </main>
  );
}
