---
version: 1
slug: "src-app-main-sheet-id-page-tsx"
primary_target: "src/app/(main)/sheet/[id]/page.tsx"
related_targets: ["src/app/providers.tsx"]
---

# Fiche de personnage

Mode: Operate. Surface: la fiche (`/sheet/[id]`), première expression d'un monde qui habille toute l'app par le thème.

Audience et tâche : joueur·euse en pleine partie sur Discord, le soir ; MJ qui suit et distribue l'XP. Sans défiler : Caractères (majeur), Facultés (mineur), Existences, Maï, combat. Santé / Équilibre / Éclat / Maï se modifient en un geste (−/+). Personnalisation : teinte de lune par personnage (choisie par le joueur ou le MJ), intensité liée au Devenir (base 0–100, au-delà = transcendance) ; réglages par compte (thème, densité, sections repliées). À éviter : fatiguer les yeux, trahir le jeu.

Décisions ouvertes : aucune ; l'échelle du Devenir est fixée à 0–100 dans une seule constante.

## Direction contract

THESIS: La fiche se lit comme une page d'éphémérides des Lunes : chaque valeur à sa place dans des colonnes au cordeau, les Existences comme des phases de lune. Elle refuse la grille de cartes identiques à titre centré de l'outil générique.

OWN-WORLD: Encre de nuit (#11131c) et surfaces à peine plus claires, os (#e8e2d3) pour le texte, argent (#a9b1c2) pour le secondaire, or de lampe (#d9a441) pour l'interaction ; jour = papier os et encre. Filets d'un pixel, pas d'ombre au repos, coins de 2 px. Spectral pour noms et chiffres tabulaires, Alegreya Sans SC en petites capitales espacées pour les en-têtes, Alegreya Sans pour l'interface.

STORY: Le joueur ouvre sa fiche et voit d'un coup sa lune (portrait, Aspect, Devenir), ses Existences en phases et toutes ses valeurs de jeu ; il clique −/+ quand il prend un coup, survole un libellé pour la règle de Noème, et rien ne bouge d'autre.

FIRST VIEWPORT: Barre fine (retour, ONIRIA, thème, ⋯). Plaque du personnage : portrait cerclé de sa teinte, nom en Spectral, joueur·euse et table, Aspect et Devenir en colonnes d'éphéméride. Bande d'éphéméride collée en haut : Santé, Équilibre, Éclat, Maï en disques de phase entourés d'un arc de traits (un trait par point), valeur / max, seuil, −/+. Dessous, onglets ; à gauche Caractères en grand (trois colonnes, valeur du groupe, verrou), Facultés en tableau serré ; à droite la colonne combat.

FORM: Éphémérides des Lunes, rang 1 de ma liste (choisi par l'utilisateur comme carte « choix d'Impeccable »), avec la correction utilisateur : arcs de traits de la ligne claire autour des lunes. seed: e5fa620fd594e6e0

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
