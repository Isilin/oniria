import { Caveat, Courier_Prime, Special_Elite } from 'next/font/google';

// Polices servies par l'application (next/font). Ce que le joueur écrit est
// manuscrit (Caveat) ; ce que les règles impriment est tapé à la machine
// (Courier Prime), les titres frappés au tampon (Special Elite). Partagées
// par le layout et la page d'erreur globale, qui remplace le layout.
const hand = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hand',
});
// Pas d'italique dans le texte tapé (DESIGN.md) : seulement le romain, pour
// ne pas précharger deux fichiers que personne ne lit.
const type = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-type',
});
const stamp = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-stamp',
});

/** Classes à poser sur `<html>` : elles définissent les variables de police. */
export const FONT_VARIABLES = `${hand.variable} ${type.variable} ${stamp.variable}`;
