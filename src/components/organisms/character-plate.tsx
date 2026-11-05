'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { URL_MAX } from '@/lib/sheet/fields';
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
import { EASE } from '@/theme/theme';
import { DottedPath, SketchMoon } from '../atoms/ornaments';
import Portrait from '../atoms/portrait';

/** Un champ imprimé de la feuille : libellé tapé, valeur écrite sur un trait. */
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
    <Box
      sx={{
        overflowWrap: 'anywhere',
        borderBottom: 1,
        borderColor: 'text.primary',
        pb: 0.25,
        minHeight: 30,
      }}
    >
      {children}
    </Box>
  </Box>
);

/**
 * La plaque du personnage, en tête de la feuille : le portrait dans son
 * cadre, posé sur un lavis de sa teinte de lune, et les champs écrits à la
 * main (nom, âge, Aspect, Devenir). Le lavis est d'autant plus présent que
 * le Devenir est élevé ; au-delà de 100, un second cadre marque la
 * transcendance.
 */
const CharacterPlate = ({ id }: { id: string }) => {
  const { sheet, canEdit, update } = useSheet(id);
  const [imageOpen, setImageOpen] = useState(false);
  const [tintAnchor, setTintAnchor] = useState<HTMLElement | null>(null);
  if (!sheet) return null;

  const tint = tintOf(sheet.tint);
  const { level, transcendent } = devenirIntensity(sheet.become);
  // Lavis de 14 % à 34 % de teinte selon le Devenir.
  const wash = 0.14 + 0.2 * level;

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
      sx={{
        '--tint': tint.day,
        position: 'relative',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        // Dès 760 px, tout tient sur une ligne ; en dessous, les champs Âge,
        // Aspect et Devenir passent sous le nom (la machine à écrire est large).
        '@media (min-width: 760px)': {
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        },
        alignItems: 'start',
        columnGap: { xs: 2, md: 3 },
        rowGap: 2,
        px: { xs: 1.5, md: 2.5 },
        pt: { xs: 1.5, md: 2 },
        pb: { xs: 1.5, md: 2.5 },
        border: '1.5px solid',
        borderColor: 'text.primary',
      }}
    >
      {/* Le lavis de la teinte, qui déborde du portrait comme de l'aquarelle. */}
      <Box
        component="svg"
        viewBox="0 0 300 170"
        aria-hidden
        sx={{
          position: 'absolute',
          left: { xs: -24, md: -40 },
          top: { xs: -10, md: -6 },
          width: { xs: 180, md: 300 },
          height: { xs: 110, md: 170 },
          overflow: 'visible',
          pointerEvents: 'none',
          animation: 'oniria-fade 700ms ease-out both',
          '& ellipse': {
            transition: 'fill 500ms ease-out, fill-opacity 500ms ease-out',
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            '& ellipse': { transition: 'none' },
          },
        }}
      >
        <ellipse
          cx="150"
          cy="85"
          rx="125"
          ry="62"
          fill="var(--tint)"
          fillOpacity={wash}
          filter="url(#oniria-wash-wide)"
        />
        <ellipse
          cx="120"
          cy="95"
          rx="70"
          ry="46"
          fill="var(--tint)"
          fillOpacity={wash}
          filter="url(#oniria-wash-wide)"
        />
      </Box>

      <Box sx={{ position: 'relative', pb: { md: 2.25 } }}>
        <Box
          sx={{
            width: { xs: 64, md: 96 },
            height: { xs: 72, md: 108 },
            border: '1.5px solid',
            borderColor: 'text.primary',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            // Transcendance : un second cadre, dans la teinte, qui se détache.
            outline: '1.5px solid',
            outlineColor: transcendent ? 'var(--tint)' : 'transparent',
            outlineOffset: transcendent ? 4 : 0,
            transition: `outline-color 500ms ease-out, outline-offset 600ms ${EASE}`,
          }}
        >
          <Portrait
            avatar={sheet.avatar}
            name={sheet.name}
            size={{ xs: 52, md: 80 }}
            framed
          />
        </Box>
        <Typography
          variant="overline"
          color="textSecondary"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: 0,
            bottom: 0,
            lineHeight: 1,
          }}
        >
          Portrait
        </Typography>
        {canEdit && (
          <Tooltip title="Changer l'image">
            <IconButton
              size="small"
              aria-label="Changer l'image"
              onClick={() => setImageOpen(true)}
              sx={{
                position: 'absolute',
                right: -12,
                top: { xs: 50, md: 86 },
                bgcolor: 'raised',
                border: 1,
                borderColor: 'text.primary',
                '&:hover': { bgcolor: 'raised' },
                // Au doigt : la pastille garde sa taille sur le portrait, la
                // zone de toucher seule fait 44 px.
                '@media (pointer: coarse)': {
                  minWidth: 0,
                  minHeight: 0,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -8,
                  },
                },
              }}
            >
              <PhotoIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ minWidth: 0, position: 'relative' }}>
        <Typography variant="overline" component="p" color="textSecondary">
          Nom
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              color: 'primary.main',
              overflowWrap: 'anywhere',
              borderBottom: 1,
              borderColor: 'text.primary',
              pr: { xs: 1, md: 4 },
              minWidth: { md: 280 },
            }}
          >
            {canEdit ? (
              <EditableField
                value={sheet.name}
                aria-label="le nom"
                variant="inherit"
                onChange={(name) => update({ name: name.trim() || 'Sans nom' })}
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
                sx={{ color: 'var(--tint)', mb: 0.5 }}
              >
                <PaletteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 3,
            rowGap: 0.5,
            mt: 1,
          }}
        >
          <Box>
            <Typography variant="overline" component="p" color="textSecondary">
              Joueur·euse
            </Typography>
            <Typography variant="body2">{sheet.user.name}</Typography>
          </Box>
          {sheet.teams.length > 0 && (
            <Box>
              <Typography
                variant="overline"
                component="p"
                color="textSecondary"
              >
                Table
              </Typography>
              <Typography variant="body2">
                {sheet.teams.map((t) => t.name).join(', ')}
              </Typography>
            </Box>
          )}
          {!canEdit && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ alignSelf: 'flex-end' }}
            >
              lecture seule
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          gridColumn: '1 / -1',
          '@media (min-width: 760px)': { gridColumn: 'auto' },
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
            aria-label="l'âge"
            editable={canEdit}
            onChange={(v) => update({ age: v ? Number(v) : null })}
          />
          {sheet.age ? (
            <Typography component="span" variant="hand" sx={{ ml: 0.75 }}>
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
            aria-label="le Devenir"
            editable={canEdit}
            onChange={(v) => update({ become: v })}
          />
        </Fact>
      </Box>

      {/* Un croquis de voyage, dans le blanc sous les champs (grands écrans). */}
      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          position: 'absolute',
          right: 20,
          bottom: 10,
          width: '34%',
          gap: 1,
          pointerEvents: 'none',
        }}
      >
        <SketchMoon size={30} />
        <DottedPath sx={{ flex: 1, height: 28 }} />
      </Box>

      <Popover
        open={Boolean(tintAnchor)}
        anchorEl={tintAnchor}
        onClose={() => setTintAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 1.5 } } }}
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
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    bgcolor: t.day,
                    border: '2px solid',
                    borderColor: selected ? 'text.primary' : 'transparent',
                    outlineOffset: 2,
                  }}
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
            type="url"
            label="Adresse (URL) de l'image"
            placeholder="https://…"
            defaultValue={sheet.avatar ?? ''}
            slotProps={{ htmlInput: { maxLength: URL_MAX } }}
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
