'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { devenirIntensity, TINTS, tintOf } from '@/lib/tints';
import PaletteIcon from '@mui/icons-material/PaletteOutlined';
import PhotoIcon from '@mui/icons-material/PhotoCameraOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import EditableField from '../atoms/editable-field';
import Portrait from '../atoms/portrait';

/** Une colonne d'éphéméride : libellé en petites capitales, valeur dessous. */
const Fact = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography variant="overline" component="p" color="textSecondary">
      {label}
    </Typography>
    <Box sx={{ overflowWrap: 'anywhere' }}>{children}</Box>
  </Box>
);

/**
 * La plaque du personnage : portrait cerclé de sa teinte de lune, nom,
 * Aspect et Devenir. La teinte est d'autant plus présente que le Devenir est
 * élevé ; au-delà de 100, un second cercle marque la transcendance.
 */
const CharacterPlate = ({ id }: { id: string }) => {
  const { sheet, canEdit, update } = useSheet(id);
  const [imageOpen, setImageOpen] = useState(false);
  const [tintAnchor, setTintAnchor] = useState<HTMLElement | null>(null);
  if (!sheet) return null;

  const tint = tintOf(sheet.tint);
  const { level, transcendent } = devenirIntensity(sheet.become);
  // De 6 % à 18 % de teinte sur le fond de la plaque, de 35 % à 100 % sur le cercle.
  const wash = Math.round(6 + 12 * level);
  const ring = Math.round(35 + 65 * level);

  const saveImage = (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    const url =
      new FormData(e.currentTarget as HTMLFormElement)
        .get('avatar')
        ?.toString() ?? '';
    update({ avatar: url.trim() || null });
    setImageOpen(false);
  };

  return (
    <Box
      component="header"
      sx={(theme) => ({
        '--tint': tint.night,
        ...theme.applyStyles('light', { '--tint': tint.day }),
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        // Dès 520 px (demi-écran à côté de Discord), tout tient sur une ligne.
        '@media (min-width: 520px)': {
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        },
        alignItems: 'center',
        columnGap: { xs: 2, md: 3 },
        rowGap: 2,
        px: { xs: 2, md: 2.5 },
        py: { xs: 1.25, md: 1.75 },
        border: 1,
        borderColor: 'rule',
        borderTop: '2px solid',
        borderTopColor: `color-mix(in srgb, var(--tint) ${ring}%, transparent)`,
        bgcolor: 'background.paper',
        backgroundImage: `linear-gradient(color-mix(in srgb, var(--tint) ${wash}%, transparent), color-mix(in srgb, var(--tint) ${wash}%, transparent))`,
        borderRadius: 1,
      })}
    >
      <Box sx={{ position: 'relative', width: { xs: 56, md: 88 } }}>
        <Portrait
          avatar={sheet.avatar}
          name={sheet.name}
          size={{ xs: 56, md: 88 }}
          sx={{
            bgcolor: sheet.avatar ? 'raised' : undefined,
            border: '2px solid',
            borderColor: `color-mix(in srgb, var(--tint) ${ring}%, transparent)`,
            // Transcendance : un second cercle, détaché du premier.
            boxShadow: transcendent
              ? '0 0 0 3px var(--mui-palette-background-paper), 0 0 0 4px var(--tint)'
              : 'none',
          }}
        />
        {canEdit && (
          <Tooltip title="Changer l'image">
            <IconButton
              size="small"
              aria-label="Changer l'image"
              onClick={() => setImageOpen(true)}
              sx={{
                position: 'absolute',
                right: -6,
                bottom: -6,
                bgcolor: 'raised',
                border: 1,
                borderColor: 'rule',
                '&:hover': { bgcolor: 'raised' },
              }}
            >
              <PhotoIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '1.625rem', md: '2.5rem' },
              overflowWrap: 'anywhere',
            }}
          >
            {canEdit ? (
              <EditableField
                value={sheet.name}
                aria-label="le nom"
                variant="inherit"
                onChange={(name) => update({ name: name || 'Sans nom' })}
              />
            ) : (
              sheet.name
            )}
          </Typography>
          {canEdit && (
            <Tooltip title={`Teinte : ${tint.label}`}>
              <IconButton
                size="small"
                aria-label={`Changer la teinte (${tint.label})`}
                aria-haspopup="dialog"
                onClick={(e) => setTintAnchor(e.currentTarget)}
                sx={{ color: 'var(--tint)' }}
              >
                <PaletteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Typography variant="body2" color="textSecondary">
          Joueur·euse : {sheet.user.name}
          {sheet.teams.length > 0 &&
            ` · Table : ${sheet.teams.map((t) => t.name).join(', ')}`}
          {!canEdit && ' · lecture seule'}
        </Typography>
      </Box>

      <Box
        sx={{
          gridColumn: '1 / -1',
          '@media (min-width: 520px)': { gridColumn: 'auto' },
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          columnGap: { xs: 2, md: 3 },
          justifyContent: { xs: 'start', md: 'end' },
        }}
      >
        <Fact label="Âge">
          <EditableField
            value={sheet.age}
            type="number"
            variant="numeral"
            aria-label="l'âge"
            editable={canEdit}
            onChange={(v) => update({ age: v ? Number(v) : null })}
          />
          {sheet.age ? (
            <Typography component="span" variant="body2" color="textSecondary">
              {' '}
              ans
            </Typography>
          ) : null}
        </Fact>
        <Fact label="Aspect">
          <EditableField
            value={sheet.aspect}
            aria-label="l'Aspect"
            editable={canEdit}
            onChange={(v) => update({ aspect: v })}
          />
        </Fact>
        <Fact label={transcendent ? 'Devenir · transcendé' : 'Devenir'}>
          <EditableField
            value={sheet.become}
            variant="numeral"
            aria-label="le Devenir"
            editable={canEdit}
            onChange={(v) => update({ become: v })}
          />
        </Fact>
      </Box>

      <Popover
        open={Boolean(tintAnchor)}
        anchorEl={tintAnchor}
        onClose={() => setTintAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { p: 1.5, bgcolor: 'raised', border: 1, borderColor: 'rule' },
          },
        }}
      >
        <Typography variant="overline" component="p" color="textSecondary">
          Teinte de lune
        </Typography>
        <Box
          role="radiogroup"
          aria-label="Teinte de lune"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 36px)',
            gap: 1,
          }}
        >
          {TINTS.map((t) => {
            const selected = t.key === tint.key;
            return (
              <Tooltip key={t.key} title={t.label}>
                <Box
                  component="button"
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={t.label}
                  onClick={() => {
                    update({ tint: t.key });
                    setTintAnchor(null);
                  }}
                  sx={(theme) => ({
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    bgcolor: t.night,
                    ...theme.applyStyles('light', { bgcolor: t.day }),
                    border: '2px solid',
                    borderColor: selected ? 'text.primary' : 'transparent',
                    outlineOffset: 2,
                  })}
                />
              </Tooltip>
            );
          })}
        </Box>
      </Popover>

      <Dialog
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        fullWidth
        slotProps={{ paper: { component: 'form', onSubmit: saveImage } }}
      >
        <DialogTitle>Image du personnage</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="avatar"
            label="Adresse (URL) de l'image"
            placeholder="https://…"
            defaultValue={sheet.avatar ?? ''}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageOpen(false)}>Annuler</Button>
          <Button type="submit" variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CharacterPlate;
