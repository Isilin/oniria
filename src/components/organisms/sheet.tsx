'use client';

import useAnchor from '@/lib/hooks/use-anchor';
import { useSheet } from '@/lib/hooks/use-sheet';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import TabContent from '../atoms/tab-content';
import NotesCard from '../molecules/notes-card';
import AbilitiesCard from './abilities-card';
import AvatarCard from './avatar-card';
import CharactersCard from './characters-card';
import ExistencesCard from './existences-card';
import ExperienceCard from './experience-card';
import FaceCard from './face-card';
import InventoryTab from './inventory-tab';
import MagicCard from './magic-card';
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
    <>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2.25rem', md: '3.75rem' },
            wordBreak: 'break-word',
          }}
        >
          {sheet.name}
        </Typography>
        <Typography variant="subtitle1">
          Joueur·euse : {sheet.user.name}
          {sheet.teams.length > 0 &&
            ` · Table : ${sheet.teams.map((t) => t.name).join(', ')}`}
          {!canEdit && ' · lecture seule'}
        </Typography>
      </Box>
      <Tabs
        value={value}
        onChange={(e, newVal) => {
          // L'onglet est dans l'URL (#2…) : partageable et compatible retour.
          window.location.hash = String(newVal);
        }}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ maxWidth: '100%' }}
      >
        {TABS.map((label, index) => (
          <Tab
            key={label}
            id={`tab${index}`}
            aria-controls={`tabpanel${index}`}
            value={index}
            label={label}
          />
        ))}
      </Tabs>
      <TabContent index={0} active={value === 0}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            width: { xs: '100%', md: 300 },
            flexShrink: 0,
          }}
        >
          <AvatarCard id={id} />
          <FaceCard id={id} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            flexGrow: 1,
          }}
        >
          <CharactersCard id={id} />
          <AbilitiesCard id={id} />
          <ExistencesCard id={id} />
          <ExperienceCard id={id} />
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
      <TabContent index={4} active={value === 4}>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <NotesCard id={id} />
        </Box>
      </TabContent>
    </>
  );
};

export default Sheet;
