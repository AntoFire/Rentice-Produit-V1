# Architecture

## Domaines

- `rentice.app` → landing statique sur Netlify. **Ne pas y toucher.**
- `app.rentice.app` → cette application, sur Vercel. Simple CNAME.

Aucun code partagé entre les deux. Seul `docs/tokens.css` assure la continuité
visuelle.

## Arborescence

```
app/
  c/[token]/page.tsx        écran unique, rendu selon l'état de campagne
  api/
    chat/route.ts           boucle agent (ciblage, rédaction)
    campaign/[id]/route.ts  lecture et mise à jour d'état
    unipile/callback/route.ts  webhook de connexion de compte
    unipile/webhook/route.ts   webhook de réception d'emails
    cron/dispatch/route.ts  envoie les messages programmés dus
lib/
  anthropic.ts  apollo.ts  lba.ts  unipile.ts  db.ts
prompts/
  ciblage.md  redaction.md
docs/
components/
```

## Schéma de données

```sql
students        id, first_name, last_name, email, school, level,
                target_sectors[], target_cities[], cv_url, created_at

campaigns       id, student_id, token, state, contract_type,
                unipile_account_id, interviews_count, created_at, sent_at

companies       id, siret, name, naf, city, size_band, source, first_seen_at
                -- SIRET = pivot. Jamais deux fois la même entreprise.

targets         id, campaign_id, company_id, contact_name, contact_role,
                contact_email, rationale, source, status
                -- status: proposed | accepted | rejected

messages        id, target_id, step (0|1|2), subject, body,
                scheduled_at, sent_at, opened_at, replied_at, reply_snippet

scheduled_sends id, message_id, due_at, attempts, last_error, done_at
```

Règles :
- `companies` est partagée entre toutes les campagnes. C'est ton actif de données.
- `targets.rationale` est la phrase qui justifie la présence de l'entreprise.
  Elle est obligatoire, non vide, et affichée à l'étudiant.
- `targets.source` dit quel outil a produit cette entreprise. Une cible sans
  source est un bug, pas une donnée.

## Variables d'environnement

```
ANTHROPIC_API_KEY
APOLLO_API_KEY
UNIPILE_API_KEY
UNIPILE_BASE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
CAMPAIGN_TOKEN_SECRET
```

Aucune de ces valeurs ne doit apparaître dans du code client. Pas de préfixe
`NEXT_PUBLIC_` sur ces clés.

## Le lien token

Token signé (HMAC) contenant l'id de campagne et une date d'expiration à
45 jours. Pas de session, pas de cookie. Un lien expiré affiche un écran qui
invite à écrire à `rentice.contact@gmail.com`.

## Planification — la brique qu'on oublie

La séquence J0 / J+4 / J+8 implique qu'un email parte quatre jours après un
clic. Rien dans une app web ne fait ça seul.

`scheduled_sends` + un Vercel Cron toutes les 15 minutes qui prend les lignes
dues, appelle Unipile, et marque `done_at`. Idempotent : une ligne déjà `done`
n'est jamais rejouée. Compteur `attempts`, abandon après 3 échecs avec
notification par email à l'admin.
