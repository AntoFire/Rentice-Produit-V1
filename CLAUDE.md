# Rentice — contexte projet

Ce fichier est chargé à chaque session. Lis-le en entier avant toute action.

## Ce qu'est Rentice

Service qui aide des étudiants à décrocher une alternance ou un stage par
candidature spontanée. On cible 40 à 60 recruteurs pertinents, on rédige des
emails personnalisés, on les envoie **depuis la boîte mail de l'étudiant**, et on
relance. Prix : 49 € par campagne, sans abonnement.

Aujourd'hui le service est délivré à la main (Jotform → Apollo → Lemlist).
Ce dépôt construit la version produit : l'étudiant construit sa campagne lui-même,
accompagné par un agent, et Rentice exécute.

**Le produit n'est pas un jobboard, ni un tracker de candidatures.** C'est un
constructeur de campagne de candidature spontanée.

## Règles dures — ne jamais les contourner

1. **Le modèle n'envoie jamais d'email.** Il propose, classe, rédige. Un envoi
   ne part que d'un clic humain sur un écran affichant la liste finale et les
   textes finaux. Aucun outil `send_email` n'est exposé au LLM côté produit.
2. **Aucune entreprise n'entre dans une campagne sans venir d'un appel d'outil.**
   Le LLM peut retirer, trier, hiérarchiser, justifier. Il n'invente jamais un
   nom d'entreprise ni une adresse email.
3. **Rien ne s'affiche sans source ni date.** Toute donnée montrée à l'étudiant
   doit pouvoir dire d'où elle vient et quand elle a été vue.
4. **Les clés API ne sortent jamais du serveur.** Tous les appels Anthropic,
   Apollo, Unipile passent par des route handlers Next.js.
5. **Un compte mail connecté est déconnecté à la fin de la campagne.** La
   facturation Unipile est mensuelle par compte connecté.

## Stack

- Next.js (App Router) + TypeScript, déployé sur Vercel
- Supabase (Postgres + storage pour les CV)
- API Anthropic pour le ciblage et la rédaction
- Apollo + API La Bonne Alternance comme sources d'entreprises et de contacts
- Unipile pour la connexion boîte mail, l'envoi et la lecture des réponses
- Vercel Cron pour la planification des relances
- Tailwind, contraint par `docs/tokens.css`

Pas d'authentification : accès par lien signé `/c/{token}`.

## Conventions

- Tout le texte visible par l'utilisateur est en français, tutoiement.
- Nommage du code et du schéma en anglais.
- Pas de `any` en TypeScript.
- Chaque appel externe est encapsulé dans `lib/<service>.ts`, jamais appelé
  directement depuis un composant.
- Les prompts vivent dans `prompts/*.md`, jamais en dur dans le code.

## Ce qu'on ne construit pas

Système de comptes. Tunnel de paiement (lien Stripe manuel). Espace admin
(on lit la base). Refonte de la landing (elle reste sur Netlify, intacte).
Application mobile. Multi-campagne dans l'interface.

Si une tâche demandée sort de ce périmètre, signale-le avant de coder.

## Documents

- `docs/01-produit.md` — parcours utilisateur et états de campagne
- `docs/02-architecture.md` — schéma de données, arborescence, variables d'env
- `docs/03-ciblage.md` — le moteur de ciblage (cœur du produit)
- `docs/04-sequence-emails.md` — rédaction, séquence, planification
- `docs/05-unipile.md` — connexion mail, envoi, réponses
- `docs/06-interface.md` — chat + panneau, direction visuelle
- `docs/07-roadmap.md` — six semaines, avec critères de sortie
- `docs/08-conformite.md` — RGPD, DPA, mentions obligatoires

## Méthode de travail attendue

Avant d'écrire du code sur un sujet, lis le document correspondant.
Propose un plan court, attends validation, puis implémente.
Ne lance jamais d'appel réel à Unipile ou Apollo en développement sans le dire.
