# Configuration de la stack — tuto pas à pas

Ce document est le guide pratique pour monter l'environnement décrit dans
`CLAUDE.md` et `02-architecture.md`. Il correspond à la Semaine 0 de la
roadmap (`07-roadmap.md`) plus la création de tous les comptes externes dont
les semaines suivantes auront besoin, pour ne pas les découvrir en cours de
route.

Rappel de la stack cible :

| Brique | Rôle |
|---|---|
| Next.js (App Router) + TypeScript | Application, déployée sur Vercel |
| Supabase | Postgres + storage (CV) |
| API Anthropic | Ciblage et rédaction |
| Apollo + API La Bonne Alternance | Sources d'entreprises et de contacts |
| Unipile | Connexion boîte mail étudiante, envoi, lecture des réponses |
| Vercel Cron | Déclenchement des relances programmées |
| Tailwind | Style, contraint par `docs/tokens.css` |

Aucune authentification : accès par lien signé `/c/{token}`.

## 0. Prérequis

- Node.js 20+ et npm (`node -v`)
- Un compte GitHub (le dépôt sera connecté à Vercel)
- Un compte Vercel — https://vercel.com
- Un compte Supabase — https://supabase.com
- Une clé API Anthropic — https://console.anthropic.com
- Un compte Apollo avec accès API — https://app.apollo.io (vérifier le plan et
  le coût par contact enrichi avant d'industrialiser, voir `03-ciblage.md`)
- Un compte Unipile, essai gratuit — https://unipile.com (à démarrer dès la
  Semaine 1, pas avant — c'est la brique qui peut invalider le projet)

Rien à faire côté La Bonne Alternance ni Recherche d'Entreprises : ce sont des
API publiques sans clé.

## 1. Scaffold Next.js

Depuis le dossier où doit vivre le dépôt de code (pas ce dossier de docs) :

```bash
npx create-next-app@latest app-rentice \
  --typescript --tailwind --app --eslint \
  --src-dir=false --import-alias "@/*"
cd app-rentice
```

Structure cible à recréer ensuite (voir `02-architecture.md`) :

```
app/
  c/[token]/page.tsx
  api/
    chat/route.ts
    campaign/[id]/route.ts
    unipile/callback/route.ts
    unipile/webhook/route.ts
    cron/dispatch/route.ts
lib/
  anthropic.ts  apollo.ts  lba.ts  unipile.ts  db.ts
prompts/
  ciblage.md  redaction.md
docs/
components/
```

Copie les huit documents de ce dossier (`01-produit.md` à `08-conformite.md`,
plus ce fichier) dans `docs/` du nouveau dépôt — c'est la référence que
`CLAUDE.md` pointe.

Initialise le dépôt Git et pousse-le sur GitHub avant l'étape Vercel :

```bash
git init
git add .
git commit -m "scaffold initial"
gh repo create rentice-app --private --source=. --push
```

## 2. Supabase — base et storage

1. Crée un nouveau projet sur https://supabase.com/dashboard, région Europe
   (proximité RGPD, cf. `08-conformite.md`).
2. Dans l'éditeur SQL du projet, exécute le schéma de `02-architecture.md` :

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  school text,
  level text,
  target_sectors text[],
  target_cities text[],
  cv_url text,
  created_at timestamptz default now()
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  token text unique not null,
  state text not null default 'targeting',
  contract_type text,
  unipile_account_id text,
  interviews_count int default 0,
  created_at timestamptz default now(),
  sent_at timestamptz
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  siret text unique,
  name text not null,
  naf text,
  city text,
  size_band text,
  source text,
  first_seen_at timestamptz default now()
);

create table targets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id),
  company_id uuid references companies(id),
  contact_name text,
  contact_role text,
  contact_email text,
  rationale text not null,
  source text not null,
  status text not null default 'proposed'
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  target_id uuid references targets(id),
  step int not null check (step in (0,1,2)),
  subject text,
  body text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  reply_snippet text
);

