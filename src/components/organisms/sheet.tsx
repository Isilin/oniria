'use client';

import useAnchor from '@/lib/hooks/use-anchor';
import { PointsDraftProvider } from '@/lib/hooks/use-points-draft';
import { useSheet } from '@/lib/hooks/use-sheet';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabContent from '../atoms/tab-content';
import NotesCard, { preloadEditor } from '../molecules/notes-card';
import AbilitiesCard from './abilities-card';
import CharacterPlate from './character-plate';
import CharactersCard from './characters-card';
import CombatCard from './combat-card';
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

const Sheet = ({ id }: { id: string }) => {
  const anchor = useAnchor();
  const value = anchor >= 0 && anchor < TABS.length ? anchor : 0;
  const { sheet, isLoading, error, canEdit } = useSheet(id);

  if (isLoading) return <CircularProgress />;
  if (error || !sheet)
    return (
      <Alert severity="error">{error?.message ?? 'Fiche introuvable.'}</Alert>
    );

  return (
    // Les points en attente sont propres à cette fiche.
    <PointsDraftProvider key={id}>
      <CharacterPlate id={id} />
      <EphemerisBand id={id} />
      <Tabs
        value={value}
        onChange={(e, newVal) => {
          // L'onglet est dans l'URL (#2…) : partageable et compatible retour.
          window.location.hash = String(newVal);
        }}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
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
      <TabContent index={0} active={value === 0}>
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
              md: 'minmax(0, 1fr) 260px',
              lg: 'minmax(0, 1.1fr) minmax(0, 1fr) 236px',
            },
            gridTemplateAreas: {
              xs: '"car" "fac" "com" "xp"',
              md: '"car com" "fac com" "xp xp"',
              lg: '"car fac com" "xp xp xp"',
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
          {/* Colonnes séparées par un filet d'un pixel, comme une table. */}
          <Box
            sx={{
              gridArea: 'fac',
              pr: { lg: 3 },
              pl: { lg: 3 },
              borderLeft: { lg: '1px solid var(--mui-palette-rule)' },
            }}
          >
            <AbilitiesCard id={id} />
          </Box>
          <Box
            sx={{
              gridArea: 'com',
              pl: { md: 3 },
              borderLeft: { md: '1px solid var(--mui-palette-rule)' },
            }}
          >
            <CombatCard id={id} />
          </Box>
          <Box sx={{ gridArea: 'xp' }}>
            <ExperienceCard id={id} />
          </Box>
        </Box>
      </TabContent>
      <TabContent index={1} active={value === 1}>
        <TraitsTab id={id} />
      </TabContent>
      <TabContent index={2} active={value === 2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <SchemesCard id={id} />
          <SkillsCard id={id} />
          <MagicCard id={id} />
        </Box>
      </TabContent>
      <TabContent index={3} active={value === 3}>
        <InventoryTab id={id} />
      </TabContent>
      <TabContent index={NOTES_TAB} active={value === NOTES_TAB}>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <NotesCard id={id} />
        </Box>
      </TabContent>
      {canEdit && <PointsBar id={id} />}
    </PointsDraftProvider>
  );
};

export default Sheet;
