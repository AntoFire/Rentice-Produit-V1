import Anthropic from "@anthropic-ai/sdk";

/**
 * Client Anthropic côté serveur. Utilisé pour le ciblage et la rédaction
 * (voir prompts/ciblage.md et prompts/redaction.md, à écrire en Semaine 2 —
 * voir 03-ciblage.md et 04-sequence-emails.md).
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