create table scheduled_sends (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id),
  due_at timestamptz not null,
  attempts int default 0,
  last_error text,
  done_at timestamptz
);
```

3. Crée un bucket de storage `cv` (privé) pour les CV des étudiants — limite
   2 Mo, PDF uniquement (contrainte reprise dans `04-sequence-emails.md`).
4. Récupère dans `Project Settings > API` : `SUPABASE_URL` et la clé
   `service_role` (`SUPABASE_SERVICE_ROLE_KEY`). Cette clé ne doit jamais
   apparaître côté client — encapsule tout accès Supabase dans `lib/db.ts`.

## 3. Clés API — Anthropic, Apollo, Unipile

- **Anthropic** : https://console.anthropic.com/settings/keys → nouvelle clé
  → `ANTHROPIC_API_KEY`.
- **Apollo** : dans les paramètres API du compte Apollo → `APOLLO_API_KEY`.
  Vérifie le quota du plan avant d'aller en semaine 2 (`03-ciblage.md`).
- **Unipile** : à la création du compte d'essai, l'espace admin donne
  `UNIPILE_API_KEY` et `UNIPILE_BASE_URL` (l'URL dépend du cluster assigné).
  Vérifie les noms de champs et endpoints exacts dans la doc officielle avant
  d'implémenter — les signatures dans `05-unipile.md` viennent d'exemples
  publics qui peuvent avoir bougé.

## 4. Variables d'environnement

Crée `.env.local` à la racine du dépôt (jamais commité — vérifie que
`.gitignore` l'exclut) :

```
ANTHROPIC_API_KEY=
APOLLO_API_KEY=
UNIPILE_API_KEY=
UNIPILE_BASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CAMPAIGN_TOKEN_SECRET=
```

`CAMPAIGN_TOKEN_SECRET` : une valeur aléatoire longue, générée une fois et
stable (`openssl rand -hex 32`). Elle signe le token HMAC du lien
`/c/{token}` — voir `02-architecture.md`.

Aucune de ces variables ne doit porter le préfixe `NEXT_PUBLIC_`. Encapsule
chaque appel externe dans `lib/<service>.ts`, jamais appelé directement
depuis un composant (règle dure de `CLAUDE.md`).

## 5. Déploiement Vercel

1. Importe le dépôt GitHub dans Vercel (https://vercel.com/new).
2. Dans les paramètres du projet Vercel, copie les mêmes variables que
   `.env.local` dans `Settings > Environment Variables` (Production et
   Preview).
3. Dans `Settings > Domains`, ajoute `app.rentice.app`. Vercel donne un
   enregistrement CNAME à créer chez le registrar de `rentice.app` — un
   simple CNAME, sans toucher à la landing Netlify qui reste sur le domaine
   racine (`02-architecture.md` : « Ne pas y toucher »).
4. Déploie. La page `/c/[token]` doit afficher « Bonjour {prénom} » depuis
   une ligne insérée à la main dans `students`/`campaigns` — c'est le
   critère de sortie de la Semaine 0.

## 6. Vercel Cron — planification des relances

Le dispatch des relances (J0/J+4/J+8) ne peut pas reposer sur une app web
seule. Crée `vercel.json` à la racine :

```json
{
  "crons": [
    {
      "path": "/api/cron/dispatch",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

`app/api/cron/dispatch/route.ts` doit lire les lignes `scheduled_sends` dues
(`due_at <= now()` et `done_at is null`), appeler Unipile, marquer `done_at`.
Idempotent — une ligne déjà `done` n'est jamais rejouée. Compteur `attempts`,
abandon après 3 échecs avec notification par email à l'admin
(`02-architecture.md`).

Protège la route cron par un secret Vercel (`Authorization: Bearer
$CRON_SECRET`, variable d'env à ajouter) pour qu'elle ne soit pas appelable
publiquement.

## 7. Continuité visuelle — docs/tokens.css

Avant d'écrire un style : lis le CSS compilé de `https://rentice.app` en
production (vue source ou outils dev du navigateur) et extrais dans
`docs/tokens.css` les couleurs, familles de police, rayons, échelle
d'espacement, poids typographiques (`06-interface.md`). Couleurs de marque
connues : vert `#0D3D2C`, or `#EAC84A`, crème `#E2D4BC` — à vérifier contre le
CSS réel plutôt qu'à réutiliser de mémoire.

Configure Tailwind pour consommer ces tokens plutôt que réinventer une
direction artistique.

## 8. Vérification — critère de sortie Semaine 0

Avant de passer à la Semaine 1 :

- [ ] Le dépôt est sur GitHub, connecté à Vercel
- [ ] `app.rentice.app` répond en production (CNAME actif)
- [ ] `/c/[token]` affiche « Bonjour {prénom} » depuis une ligne Supabase
- [ ] Les 7 variables d'environnement sont posées en local et sur Vercel,
      aucune en `NEXT_PUBLIC_`
- [ ] Le schéma SQL des 6 tables est appliqué sur Supabase
- [ ] `rentice.app` (landing Netlify) n'a pas été touché

## Étape suivante

Semaine 1 (`07-roadmap.md`) : lien hébergé Unipile généré, webhook reçu,
`account_id` stocké, un email réel envoyé depuis une vraie boîte Gmail via
l'API. Démarrer l'essai Unipile à ce moment précis, pas avant. Voir
`05-unipile.md` pour le flux de connexion.
