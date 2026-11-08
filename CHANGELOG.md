# Journal des versions

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et les
numéros de version suivent [SemVer](https://semver.org/lang/fr/). À chaque
version, mettre à jour `version` dans `package.json` et ajouter une section
ici : le tag `vX.Y.Z` et la release GitHub sont créés automatiquement quand
cette version arrive sur `main` (voir `.github/workflows/release.yml`).

## [1.0.0] - non publiée

Première version complète des fiches de personnages d'Oniria.

### Ajouté

- Nouvelle identité « Le carnet d'Oniria » pour toute l'application : une
  feuille de personnage imprimée sur papier crème, avec cadre, bandeau aux
  phases de lune, lignes-guides, planètes et constellations d'atlas,
  lavis d'aquarelle et gribouillis à la plume. Ce que le joueur écrit est
  manuscrit à l'encre bleue ; ce que les règles calculent est tapé à la
  machine. Thème Jour, et thème Nuit à la bougie (même papier, halo ambré).
- Fiche : plaque du personnage en champs imprimés, encadré des Existences
  collé en haut (Santé, Équilibre, Éclat et Maï en petites planètes, un
  point coché par point, −/+ en un geste), et tout ce qui sert en jeu sur
  un seul écran dès 1440 px (Caractères, Facultés, combat).
- Teinte de lune propre à chaque personnage, posée en lavis d'aquarelle
  d'autant plus présent que le Devenir est élevé (au-delà de 100 :
  transcendance, second cadre autour du portrait).
- Réglages enregistrés sur le compte : thème, densité (confort ou
  compacte) et sections repliées.
- Mouvement : une valeur écrite ou modifiée se trace comme à la plume,
  l’aperçu validé « sèche » vers l’encre, les points d’Existence se
  cochent en goutte d’encre, la barre des points glisse depuis le bas, la
  bougie s’allume puis reste fixe, Jour et Nuit passent en fondu
  enchaîné. Rien ne bouge au chargement ; mouvement réduit respecté.
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
- Éléments rayés : le MJ peut rayer un élément de la fiche au lieu de le
  supprimer (traits, aspects du Corpus, potentiels, compétences, Âmée,
  sortilèges, golems, équipement, et des points de caractéristique). Il
  reste sur la fiche, barré d'un trait rouge et sans aucun effet, et l'XP
  payée pour lui est perdue : « Rayé · 15 XP perdus » sous son nom, une
  part « Perdue » hachurée de rouge dans la barre d'XP, une écriture « XP
  perdue » au journal. Les points rayés restent barrés devant la valeur.
  Le MJ peut rétablir un élément, offert ou racheté avec l'XP du
  personnage. Chaque ligne a désormais un menu ⋮ (Rayer, Rétablir,
  Supprimer) à la place de la corbeille. L'export PDF montre les éléments
  rayés.
- Tables de jeu : ajout et retrait de personnages, vue d'ensemble pour le MJ.
- Connexion de test et personnages fictifs, réservés aux aperçus.
- Migrations Prisma, avec vérification de la base avant toute modification.
- Premiers pas :
  - l'accueil dit en une ligne ce qu'est l'application et que la connexion
    est réservée au groupe (le MJ ajoute l'adresse Google) ;
  - une fiche en création montre ses trois étapes (recevoir l'XP de
    création du MJ, répartir les points, valider), cochées à la plume au
    fil de l'eau, avec ce qu'il faut faire ensuite et qui doit le faire ;
    une ligne en haut de la fiche y mène tant qu'elle n'est pas validée ;
  - sur l'accueil, une fiche qui attend son XP ou sa validation porte la
    puce « en création » ou « à valider », comme dans la vue d'ensemble
    des tables ;
  - une page de notes vide invite à écrire, et la barre d'outils de
    l'éditeur est en français.
- Export PDF : une fiche complète s'exporte depuis son menu ⋯ (« Exporter
  en PDF »), pour tout le monde puisque chacun·e lit toutes les fiches ;
  le MJ exporte toutes les fiches d'une table en un seul PDF
  (« Exporter les fiches (PDF) »), précédées d'une page de garde avec la
  vue d'ensemble. Le PDF est la fiche imprimée du carnet, en A4 sur le
  papier Jour : la page de jeu (plaque, Existences en planètes,
  Caractères, Facultés, Combat, Expérience), puis les traits, schémas,
  compétences, sortilèges, golem, inventaire, notes et l'historique de
  l'expérience. Les valeurs sont celles enregistrées.

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
- Typographie : les notes s'écrivent comme une page de cahier (titres et
  paragraphes sur la ligne de 30 px, 75 signes par ligne au plus, petits
  titres soulignés, citation marquée d'un trait de plume, code tapé à la
  machine) et leur barre d'outils est tapée à la machine. Les chiffres des
  Facultés et du combat ont la même taille ; les règles en infobulle se
  lisent sur des lignes plus longues ; dans la vue d'ensemble d'une table,
  le seuil passe sous la valeur et l'XP restante se coupe entre les
  catégories, jamais entre « Vivre » et son montant.
