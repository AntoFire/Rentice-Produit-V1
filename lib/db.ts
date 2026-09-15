import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté serveur, avec la clé service_role.
 *
 * Règle dure (voir docs/00-configuration-stack.md et CLAUDE.md) :
 * SUPABASE_SERVICE_ROLE_KEY ne doit JAMAIS être exposée côté client. Tout
 * accès à la base passe par ce fichier — ne pas appeler Supabase directement
 * depuis un composant ou une route sans passer par ici.
 */
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}

export const db = createClient(
  getEnv("SUPABASE_URL"),
  getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: { persistSession: false },
  }
);
