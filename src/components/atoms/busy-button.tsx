'use client';

import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface Props extends ButtonProps {
  /** L'action est en cours : le bouton ne repart pas et le montre. */
  busy?: boolean;
}

/**
 * Le bouton d'une action qui attend le serveur. Occupé, il garde sa place et
 * sa couleur : seul son libellé cède la place à une petite roue, au même
 * endroit. Il ne repart pas (désactivé, donc Entrée dans le formulaire non
 * plus), et son nom reste lisible par les lecteurs d'écran.
 */
const BusyButton = ({
  busy = false,
  disabled,
  variant = 'text',
  children,
  sx,
  ...props
}: Props) => (
  <Button
    {...props}
    variant={variant}
    disabled={busy || disabled}
    aria-busy={busy || undefined}
    sx={[
      { position: 'relative' },
      // Occupé n'est pas indisponible : l'encre du bouton reste la sienne.
      busy && {
        '&.Mui-disabled': {
          contained: {
            color: 'var(--variant-containedColor)',
            backgroundColor: 'var(--variant-containedBg)',
          },
          outlined: {
            color: 'var(--variant-outlinedColor)',
            borderColor: 'var(--variant-outlinedBorder, currentColor)',
          },
          text: { color: 'var(--variant-textColor)' },
        }[variant],
        '& .MuiButton-startIcon, & .MuiButton-endIcon': { opacity: 0 },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {/* Transparent plutôt que caché : la largeur ne bouge pas, et le nom du
        bouton reste lu. */}
    <Box component="span" sx={{ opacity: busy ? 0 : 1 }}>
      {children}
    </Box>
    {busy && (
      <CircularProgress
        aria-hidden
        size={18}
        thickness={5}
        color="inherit"
        // Un arc fixe qui tourne : visible dès la première image, même pour
        // une attente d'un instant.
        disableShrink
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          mt: '-9px',
          ml: '-9px',
        }}
      />
    )}
  </Button>
);

export default BusyButton;
