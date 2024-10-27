'use client';

import useAnchor from '@/lib/hooks/use-anchor';
import { useSheet } from '@/lib/hooks/use-sheet';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TabContent from '../atoms/tab-content';
import AbilitiesCard from './abilities-card';
import AvatarCard from './avatar-card';
import CharactersCard from './characters-card';
import ExistencesCard from './existences-card';
import ExperienceCard from './experience-card';
import FaceCard from './face-card';
import SchemesCard from './schemes-card';

const MarkdownEditor = dynamic(() => import('../organisms/mdx-editor'), {
  ssr: false,
});

const Sheet = ({ id }) => {
  const router = useRouter();
  const anchor = useAnchor();
  const [value, setValue] = useState(anchor);
  const { sheet, isLoading } = useSheet(id);

  const handleClickTab = (id) => {
    router.push(`#${id}`);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h1">{sheet.name}</Typography>
      <Typography variant="subtitle1">
        Joueur-euse : {sheet.user.name}
      </Typography>
      <Tabs
        value={value}
        onChange={(e, newVal) => {
          setValue(newVal);
        }}
        centered
      >
        <Tab
          value={0}
          label="Caractéristiques"
          onClick={() => handleClickTab(0)}
        />
        <Tab value={1} label="Traits" onClick={() => handleClickTab(1)} />
        <Tab
          value={2}
          label="Schémas &Compétences"
          onClick={() => handleClickTab(2)}
        />
        <Tab value={3} label="Inventaire" onClick={() => handleClickTab(3)} />
        <Tab value={4} label="Notes" onClick={() => handleClickTab(4)} />
      </Tabs>
      <TabContent index={0} active={value === 0}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <AvatarCard id={id} />
          <FaceCard id={id} />
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <CharactersCard id={id} />
          <AbilitiesCard id={id} />
          <ExistencesCard id={id} />
          <ExperienceCard id={id} />
        </Box>
      </TabContent>
      <TabContent index={1} active={value === 1}>
        <Typography variant="h1">Traits</Typography>
      </TabContent>
      <TabContent index={2} active={value === 2}>
        <SchemesCard />
      </TabContent>
      <TabContent index={3} active={value === 3}>
        <Typography variant="h1">Inventaire</Typography>
      </TabContent>
      <TabContent index={4} active={value === 4}>
        <Typography variant="h1">Notes</Typography>
        <MarkdownEditor markdown="Hello **world**!" />
      </TabContent>
    </>
  );
};

export default Sheet;
