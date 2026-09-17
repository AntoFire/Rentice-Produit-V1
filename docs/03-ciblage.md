# Le moteur de ciblage

C'est le cœur du produit. Tout le reste est du formulaire. Si le ciblage est
moins bon que ce qu'Antonin produit à la main, le produit n'a pas de raison
d'exister.

## Principe

Le modèle raisonne, les outils fournissent les entreprises. Le modèle ne connaît
pas le marché de l'alternance 2026 et ne connaît aucune adresse email. S'il
génère une liste d'entreprises de mémoire, une partie sera inventée ou périmée,
et l'étudiant signera ces emails de son nom.

**Règle absolue : aucune entreprise n'entre dans `targets` sans provenir d'un
appel d'outil.** Le modèle filtre, ordonne, écarte, justifie.

## Les outils exposés au modèle

| Outil | Rôle |
|---|---|
| `search_companies` | Apollo — entreprises par secteur, taille, localisation |
| `search_apprenticeship_employers` | API La Bonne Alternance — entreprises à fort potentiel d'embauche d'alternants, y compris celles qui ne publient pas d'offre |
| `find_contacts` | Apollo — contacts recruteurs ou managers dans une entreprise donnée |
| `resolve_company` | API Recherche d'Entreprises (data.gouv, ouverte, sans clé) — normalisation SIRET |

Vérifie les endpoints et les paramètres réels dans la documentation officielle
avant d'implémenter. Ne te fie pas à une signature d'API mémorisée.

- Apollo : docs officielles, attention au coût par contact enrichi
- La Bonne Alternance : API publique France Travail / DGEFP
- Recherche d'Entreprises : `https://recherche-entreprises.api.gouv.fr/search`

## La boucle

1. Construire un brief à partir du Jotform et du CV (texte extrait du PDF).
2. Traduire ce brief en plusieurs requêtes **distinctes** plutôt qu'une seule
   large : par secteur, par taille, par ville. Une requête large donne des
   résultats superficiels.
3. Fusionner, dédoublonner sur le SIRET.
4. Écarter : entreprises sans contact trouvable, doublons de groupe, entreprises
   hors périmètre géographique réel de l'étudiant.
5. Ordonner et produire pour chacune une `rationale` d'une phrase.
6. Retourner 50 cibles proposées.

## La phrase de justification

C'est ce qui transforme une extraction Apollo en recommandation, et c'est la
seule partie du produit que le concurrent ne peut pas copier en changeant de
fournisseur de données.

Elle dit pourquoi **cette** entreprise pour **cet** étudiant. Pas de formule
générique. Mauvais : « entreprise leader de son secteur ». Bon : « PME de
80 personnes en logistique du luxe à Roissy, prend des alternants supply chain
chaque septembre, correspond à ton stage chez X ».

## Équilibrage de la liste

Ne remplis pas les 50 places avec les entreprises les plus connues. Vise à peu
près :

- 20 entreprises très demandées — elles motivent l'étudiant
- 25 entreprises pertinentes mais peu visibles — c'est là que les réponses arrivent
- 5 entreprises hors cadre volontaires — élargissement assumé, dit comme tel

## Test de non-régression obligatoire

Avant de construire l'interface, fais tourner le moteur sur **trois campagnes
passées** et compare sa liste à celle construite à la main dans Lemlist.
Si elle est moins bonne, on corrige le moteur. On ne construit pas d'interface
au-dessus d'un ciblage médiocre.

Critère de sortie : au moins 60 % de recouvrement avec la liste manuelle, et
zéro entreprise inventée sur les trois campagnes.

## Coûts à surveiller

Quelques dizaines de centimes de tokens par campagne, négligeable face à 49 €.
L'enrichissement de contacts chez Apollo, lui, se facture au contact et c'est le
poste qui peut casser le prix. Vérifie le quota et le coût unitaire du plan
actuel avant d'industrialiser.
