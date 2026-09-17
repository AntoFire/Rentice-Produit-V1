# Produit — parcours et états

## Le parcours complet

1. L'étudiant arrive sur `rentice.app` (landing Netlify, hors de ce dépôt).
2. Il remplit le Jotform d'onboarding : profil, secteurs cibles, ville, CV.
3. Il paie 49 € (lien Stripe manuel pour l'instant).
4. On lui envoie un lien `app.rentice.app/c/{token}`.
5. **Ce lien unique traverse toute la campagne en changeant d'état.**

## Les cinq états d'une campagne

| État | Ce que voit l'étudiant | Sortie |
|---|---|---|
| `targeting` | Chat + panneau, liste d'entreprises qui se construit | Il valide sa liste |
| `drafting` | Les 3 emails, éditables | Il valide les textes |
| `ready` | Récapitulatif complet + bouton d'envoi | Il clique, un humain n'intervient plus |
| `running` | Suivi : envoyés, ouverts, réponses, jours restants | Fin de séquence |
| `done` | Rapport final | Compte mail déconnecté |

La connexion de la boîte mail se fait entre `drafting` et `ready`. Voir
`05-unipile.md`.

## Le principe d'interface le plus important

**Le chat ne démarre jamais vide.** Quand l'étudiant ouvre son lien pour la
première fois, une première proposition de ciblage est déjà construite à partir
de son Jotform et de son CV : une cinquantaine d'entreprises, chacune avec une
phrase qui dit pourquoi elle est là.

Il corrige. Corriger est facile, initier ne l'est pas. Un curseur clignotant
devant un étudiant qui ne sait pas qui cibler, c'est l'échec du produit — c'est
précisément le travail qu'il nous paie pour faire.

## Ce que l'étudiant doit pouvoir faire en chat

- Élargir ou restreindre : « plutôt des PME », « ajoute Lyon », « pas de conseil »
- Retirer une entreprise et comprendre pourquoi une autre est là
- Changer le ton des messages : « plus court », « moins formel »

## Ce qui ne doit jamais être en chat

- Valider 50 entreprises → liste avec cases à cocher
- Suivre l'avancement → panneau d'état, pas un fil de conversation
- Déclencher l'envoi → bouton dédié sur un écran de récapitulatif

## Garantie

Jusqu'à 3 campagnes si aucun entretien. Dans cette version, la campagne 2 est un
**nouveau lien envoyé à la main**. Ne construis pas de gestion multi-campagne.

## Métrique à suivre dès le premier jour

Le taux de réponse est la métrique d'affichage. **Le nombre d'entretiens
décrochés est la métrique qui engage la garantie.** Les deux sont stockées
séparément. Un champ `interviews_count` sur la campagne, saisi à la main au
besoin, existe dès la v1.
