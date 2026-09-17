# Séquence et rédaction

## La séquence

| Étape | Jour | Rôle |
|---|---|---|
| 0 | J0 | Candidature spontanée |
| 1 | J+4 | Relance courte, apport d'un angle nouveau |
| 2 | J+8 | Dernière relance, sortie propre |

Tous les envois dans la même conversation (même sujet, en réponse au message
précédent) pour que le recruteur retrouve le fil.

Envois uniquement en semaine, entre 8h et 18h heure de Paris. Si une date due
tombe un samedi, elle glisse au lundi. Le cron applique cette règle.

## Rédaction

Le modèle rédige les trois messages à partir du CV, du profil et de la
`rationale` de l'entreprise ciblée. Contraintes :

- Français, tutoiement jamais — on écrit à un recruteur, donc vouvoiement
- Moins de 120 mots pour le J0, moins de 60 pour les relances
- Une accroche spécifique à l'entreprise dans les deux premières phrases
- Jamais de flatterie générique sur la marque
- Une seule demande claire : un échange de 15 minutes
- Signature = prénom, nom, formation, école, téléphone

Ce qui est interdit dans le corps : pièce jointe automatique, lien de tracking
déguisé, mention du fait que l'envoi est automatisé, promesse chiffrée sur le
profil de l'étudiant.

## Personnalisation

Une variable par cible maximum en plus du nom : la `rationale` doit se
transformer en une phrase naturelle, pas être collée telle quelle. Si le modèle
ne trouve rien de spécifique à dire sur une entreprise, la cible est retirée de
la liste plutôt que d'envoyer un message générique.

## Validation

L'étudiant voit les trois textes avec la première cible en exemple réel, et peut
les éditer librement. Il valide une fois pour toute la campagne — pas 50
validations.

Si un texte est édité, la version éditée fait foi et le modèle ne la réécrit
plus.

## Pièce jointe CV

Le CV part en pièce jointe sur le J0 uniquement. Vérifier le poids (< 2 Mo) et
le format (PDF) à l'upload.

## Ce qui déclenche l'arrêt d'une séquence sur une cible

- Une réponse reçue de ce contact → les relances suivantes sont annulées
- Un bounce → cible marquée, pas de relance
- Une demande de désinscription → cible marquée, et l'adresse va dans une table
  de suppression globale
