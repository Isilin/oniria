'use client';

import { Box, Tooltip, Typography } from '@mui/material';
import { alpha, SxProps, Theme } from '@mui/material/styles';

/** Apparence des parties de la barre, partagée avec la légende. */
export const XP_BAR_PARTS = {
  spent: {
    label: 'Dépensée',
    sx: { bgcolor: 'primary.main' },
  },
  pending: {
    label: 'À payer à la validation',
    sx: (theme: Theme) => ({
      backgroundImage: `repeating-linear-gradient(45deg, ${theme.palette.primary.main} 0 5px, ${alpha(theme.palette.primary.main, 0.4)} 5px 10px)`,
    }),
  },
  left: {
    label: 'Restante',
    // Contour net plutôt qu'aplat pâle : la part restante reste lisible
    // de nuit comme de jour, sans se confondre avec la part dépensée.
    sx: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.14),
      boxShadow: `inset 0 0 0 1.5px ${theme.vars?.palette.primary.main ?? theme.palette.primary.main}`,
    }),
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
  spent: number;
  /** XP restante (gagnée − dépensée), négative en cas de dépassement. */
  left: number;
  /** Part de la restante réservée à la validation de la création ou du reset. */
  pending?: number;
}

/**
 * Une catégorie d'XP : le total, et une barre dont on survole chaque partie
 * (dépensée, à payer à la validation, restante) pour en voir la valeur.
 */
const XpBar = ({
  label,
  description,
  gained,
  spent,
  left,
  pending = 0,
}: Props) => {
  const negative = Math.max(0, -left);
  const parts: { part: XpBarPart; value: number }[] = [
    { part: 'spent' as const, value: Math.max(0, spent - negative) },
    { part: 'negative' as const, value: negative },
    { part: 'pending' as const, value: Math.min(pending, Math.max(0, left)) },
    { part: 'left' as const, value: Math.max(0, left - pending) },
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
            <Tooltip key={part} title={text} arrow enterTouchDelay={0}>
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
