'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';

/** Lien « Retour » (un seul élément interactif : pas de bouton dans un lien). */
const BackButton = ({ href }: { href: string }) => (
  <IconButton component={Link} href={href} aria-label="Retour" color="primary">
    <ArrowBackIcon />
  </IconButton>
);

export default BackButton;
