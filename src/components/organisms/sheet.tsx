'use client';

import useAnchor from '@/lib/hooks/use-anchor';
import { PointsDraftProvider } from '@/lib/hooks/use-points-draft';
import { useSheet } from '@/lib/hooks/use-sheet';
import { MEDIA, RULES } from '@/theme/theme';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import LoadError from '../atoms/load-error';
import { Constellation } from '../atoms/ornaments';
import TabContent from '../atoms/tab-content';
import NotesCard, { preloadEditor } from '../molecules/notes-card';
import AbilitiesCard from './abilities-card';
import CharacterPlate from './character-plate';
import CharactersCard from './characters-card';
import CombatCard from './combat-card';
import CreationReminder from './creation-reminder';
import EphemerisBand from './ephemeris-band';
import ExperienceCard from './experience-card';
import InventoryTab from './inventory-tab';
import MagicCard from './magic-card';
import PointsBar from './points-bar';
import SchemesCard from './schemes-card';
import SkillsCard from './skills-card';
import TraitsTab from './traits-tab';

const TABS = [
  'Caractéristiques',
  'Traits',
  'Schémas & Compétences',
  'Inventaire',
  'Notes',
];
const NOTES_TAB = 4;

// Les points en attente sont propres à cette fiche, et gardés au-dessus de
// tout état de chargement : relire la fiche ne doit pas les effacer.
const Sheet = ({ id }: { id: string }) => (
  <PointsDraftProvider key={id}>
    <SheetContent id={id} />
  </PointsDraftProvider>
);

const SheetContent = ({ id }: { id: string }) => {
  const anchor = useAnchor();
  const value = anchor >= 0 && anchor < TABS.length ? anchor : 0;
  const { sheet, isLoading, error, canEdit, retry } = useSheet(id);
  // Le sens de la page qui tourne : vers l'onglet de droite ou de gauche.
  const [shown, setShown] = useState(value);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  if (value !== shown) {
    // Valeur dérivée pendant le rendu (et non dans un effet).
    setShown(value);
    setDirection(value > shown ? 1 : -1);
  }

  // La fiche déjà affichée reste en place pendant qu'on la relit (retour sur
  // l'onglet après Discord, par exemple) : pas de clignotement.
  if (!sheet) {
    if (isLoading) return <CircularProgress />;
    return (
      <LoadError
        what="La fiche n'a pas pu être ouverte."
        error={error ?? new Error('Fiche introuvable.')}
        onRetry={retry}
      />
    );
  }

  return (
    <>
      <CharacterPlate id={id} />
      <EphemerisBand id={id} />
      <CreationReminder id={id} />
      <Tabs
        value={value}
        onChange={(e, newVal) => {
          // L'onglet est dans l'URL (#2…) : partageable et compatible retour.
          window.location.hash = String(newVal);
        }}
        variant="scrollable"
        // Sur téléphone, pas de flèches (80 px de pris) : les onglets se
        // font glisser au doigt, l'onglet coupé au bord montre la suite.
        scrollButtons="auto"
        // Étirés sur toute la largeur : le filet court sous toute la page et
        // la lecture commence à la marge gauche.
        sx={{ alignSelf: 'stretch', width: '100%', maxWidth: '100%' }}
      >
        {TABS.map((label, index) => (
          <Tab
            key={label}
            id={`tab${index}`}
            aria-controls={`tabpanel${index}`}
            value={index}
            label={label}
            {...(index === NOTES_TAB && {
              onMouseEnter: preloadEditor,
              onFocus: preloadEditor,
              onTouchStart: preloadEditor,
            })}
          />
        ))}
      </Tabs>
      <TabContent index={0} active={value === 0} direction={direction}>
        {/* Tout ce qui sert en jeu tient sur un écran : Caractères, Facultés
            et combat côte à côte dès 1200 px, l'expérience dessous. */}
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: 2,
            alignItems: 'start',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'minmax(0, 1fr) 210px',
            },
            gridTemplateAreas: {
              xs: '"car" "fac" "com" "xp"',
              md: '"car com" "fac com" "xp xp"',
            },
            // Après les paliers de MUI, pour passer devant eux.
            [MEDIA.oneScreen]: {
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) 210px',
              gridTemplateAreas: '"car fac com" "xp xp xp"',
            },
            '& > *': { minWidth: 0 },
            columnGap: { md: 0 },
            rowGap: 3,
            pt: 2,
          }}
        >
          <Box sx={{ gridArea: 'car', pr: { md: 3 } }}>
            <CharactersCard id={id} />
          </Box>
          {/* Colonnes séparées par un filet imprimé, comme sur la feuille. */}
          <Box
            sx={{
              gridArea: 'fac',
              pr: { md: 3 },
              [MEDIA.oneScreen]: {
                pl: 3,
                borderLeft: RULES.ink,
              },
            }}
          >
            <AbilitiesCard id={id} />
          </Box>
          <Box
            sx={{
              gridArea: 'com',
              pl: { md: 3 },
              borderLeft: { md: RULES.ink },
            }}
          >
            <CombatCard id={id} />
            {/* Une constellation pâle dans le blanc sous le combat. */}
            <Constellation
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '100%',
                height: 'auto',
                maxWidth: 220,
                mt: 4,
                mx: 'auto',
              }}
            />
          </Box>
          <Box sx={{ gridArea: 'xp' }}>
            <ExperienceCard id={id} />
          </Box>
        </Box>
      </TabContent>
      <TabContent index={1} active={value === 1} direction={direction}>
        <TraitsTab id={id} />
      </TabContent>
      <TabContent index={2} active={value === 2} direction={direction}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: '100%',
            pt: 2,
          }}
        >
          <SchemesCard id={id} />
          <SkillsCard id={id} />
          <MagicCard id={id} />
        </Box>
      </TabContent>
      <TabContent index={3} active={value === 3} direction={direction}>
        <InventoryTab id={id} />
      </TabContent>
      <TabContent
        index={NOTES_TAB}
        active={value === NOTES_TAB}
        direction={direction}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          <NotesCard id={id} />
        </Box>
      </TabContent>
      {canEdit && <PointsBar id={id} />}
    </>
  );
};

export default Sheet;