- Pages plus légères : l'italique de la machine à écrire, jamais utilisé,
  n'est plus préchargé (deux fichiers de police en moins).
- Mouvement, pour l'immersion :
  - un onglet s'ouvre comme une page qui tourne, du côté de l'onglet choisi ;
  - un point d'Existence perdu fait partir une onde d'encre de sa planète,
    plus marquée quand l'Existence tombe à 0 ;
  - « Validée » s'abat comme un tampon à la validation de la fiche et à
    chaque achat ;
  - l'XP reçue remplit sa barre à la plume ;
  - les messages arrivent comme un billet glissé sur la feuille, et les
    dialogues se posent dessus ;
  - les valeurs de la bande du téléphone s'écrivent comme les autres.

  Tout se joue une fois, en moins d'une seconde, et rien ne bouge au
  chargement ; en mouvement réduit, il ne reste que des fondus.
- Téléphone et grand écran :
  - sur téléphone, l'encadré des Existences ne reste plus collé en haut (il
    prenait un quart de l'écran, un tiers en paysage) : une bande d'une
    ligne le remplace quand on fait défiler, et un toucher la déplie avec
    ses −/+ ;
  - les tableaux deviennent des blocs lisibles sans défiler de côté ;
  - au doigt, les −/+, boutons et valeurs modifiables offrent une cible de
    44 px, et les règles s'ouvrent d'un toucher ;
  - sur grand écran, la feuille s'élargit pour que les tableaux de
    l'inventaire tiennent sans défiler.
- Mise en page : les onglets Traits, Schémas & Compétences et Inventaire
  sont rangés comme l'onglet Caractéristiques, en sections de la feuille
  (titre frappé et filet) au lieu de cartes empilées ; le résumé de
  l'inventaire tient sur une ligne. Les compétences passent sur deux
  colonnes jusqu'à 1200 px. La page des tables de jeu reprend la
  présentation de l'accueil, avec une carte « Nouvelle table de jeu ».
- Fiche plus réactive et plus sobre :
  - un −/+ (Existence, Maï, caractère) ne redessine plus toute la fiche,
    seulement ce qui change : il s'affiche environ deux fois plus vite
    (React Compiler) et la page devient utilisable plus tôt au chargement ;
  - en Nuit, la bougie ne vacille plus en boucle : la page ne se redessine
    plus en continu au repos, ce qui ménage le processeur graphique et la
    batterie pendant toute une soirée à côté de Discord.
