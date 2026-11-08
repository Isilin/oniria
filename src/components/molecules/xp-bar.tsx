'use client';

import { Box, Tooltip, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { EASE_PEN, MOTION } from '@/theme/theme';
import { useState } from 'react';

/** Variables CSS du thème : la couleur suit la nuit et le jour. */
const PRIMARY = 'var(--mui-palette-primary-main)';
const SUCCESS = 'var(--mui-palette-success-main)';
const ERROR = 'var(--mui-palette-error-main)';
const mix = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;
const stripes = (color: string) =>
  `repeating-linear-gradient(45deg, ${color} 0 5px, ${mix(color, 40)} 5px 10px)`;

/** Apparence des parties de la barre, partagée avec la légende. */
export const XP_BAR_PARTS = {
  spent: {
    label: 'Dépensée',
    sx: { bgcolor: 'primary.main' },
  },
  lost: {
    // Rayée comme l'élément qu'elle payait : hachures d'encre rouge.
    label: 'Perdue',
    sx: {
      bgcolor: mix(ERROR, 25),
      backgroundImage: `repeating-linear-gradient(-45deg, ${ERROR} 0 2px, transparent 2px 6px)`,
    },
  },
  pending: {
    label: 'À payer à la validation',
    sx: { backgroundImage: stripes(PRIMARY) },
  },
  draft: {
    label: 'Points en attente',
    sx: { backgroundImage: stripes(SUCCESS) },
  },
  left: {
    label: 'Restante',
    // Contour net plutôt qu'aplat pâle : la part restante reste lisible
    // de nuit comme de jour, sans se confondre avec la part dépensée.
    sx: {
      bgcolor: mix(PRIMARY, 14),
      boxShadow: `inset 0 0 0 1.5px ${PRIMARY}`,
    },
  },
  negative: {
    label: 'Solde négatif',
    sx: { bgcolor: 'error.main' },
  },
} satisfies Record<string, { label: string; sx: SxProps<Theme> }>;

export type XpBarPart = keyof typeof XP_BAR_PARTS;

interface Props {
  label: string;
  description?: string;
  /** XP gagnée (le total). */
  gained: number;
  /** XP dépensée, XP perdue comprise. */
  spent: number;
  /** Part de la dépensée qui a été perdue (éléments rayés). */
  lost?: number;
  /** XP restante (gagnée − dépensée), négative en cas de dépassement. */
  left: number;
  /** Part de la restante réservée à la validation de la création ou du reset. */
  pending?: number;
  /** Part de la restante que coûteraient les points en attente. */
  draft?: number;
}

/**
 * Une catégorie d'XP : le total, et une barre dont on survole chaque partie
 * (dépensée, perdue, à payer à la validation, restante) pour en voir la
 * valeur.
 */
const XpBar = ({
  label,
  description,
  gained,
  spent,
  lost = 0,
  left,
  pending = 0,
  draft = 0,
}: Props) => {
  // De l'XP reçue : la part restante se remplit à la plume, de gauche à
  // droite. Rien au premier affichage.
  const [previous, setPrevious] = useState(gained);
  const [fills, setFills] = useState(0);
  if (gained !== previous) {
    // Valeur dérivée pendant le rendu (et non dans un effet).
    setPrevious(gained);
    if (gained > previous) setFills(fills + 1);
  }

  const negative = Math.max(0, -left);
  const reserved = Math.min(pending, Math.max(0, left));
  const drafted = Math.min(draft, Math.max(0, left - reserved));
  const invested = Math.max(0, spent - negative);
  const wasted = Math.min(Math.max(0, lost), invested);
  const parts: { part: XpBarPart; value: number }[] = [
    { part: 'spent' as const, value: invested - wasted },
    { part: 'lost' as const, value: wasted },
    { part: 'negative' as const, value: negative },
    { part: 'pending' as const, value: reserved },
    { part: 'draft' as const, value: drafted },
    { part: 'left' as const, value: Math.max(0, left - reserved - drafted) },
  ].filter((p) => p.value > 0);
  const scale = parts.reduce((total, p) => total + p.value, 0);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 1,
        }}
      >
        <Typography variant="h5">{label}</Typography>
        {/* Ce qui reste est ce dont on parle à la table : il passe en tête. */}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          reste{' '}
          <Typography
            component="span"
            variant="numeral"
            color={left < 0 ? 'error' : 'textPrimary'}
            sx={{ fontSize: '1.375rem' }}
          >
            {left}
          </Typography>{' '}
          / {gained}
        </Typography>
      </Box>
      {description && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: 'block', mb: 1, minHeight: { sm: 40 } }}
        >
          {description}
        </Typography>
      )}
      <Box
        role="group"
        aria-label={`${label} : reste ${left} XP sur ${gained}`}
        sx={{
          display: 'flex',
          height: 16,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'action.hover',
        }}
      >
        {parts.map(({ part, value }) => {
          const text = `${XP_BAR_PARTS[part].label} : ${part === 'negative' ? `−${value}` : value} XP`;
          return (
            <Tooltip
              // La part restante repart de zéro à chaque XP reçue.
              key={part === 'left' ? `left-${fills}` : part}
              title={text}
              arrow
              enterTouchDelay={0}
            >
              <Box
                tabIndex={0}
                aria-label={text}
                sx={[
                  {
                    width: `${(value / scale) * 100}%`,
                    minWidth: 4,
                    cursor: 'help',
                    transition: 'width 0.3s',
                    '&:hover, &:focus-visible': {
                      filter: 'brightness(1.25)',
                      outline: 'none',
                    },
                  },
                  XP_BAR_PARTS[part].sx,
                  part === 'left' &&
                    fills > 0 && {
                      transformOrigin: 'left',
                      animation: `oniria-fill ${MOTION.write}ms ${EASE_PEN} both`,
                      '@media (prefers-reduced-motion: reduce)': {
                        animation: 'oniria-fade 300ms ease-out both',
                      },
                    },
                ]}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

/** Légende des parties présentes dans les barres. */
export const XpBarLegend = ({ parts }: { parts: XpBarPart[] }) => (
  <Box
    sx={{
      display: 'flex',
      gap: 2,
      flexWrap: 'wrap',
      justifyContent: 'center',
      mt: 1.5,
    }}
  >
    {parts.map((part) => (
      <Box key={part} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          sx={[
            { width: 14, height: 10, borderRadius: 1 },
            XP_BAR_PARTS[part].sx,
          ]}
        />
        <Typography variant="caption" color="textSecondary">
          {XP_BAR_PARTS[part].label}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default XpBar;
