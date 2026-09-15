/**
 * Wrapper Apollo.io — sourcing d'entreprises et de contacts.
 *
 * TODO (Semaine 2, voir docs/03-ciblage.md) : implémenter les appels réels
 * une fois le plan Apollo confirmé (quota, coût par contact enrichi — à
 * vérifier avant d'industrialiser, cf. docs/00-configuration-stack.md §0).
 * Ne jamais appeler l'API Apollo directement depuis une route ou un
 * composant : tout passe par ce fichier.
 */

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

export async function searchApolloContacts(_params: {
  organizationDomain?: string;
  titles?: string[];
}): Promise<unknown> {
  if (!APOLLO_API_KEY) {
    throw new Error("APOLLO_API_KEY manquante");
  }
  throw new Error("searchApolloContacts: pas encore implémenté (Semaine 2)");
}
