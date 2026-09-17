# Roadmap — six semaines

Rythme réel : 6 à 8 heures par semaine, en parallèle d'une session
universitaire. Un seul objectif par semaine. Si un deuxième s'ajoute, c'est le
premier qui meurt.

## Semaine 0 — le squelette (une séance)

Scaffold Next.js, déploiement Vercel, CNAME `app.rentice.app`, page
`/c/[token]` qui affiche « Bonjour {prénom} » depuis une ligne en base.

Ça ne fait rien d'utile. Mais quand ce squelette tourne en production sur le bon
domaine, tout le reste n'est plus que du remplissage.

## Semaine 1 — la connexion mail

Lien hébergé Unipile généré, webhook reçu, `account_id` stocké, **un email réel
envoyé depuis une vraie boîte Gmail via l'API**.

C'est le seul morceau qui peut invalider le projet entier. On veut le savoir à
six heures de travail, pas à quarante. Démarre l'essai gratuit Unipile
exactement maintenant, pas avant.

*Critère de sortie : un email reçu dans une boîte de test, expédié depuis un
compte connecté par le flux hébergé.*

## Semaine 2 — le moteur de ciblage

Brief en langage naturel → 50 entreprises réelles, chacune avec sa phrase de
justification.

*Critère de sortie : rejouer trois campagnes passées, 60 % de recouvrement
minimum avec la liste manuelle, zéro entreprise inventée. Si ce critère n'est
pas atteint, on ne passe pas en semaine 3.*

## Semaine 3 — chat et panneau

L'étudiant affine son ciblage et coche sa liste. Tokens visuels extraits de la
landing en préalable.

## Semaine 4 — rédaction, planification, envoi

Trois messages éditables, table `scheduled_sends`, Vercel Cron, bouton d'envoi
sur l'écran `ready`.

## Semaine 5 — réponses et conformité

Webhook entrant, annulation des relances sur réponse, panneau en mode suivi,
rapport final. DPA Unipile signé, politique de confidentialité mise à jour.

## Semaine 6 — cinq campagnes réelles

Des vrais étudiants, des vrais recruteurs. Corrections. Déconnexion automatique
des comptes en fin de campagne.

## Après

Novembre et décembre : entretiens alumni et approche NEOMA. Janvier : vague des
stages, publiée janvier-mars. Mars-mai : campagne alternance, la grosse fenêtre.

## Comment ce plan meurt

En voulant refaire la landing en semaine 3 parce que le raccord visuel irrite.
Note l'irritation, ne la traite pas.

Deuxième façon : ajouter une fonctionnalité spécifique aux stages. Les stages
sont une valeur dans `contract_type`, rien d'autre. Aucun écran dédié, aucune
logique séparée.
