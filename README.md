# Lunes d'Oniria — fiches de personnages

Application de gestion des fiches de personnages et des tables de jeu pour le
JdR **Oniria**. Elle reprend les règles du tableur de référence
« Lunes d'Oniria - Fiches de personnages » (onglet _Modèle_).

Stack : Node.js 26, Next.js 16 (App Router), React 19, MUI 9, Prisma 7 +
PostgreSQL, Auth.js v5 (Google), SWR.

## Fonctionnalités

- **Fiche de personnage** en 5 onglets :
  - _Caractéristiques_ : Visage (nom, âge, Maï, aspect, devenir), Caractères,
    Facultés, Existences (santé, équilibre, éclat), Expérience (éprouver,
    apprendre, vivre ; voir [Expérience](#expérience)).
  - _Traits_ : innés (avec balance et contrôle d'équilibre) et acquis.
  - _Schémas & Compétences_ : Corpus, Spyrée, Âmée, compétences Générales /
    Spyrales / Martiales en arbre (compétence › base › principe › maîtrise ou
    technique), Sortilèges, Golems.
  - _Inventaire_ : armes de mêlée, armes de tir, armures, objets.
  - _Notes_ : éditeur Markdown.
- **Droits** : chacun·e modifie ses fiches, consulte celles des autres en
  lecture seule ; les MJ (rôle `ADMIN`) modifient tout.
- **Tables de jeu** (MJ) : ajout/retrait de personnages, vue d'ensemble
  (santé, équilibre, éclat, Maï, initiative, protection, encombrement, XP
  restante…) et distribution d'XP à plusieurs personnages.
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

## Expérience

Les règles sont dans [`src/lib/rules/xp.ts`](src/lib/rules/xp.ts) (testées
dans [`xp.test.ts`](src/lib/rules/xp.test.ts)).

**Trois catégories.** Chaque partie de la fiche se paie avec certaines
catégories ; une dépense peut en combiner plusieurs.

| Catégorie | Paie                                                        |
| --------- | ----------------------------------------------------------- |
| Éprouver  | Corps et Âme, compétences martiales et générales, le Corpus |
| Apprendre | Esprit et Âme, compétences spyrales et générales, la Spyrée |
| Vivre     | tout                                                        |

**Coûts.**

| Élément         | Coût                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| Caractéristique | par point : 1 XP jusqu'à 25, 2 jusqu'à 50, 4 jusqu'à 75, 8 jusqu'à 100 |
| Compétence      | base ou principe 10, maîtrise 30, technique 10, enchaînement 20        |
| Corpus          | 5 XP le 1er aspect, 10 le 2e, 15 le 3e…                                |
| Spyrée          | passage au rang I : 10, II : 30, III : 70, IV : 150, V : 310           |

**Déroulement.**

1. Une nouvelle fiche est _en création_ : tout s'y modifie librement. Le MJ
   attribue l'XP de création (raccourci « Création : 700 Vivre »), depuis la
   fiche ou pour toute une table. Le coût de la fiche est calculé en continu ;
   on peut dépasser, mais pas valider tant qu'il manque de l'XP.
2. Le joueur ou le MJ **valide** : le coût est payé (répartition qui garde
   Vivre pour la fin) et la fiche est figée.
3. Ensuite, chaque amélioration est un **achat** : une fenêtre propose une
   répartition entre les catégories autorisées, que le joueur peut changer.
   La dépense est définitive.
4. Le MJ distribue l'XP de chaque session (fiche ou table), et peut :
   - **offrir** un achat (aucune XP dépensée) ;
   - **baisser ou retirer** un élément validé, en remboursant l'XP (dans les
     catégories qui l'avaient payée, la dernière dépense en premier) ou en la
     déclarant perdue ;
   - accorder un **reset**, complet ou d'une partie de la fiche (Corps,
     Esprit, Âme, compétences générales / spyrales / martiales, Corpus,
     Spyrée) : l'XP payée est rendue, la partie redevient libre jusqu'à la
     prochaine validation, et ce qui avait été offert le reste ;
   - retirer de l'XP (montant négatif) ou supprimer une attribution erronée.

Tout est consigné dans l'**historique** de la fiche (attributions, achats,
remboursements, XP perdue, éléments offerts). La fiche signale quand le compte
n'est pas bon, c'est-à-dire quand la valeur des parties validées diffère de
l'XP enregistrée pour elles (par exemple une fiche reprise de l'ancienne
version, dont les dépenses ne sont pas détaillées) ; un reset complet
recalcule tout.

Les fiches existantes avant ce système sont reprises telles quelles et
considérées comme validées : l'XP gagnée et l'XP restante saisies à la main
sont conservées (« XP reprise » et « Dépenses antérieures »).

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

## Déploiement (Vercel)

La commande de build est définie dans [`vercel.json`](vercel.json)
([`scripts/vercel-build.mjs`](scripts/vercel-build.mjs)). Par défaut, **un
build ne modifie jamais la base de données**. Variables d'environnement
(à définir par environnement dans Vercel) :

| Variable                   | Effet                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `POSTGRES_PRISMA_URL`      | Connexion de l'application (pooler).                                                      |
| `POSTGRES_URL_NON_POOLING` | Connexion directe, utilisée par les migrations.                                           |
| `RUN_MIGRATIONS=true`      | Applique les migrations Prisma pendant le build (`prisma migrate deploy`).                |
| `SEED_CATALOG=true`        | Remplit/complète les catalogues de règles (upsert, ne supprime rien).                     |
| `ENABLE_TEST_LOGIN=true`   | Aperçu uniquement : boutons de connexion avec des comptes fictifs (ignoré en production). |

### Migrations

Le schéma évolue par migrations Prisma (`prisma/migrations`), qui transforment
les données existantes au lieu de les écraser. `0_baseline` correspond au
schéma déjà en place sur une base existante (celui de la production, branche
main, créé par Prisma 5 ; copié dans
`prisma/baseline/schema.prisma`).

Avec `RUN_MIGRATIONS=true`, le build :

1. décrit la base dans les logs (nombre de lignes par table, aucun contenu) ;
2. sur une base existante pas encore suivie, pose la baseline **seulement si
   la base correspond exactement au schéma de référence** et **jamais en
   production** ; sinon il s'arrête sans rien modifier et affiche l'écart ;
3. applique les migrations (`prisma migrate deploy`).

En production, la baseline n'est posée que si, en plus,
`ALLOW_PRODUCTION_BASELINE=true` est défini (pour le premier déploiement
seulement ; à retirer ensuite). On peut aussi la poser à la main :

```bash
npx prisma migrate resolve --applied 0_baseline
```

En développement : `yarn prisma:migrate` crée une nouvelle migration.

### Connexion et données de test

Sur un aperçu avec `ENABLE_TEST_LOGIN=true`, la page d'accueil propose de se
connecter en « MJ de test », « Joueuse de test » ou « Joueur de test », sans
Google. À la première connexion, des personnages fictifs (Lyse et Corwin,
validés avec de l'XP à dépenser ; un PNJ resté en création) et une « Table de
test » sont créés. En local :

```bash
yarn prisma:seed-test
```

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
