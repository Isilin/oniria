# Journal des versions

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et les
numéros de version suivent [SemVer](https://semver.org/lang/fr/). À chaque
version, mettre à jour `version` dans `package.json` et ajouter une section
ici : le tag `vX.Y.Z` et la release GitHub sont créés automatiquement quand
cette version arrive sur `main` (voir `.github/workflows/release.yml`).

## [1.0.0] - non publiée

Première version complète des fiches de personnages d'Oniria.

### Ajouté

- Nouvelle identité « Éphémérides des Lunes » pour toute l'application :
  encre de nuit et papier os (thèmes Nuit, Jour, Système), filets d'un
  pixel, Spectral et Alegreya Sans.
- Fiche : plaque du personnage, bande d'éphéméride collée en haut (Santé,
  Équilibre, Éclat et Maï en phases de lune, −/+ en un geste), et tout ce
  qui sert en jeu sur un seul écran (Caractères, Facultés, combat).
- Teinte de lune propre à chaque personnage, d'autant plus présente que le
  Devenir est élevé (au-delà de 100 : transcendance).
- Réglages enregistrés sur le compte : thème, densité (confort ou
  compacte) et sections repliées.
- Fiches complètes reprenant les règles du tableur « Lunes d'Oniria » :
  caractères et coût en XP, facultés et marges (bonus du Corpus), santé,
  équilibre, éclat, Maï, protection et encombrement calculés.
- Onglets Traits (innés et acquis), Schémas & Compétences (Corpus typé,
  Spyrée et compétences choisies dans les catalogues de règles, avec
  prérequis), Inventaire (armes, armures et leurs propriétés, objets),
  sortilèges et golems.
- Catalogues de règles : types de Corpus, potentiels de la Spyrée,
  compétences générales, spyrales et martiales.
- Système d'expérience : trois catégories (Éprouver, Apprendre, Vivre)
  attribuées par le MJ, coûts des caractéristiques, compétences, Corpus et
  Spyrée, création libre puis validation, achats avec répartition entre
  catégories, éléments offerts, retraits avec remboursement ou perte, reset
  complet ou partiel, historique et contrôle du compte. Distribution d'XP à
  toute une table.
- Tables de jeu : ajout et retrait de personnages, vue d'ensemble pour le MJ.
- Connexion de test et personnages fictifs, réservés aux aperçus.
- Migrations Prisma, avec vérification de la base avant toute modification.

### Modifié

- Les caractères se montent point par point, comme dans un jeu vidéo :
  « + » ajoute un point, « − n + » montre les points en attente, puis on
  valide ou on annule. Le reste de la fiche (facultés, existences, Maï, XP…)
  se met à jour en aperçu. Plusieurs caractères s'achètent ensemble, avec une
  répartition par partie, seulement si l'XP suffit. Les « − + » des
  caractères reprennent le cadre de ceux des lunes, et les valeurs restent
  alignées en colonne ; les points en attente s'affichent devant la valeur.
- Node.js 26, Next.js 16, React 19, MUI 9, Prisma 7, Auth.js v5 (bêta 32).
- Fiches en lecture seule pour les autres joueur·euses ; édition réservée à
  la·au propriétaire et aux MJ.
- L'XP n'est plus saisie à la main : les montants existants sont repris dans
  l'historique et les fiches existantes sont considérées comme validées.
- Application nettement plus rapide : fonctions Vercel à Francfort, à côté
  de la base ; une fiche se lit en 2 requêtes SQL au lieu de 26, une
  modification en 3 au lieu de 32 ; un achat d'XP renvoie seulement
  l'écriture ajoutée au journal, sans recharger la fiche ; les pages
  arrivent avec leurs données ; seul l'onglet ouvert est affiché et
  l'éditeur des Notes n'est chargé qu'à son ouverture.
- Whitelist : adresses affichées en entier et en lecture seule, correction
  explicite (« Modifier », Entrée, Échap), ajout libellé, confirmation qui
  nomme l'adresse retirée.
- Les confirmations de suppression nomment ce qui disparaît (fiche, table,
  adresse) et ce qui est conservé ; supprimer une fiche ou une table passe
  par le menu « ⋯ », loin du bouton retour.
- Attribution d'XP : le raccourci « Création : 700 Vivre » n'est proposé que
  pour une fiche en création, le bouton dit ce qu'il fait (« Attribuer 30 XP
  à 2 personnages ») et « Accorder un reset » disparaît d'une fiche encore
  en création.

### Corrigé

- Une modification pouvait disparaître de l'écran quand un autre
  enregistrement se terminait juste après (ex. modifier un objet puis
  cliquer aussitôt sur « Ajouter »).
- Corriger une adresse de la whitelist ne faisait rien (la route `PATCH`
  n'existait pas) ; un ajout refusé par le serveur s'affichait comme réussi.
- Revenir sur l'onglet de la fiche (après Discord, par exemple) effaçait les
  points en attente et faisait clignoter la page ; les fiches, tables et la
  whitelist restent désormais affichées pendant qu'elles sont relues.
- Thème Nuit : contour de focus, sélection de texte et barre de défilement
  prenaient les couleurs du thème Jour (or trop sombre, défilement
  invisible), comme les rayures de la barre d'XP.

### Sécurité

- Toute l'API exige une session ; whitelist et tables réservées aux MJ ;
  champs modifiables filtrés côté serveur.
- Le build Vercel ne modifie plus la base de données (il lançait
  `prisma db push` à chaque déploiement, aperçus compris).

## [0.1.0]

Prototype : connexion Google, whitelist, création de fiches (caractères,
facultés, existences, expériences, notes) et tables de jeu.
