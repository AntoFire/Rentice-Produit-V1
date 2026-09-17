# Interface

## Continuité avec la landing

Avant d'écrire une ligne de style : lis le CSS compilé de `https://rentice.app`
en production et extrais un `docs/tokens.css` — couleurs, familles de police,
rayons, échelle d'espacement, poids typographiques.

Ce fichier est une contrainte, pas une suggestion. L'app doit donner
l'impression d'être le même produit que la landing. Un étudiant qui passe de
l'une à l'autre ne doit pas sentir de rupture.

Ne réinvente pas de direction artistique. La marque existe déjà.

## Disposition

Un seul écran, `/c/[token]`, qui change selon l'état de campagne.

```
┌──────────────────────────┬──────────────────────────┐
│  CHAT                    │  PANNEAU                 │
│                          │                          │
│  L'agent propose,        │  État réel de la         │
│  l'étudiant corrige      │  campagne                │
│                          │                          │
│  « ajoute Lyon »         │  52 entreprises          │
│  « plutôt des PME »      │  [ ] Maison Dupont …     │
│                          │  [x] Logistix SA …       │
│                          │                          │
│                          │  [ Valider ma liste ]    │
└──────────────────────────┴──────────────────────────┘
```

Le chat pilote, le panneau montre l'état. Sur mobile, le panneau passe en
premier et le chat devient un tiroir — l'étudiant regarde plus souvent son
avancement qu'il ne discute.

## Le panneau selon l'état

- `targeting` — liste des entreprises, cases à cocher, la `rationale` visible
  sous chaque nom, pas repliée
- `drafting` — les trois messages, éditables, avec un aperçu sur une cible réelle
- `ready` — récapitulatif, et un seul bouton d'envoi
- `running` — envoyés / ouverts / réponses, et la prochaine relance datée
- `done` — rapport

## Écriture

Tutoiement pour l'étudiant, vouvoiement dans les emails aux recruteurs.
Phrases courtes, verbes actifs. Un bouton dit ce qu'il fait : « Valider ma
liste », « Envoyer ma campagne ». Le même mot est gardé du bouton au message de
confirmation.

Les chiffres sont en langage humain. « 23 étudiants ont postulé ici » plutôt que
« n=23 ».

Un écran vide est une invitation à agir, jamais un espace mort. Une erreur dit
ce qui s'est passé et quoi faire, sans s'excuser.

## Le moment critique

L'écran `ready` est le plus important du produit. Ces emails partiront au nom
d'une vraie personne, depuis sa vraie boîte. Il doit afficher sans ambiguïté :
combien d'emails, vers qui, depuis quelle adresse, et sur combien de jours.

Une confirmation explicite, et aucune façon de déclencher un envoi par
accident ou depuis le chat.

## Qualité minimale

Responsive jusqu'au mobile. Focus clavier visible. Mouvement réduit respecté.
Contrastes accessibles. Pas d'animation décorative.
