import Box from '@mui/material/Box';
import { PropsWithChildren } from 'react';

/** Largeur d'une carte de liste (fiche, table, carte « Nouvelle … »). */
export const CARD_WIDTH = 250;

/**
 * Une rangée de cartes alignée à gauche, 4 unités entre elles, qui passe à
 * la ligne : les fiches de l'accueil, les tables de jeu.
 */
const CardRow = ({ children }: PropsWithChildren) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{children}</Box>
);

export default CardRow;
