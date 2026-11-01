# Lunes d'Oniria — fiches de personnages

Application de gestion des fiches de personnages et des tables de jeu pour le
JdR **Oniria**. Elle reprend les règles du tableur de référence
« Lunes d'Oniria - Fiches de personnages » (onglet _Modèle_).

Stack : Node.js 26, Next.js 16 (App Router), React 19, MUI 9, Prisma 7 +
PostgreSQL, Auth.js v5 (Google), SWR.

## Fonctionnalités

- **Fiche de personnage** en 5 onglets :
  - _Caractéristiques_ : Visage (nom, âge, Maï, aspect, devenir), Caractères,
    Facultés, Existences (santé, équilibre, éclat), Expériences (éprouver,
    apprendre, vivre).
  - _Traits_ : innés (avec balance et contrôle d'équilibre) et acquis.
  - _Schémas & Compétences_ : Corpus, Spyrée, Âmée, compétences Générales /
    Spyrales / Martiales en arbre (compétence › base › principe › maîtrise ou
    technique), Sortilèges, Golems.
  - _Inventaire_ : armes de mêlée, armes de tir, armures, objets.
  - _Notes_ : éditeur Markdown.
- **Droits** : chacun·e modifie ses fiches, consulte celles des autres en
  lecture seule ; les MJ (rôle `ADMIN`) modifient tout.
- **Tables de jeu** (MJ) : ajout/retrait de personnages et vue d'ensemble
  (santé, équilibre, éclat, Maï, initiative, protection, encombrement…).
- **Whitelist** (MJ) : seules les adresses whitelistées peuvent se connecter.

## Règles calculées

Toutes les règles sont dans [`src/lib/rules/index.ts`](src/lib/rules/index.ts)
et testées avec des fiches réelles du tableur
([`rules.test.ts`](src/lib/rules/rules.test.ts)).

| Valeur                                    | Formule (comme dans le tableur)                                     |
| ----------------------------------------- | ------------------------------------------------------------------- |
| Corps / Esprit / Âme                      | somme des 4 caractères / 5                                          |
| Coût XP d'un caractère                    | 1 par point jusqu'à 25, 2 jusqu'à 50, 4 jusqu'à 75, 8 au-delà       |
| Faculté                                   | majeur + min(majeur, mineur)                                        |
| Marge d'une faculté                       | (majeur − 50) / 5 si majeur > 50, + bonus du Corpus sur le majeur   |
| Santé max                                 | Vigueur / 10 + bonus de santé du Corpus ; seuil : Vigueur / 5       |
| Équilibre max                             | Entendement / 10 ; seuil : Entendement / 5                          |
| Éclat max, Maï                            | Âme / 10 ; seuil d'éclat : Âme / 5                                  |
| Dégâts                                    | Force / 10 − 5                                                      |
| Initiative, Impact, Impulsion, Conduction | Vivacité, Raisonnement, Perception, Concentration / 10              |
| Protection                                | armures portées : protection actuelle / maximale                    |
| Encombrement                              | somme des encombrements (%) de l'équipement porté (armures + armes) |

Chaque aspect du Corpus peut porter un bonus sur un caractère ou sur la santé
(colonnes « Bonus » et « + »). Un bonus de +1 en Charisme ajoute 1 à la marge
des facultés dont le Charisme est le majeur ; un bonus de +1 en Santé ajoute 1
à la santé maximale, comme les effets « Cha +1 » ou « Santé +1 » du tableur.

## Développement

Prérequis : Node.js 26, PostgreSQL. Yarn 4 est fourni par le dépôt
(`.yarn/releases`, déclaré dans `.yarnrc.yml`) : n'importe quel `yarn` installé
l'utilise automatiquement.

```bash
yarn install
```

Créer un fichier `.env` :

```bash
POSTGRES_PRISMA_URL=postgresql://user:password@localhost:5432/oniria
POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/oniria
AUTH_SECRET=...            # npx auth secret
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

```bash
yarn prisma:push   # crée / met à jour les tables
yarn prisma:seed   # remplit les catalogues de règles
yarn dev           # http://localhost:3000
yarn test          # tests des règles et de la validation
yarn lint
```

Pour devenir MJ : ajouter son email dans la table `Whitelist`, se connecter une
première fois, puis passer `role` à `ADMIN` dans la table `users`
(`yarn prisma:studio`).

## Catalogues de règles

Les types de Corpus, les potentiels de la Spyrée (catégorie › type ›
potentiel) et les compétences générales, spyrales et martiales (avec leurs
descriptions et prérequis) sont des catalogues définis dans
[`prisma/seeds`](prisma/seeds). Pour les créer ou les mettre à jour :

```bash
yarn prisma:seed
```

Le seed n'utilise que des `upsert` : on peut le relancer sans créer de
doublons et sans toucher aux fiches. Les propriétés d'équipement
(Pesante, Déployable…) sont un catalogue que les MJ enrichissent directement
depuis l'onglet Inventaire.

Une compétence ne peut être ajoutée à une fiche que si l'un de ses prérequis
est déjà acquis ; et on ne peut pas retirer une compétence dont une autre
dépend.
