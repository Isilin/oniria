---
version: 1
slug: "src-app-main-sheet-id-page-tsx"
primary_target: "src/app/(main)/sheet/[id]/page.tsx"
related_targets: ["src/app/providers.tsx"]
---

# Fiche de personnage

Mode: Operate. Surface: la fiche (`/sheet/[id]`), première expression du carnet d'Oniria, qui habille toute l'app par le thème.

Audience et tâche : joueur·euse en pleine partie sur Discord, le soir ; MJ qui suit et distribue l'XP. Sans défiler : Caractères (majeur), Facultés (mineur), Existences, Maï, combat. Santé / Équilibre / Éclat / Maï se modifient en un geste (−/+). Personnalisation : teinte de lune par personnage (choisie par le joueur ou le MJ), intensité liée au Devenir (base 0–100, au-delà = transcendance) ; réglages par compte (thème, densité, sections repliées). À éviter : fatiguer les yeux, trahir le jeu.

Décisions ouvertes : aucune ; l'échelle du Devenir est fixée à 0–100 dans une seule constante.

## Direction contract

THESIS: La fiche est une feuille de personnage imprimée et remplie à la main, comme sur la table au fil des soirées : ce que le joueur écrit est manuscrit à l'encre bleue, ce que les règles calculent est tapé à la machine. Elle refuse l'interface nette et générique, et ne s'enferme dans aucun genre : Oniria est un multivers de lunes.

OWN-WORLD: « Le carnet d'Oniria ». Papier crème à grain, lignes-guides et marge rouge, double cadre imprimé, bandeau-titre aux phases de lune entre deux fleurons. Encre d'imprimerie brune, encre bleue du stylo pour l'écrit et l'interaction. Courier Prime (machine à écrire), Caveat (main), Special Elite (tampon). Géométries d'atlas (planètes sur orbite, sphère armillaire, constellations), lavis d'aquarelle, gribouillis à la plume. Jour : feuille sur table claire ; Nuit : la même feuille à la bougie.

STORY: Le joueur ouvre sa feuille et retrouve son personnage écrit de sa main : le nom sur sa ligne, le portrait dans son cadre sur un lavis de sa lune, ses Existences en petites planètes dont les points se cochent à la plume. Il clique −/+ quand il prend un coup, survole un libellé tapé pour la règle de Noème, et rien d'autre ne bouge.

FIRST VIEWPORT: Bandeau-titre imprimé (retour, FEUILLE DE PERSONNAGE, phases de lune, ONIRIA, affichage, ⋯). Plaque en encadré imprimé : portrait cadré sur un lavis de la teinte, NOM écrit à la main sur sa ligne, joueur·euse et table tapés, Âge, Aspect et Devenir manuscrits. Encadré des Existences collé en haut : Santé, Équilibre, Éclat, Maï en planètes d'atlas (orbite, phase à l'aquarelle, un point coché par point), valeur manuscrite, max et seuil tapés, −/+. Dessous, onglets ; dès 1440 px, Caractères (valeurs manuscrites, totaux tapés), Facultés (tapées) et combat côte à côte.

FORM: Le carnet d'Oniria, synthèse choisie par l'utilisateur après deux séries de propositions (cadre et bandeau de la feuille d'antan, géométries de l'atlas des lunes, douceur de la rêverie, ambiance du carnet du voyageur), avec la règle manuscrit / machine à écrire et la nuit à la bougie. Hors tirage.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
