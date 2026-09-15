/**
 * Wrapper Unipile — connexion boîte mail étudiante, envoi, lecture des
 * réponses.
 *
 * ATTENTION (voir docs/00-configuration-stack.md §3) : ne pas implémenter à
 * l'aveugle. Les noms de champs et endpoints exacts doivent être vérifiés
 * dans la doc officielle Unipile au moment de l'implémentation (Semaine 1,
 * voir docs/05-unipile.md) — les exemples connus au moment de la rédaction
 * de ce guide peuvent avoir changé. UNIPILE_BASE_URL dépend du cluster
 * assigné à la création du compte d'essai.
 *
 * Ne pas démarrer l'essai Unipile avant la Semaine 1 : c'est la brique qui
 * peut invalider le projet si elle ne tient pas ses promesses.
 */

const UNIPILE_API_KEY = process.env.UNIPILE_API_KEY;
const UNIPILE_BASE_URL = process.env.UNIPILE_BASE_URL;

export function assertUnipileConfigured(): void {
  if (!UNIPILE_API_KEY || !UNIPILE_BASE_URL) {
    throw new Error("UNIPILE_API_KEY / UNIPILE_BASE_URL manquantes");
  }
}

// TODO (Semaine 1) : lien hébergé de connexion, webhook, envoi de message,
// lecture des réponses — à écrire une fois la doc officielle vérifiée.
