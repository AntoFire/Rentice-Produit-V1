/**
 * Wrapper API La Bonne Alternance / Recherche d'Entreprises — API publiques,
 * sans clé (voir docs/00-configuration-stack.md §0).
 *
 * TODO (Semaine 2, voir docs/03-ciblage.md) : implémenter les appels réels
 * une fois les endpoints confirmés dans la doc officielle.
 */

export async function searchLbaCompanies(_params: {
  romes?: string[];
  city?: string;
}): Promise<unknown> {
  throw new Error("searchLbaCompanies: pas encore implémenté (Semaine 2)");
}