- Dialogues : tous se terminent par « Annuler » et une action en bouton
  plein (« Créer » et « Ajouter », pour une nouvelle fiche ou une nouvelle
  table, ne l'étaient pas encore). Pendant l'envoi, l'action est occupée, les
  champs restent figés et le dialogue ne se ferme pas ; un double clic
  n'envoie qu'une fois.
- Système de design : les durées de mouvement, les filets imprimés et les
  paliers d'écran sont des tokens du thème, et les titres de section, les
  rangées de cartes, la carte « Nouvelle … » et les dialogues sont des
  composants partagés (voir DESIGN.md).

### Corrigé

- Une adresse Google absente de la whitelist arrivait sur la page d'erreur
  d'Auth.js, en anglais et hors de l'application ; elle revient à
  l'accueil avec une note qui explique quoi faire (demander au MJ de
  l'ajouter). Les autres échecs de connexion y reviennent aussi.
- Une fiche neuve affichait « Type » comme Aspect, écrit à l'encre bleue
  comme si on l'avait choisi ; l'Aspect reste vide jusqu'à ce qu'on
  l'écrive (les fiches existantes gardent le leur).
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
- Le libellé « L'Équilibre » était coupé sur tablette et entre 1200 et
  1440 px ; sur téléphone, les libellés des Existences gardent la taille des
  autres libellés (ils tombaient à 10 px).
- Les en-têtes de colonnes ne se coupent plus en deux (« Enc. (%) ») et ceux
  de l'inventaire reprennent le style des autres libellés.
- Des −/+ rapides sur une Existence se perdaient : trois − puis trois +
  à partir de 3 finissaient à 2. Une réponse du serveur remettait l'écran
  en arrière et le clic suivant partait de cette valeur. Désormais la
  dernière modification fait foi à l'écran, et les enregistrements d'une
  fiche partent l'un après l'autre (le dernier clic est le dernier écrit).
- Sur téléphone, « seuil N » des Existences débordait sur le filet de la
  colonne voisine ; il passe sur sa propre ligne, sous la planète.
- Les noms écrits dans les tableaux (armes, armures, objets, traits) ne se
  coupent plus mot par mot ; la corbeille d'une compétence ne se retrouve
  plus seule sur sa ligne.
- Notes : un simple clic dans l'éditeur puis ailleurs pouvait réenregistrer
  l'ancienne version par-dessus des notes changées entre-temps sur un autre
  appareil. Seul ce qui a été tapé s'enregistre, l'éditeur montre la
  version à jour, et quitter la page avec des notes non enregistrées
  demande confirmation.
- L'accueil tombait en page blanche quand la liste des fiches ne se lisait
  pas ; une lecture en échec (fiches, fiche, tables, whitelist,
  compétences) le dit, avec « Réessayer », au lieu d'un chargement sans fin
  ou d'une liste faussement vide (« Aucune adresse »). Sur téléphone, le
  bouton passe sous la phrase au lieu de l'écraser.
- Un double clic sur « Valider » validait la fiche puis affichait « La
  fiche est déjà validée. » ; les suppressions et la connexion Google ne
  partent plus deux fois. Pendant l'envoi, un bouton garde sa place et sa
  couleur, et une petite roue remplace son libellé (il rétrécissait jusqu'à
  presque disparaître) ; « Réessayer » sur une page d'erreur fait de même
  pendant que le serveur la reprépare.
- Réseau coupé : le message disait « Failed to fetch ». Il dit désormais ce
  qui s'est passé et quoi faire ; une session expirée propose de se
  reconnecter, et les billets d'erreur restent jusqu'à ce qu'on les ferme.
- Une adresse inconnue, une fiche ou une table supprimée, une erreur du
  serveur affichaient la page anglaise de Next : elles ont leur page dans
  le carnet (« Page introuvable », « La page n'a pas pu s'afficher »), avec
  le retour à l'accueil et, pour une erreur, « Réessayer » et une référence
  à donner au MJ.
- Un nombre trop grand (âge, quantité, montant d'XP) donnait « Erreur
  serveur. » ; il est refusé avec un message clair. Les textes ont une
  longueur maximale, un nom fait d'espaces donne « Sans nom » pour une
  fiche et n'est plus accepté pour une table.
- Une image de portrait introuvable montrait l'icône d'image cassée : la
  lune à l'initiale reprend sa place. L'initiale d'un nom commençant par
  un emoji n'est plus coupée en deux.
- Un mot sans fin (adresse collée, nom sans espace) débordait de sa ligne,
  ou se faisait rogner dans une rangée « libellé : valeur » ;
  « Autres fiches » sans fiche affichait un titre seul.

### Sécurité

- Toute l'API exige une session ; whitelist et tables réservées aux MJ ;
  champs modifiables filtrés côté serveur.
- Le build Vercel ne modifie plus la base de données (il lançait
  `prisma db push` à chaque déploiement, aperçus compris).

## [0.1.0]

Prototype : connexion Google, whitelist, création de fiches (caractères,
facultés, existences, expériences, notes) et tables de jeu.
