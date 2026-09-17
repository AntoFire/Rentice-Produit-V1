# Unipile — boîte mail de l'étudiant

## Pourquoi Unipile

Les emails partent de la vraie boîte de l'étudiant : son identité, sa
délivrabilité, pas de warmup de domaine, et chaque étudiant est isolé — un
problème sur un compte n'emporte pas les autres campagnes.

Passer en direct par l'API Gmail imposerait une vérification Google de plusieurs
semaines et une évaluation CASA pour les scopes sensibles. Unipile porte cette
vérification à notre place : on ne fait aucun setup OAuth de notre côté.

## Le flux de connexion

1. Le serveur appelle `POST /api/v1/hosted/accounts/link` avec l'en-tête
   `X-API-KEY`, en précisant le type de fournisseur (`GOOGLE`, `MICROSOFT`,
   `IMAP`), l'`api_url` et une date d'expiration.
2. On reçoit une URL. L'étudiant clique, passe l'écran de consentement standard
   de son fournisseur.
3. Unipile stocke les tokens et notifie notre webhook avec un `account_id`.
4. On enregistre `campaigns.unipile_account_id`.

On ne manipule jamais d'identifiants.

**Vérifie les noms de champs exacts et les endpoints dans la doc officielle
avant d'implémenter.** Les signatures ci-dessus viennent d'exemples publics et
peuvent avoir bougé.

## Envoi

Un appel par message, avec `account_id` et le destinataire. Le cron de dispatch
espace les envois d'une même campagne (quelques minutes entre chaque) plutôt que
d'envoyer 50 messages en une rafale.

## Réception des réponses

Webhook entrant. À chaque email reçu sur le compte connecté, on cherche si
l'expéditeur correspond à une cible de la campagne. Si oui : `replied_at`,
extrait de la réponse, et annulation des relances programmées pour cette cible.

Cas à gérer explicitement, c'est là que part le temps :
- réponse automatique d'absence → ne compte pas comme une réponse
- accusé de réception automatique → idem
- réponse depuis une adresse différente de celle contactée → rattacher par
  domaine et par sujet
- fil cassé, sujet modifié par le recruteur

## Facturation — règle opérationnelle

La facturation est par compte connecté et par mois, avec un plancher mensuel.
Un compte laissé connecté après la fin d'une campagne coûte tous les mois pour
rien.

**La déconnexion est une étape automatique du passage à l'état `done`.** Ce
n'est pas une tâche de ménage, c'est dans le code.

## Conformité

Unipile synchronise des copies de messages dans son cloud européen. Cela fait de
Rentice un responsable de traitement sur la boîte mail de ses utilisateurs.
Voir `08-conformite.md`. Le DPA doit être signé avant la première connexion d'un
compte réel.
