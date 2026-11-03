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
  draft: {
    label: 'Points en attente',
    sx: (theme: Theme) => ({
      backgroundImage: `repeating-linear-gradient(45deg, ${theme.palette.success.main} 0 5px, ${alpha(theme.palette.success.main, 0.4)} 5px 10px)`,
    }),
  },
  left: {
    label: 'Restante',
    sx: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.22),
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
  /** Part de la restante que coûteraient les points en attente. */
  draft?: number;
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
  draft = 0,
}: Props) => {
  const negative = Math.max(0, -left);
  const reserved = Math.min(pending, Math.max(0, left));
  const drafted = Math.min(draft, Math.max(0, left - reserved));
  const parts: { part: XpBarPart; value: number }[] = [
    { part: 'spent' as const, value: Math.max(0, spent - negative) },
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
        <Typography variant="body1" color={left < 0 ? 'error' : undefined}>
          Total : <strong>{gained}</strong>
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
        aria-label={`${label} : total ${gained} XP`}
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
            { width: 14, height: 10, borderRadius: 0.5 },
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
