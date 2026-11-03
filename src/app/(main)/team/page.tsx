import BackButton from '@/components/atoms/back-button';
import HeaderSlot from '@/components/atoms/header-slot';
import SWRFallback from '@/components/atoms/swr-fallback';
import TeamAddButton from '@/components/molecules/team-add-button';
import TeamsList from '@/components/organisms/teams-list';
import { asJson, listTeams } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async () => {
  const session = await getSession();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');
  // Les tables arrivent avec la page.
  const data = asJson(await listTeams());

  return (
    <Suspense>
      <SWRFallback fallback={{ '/api/teams': data }}>
        <HeaderSlot side="start">
          <BackButton href="/" />
        </HeaderSlot>
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
          }}
        >
          ONIRIA
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
          }}
        >
          Tables de jeu
        </Typography>
        <TeamsList />
        <TeamAddButton />
      </SWRFallback>
    </Suspense>
  );
};

export default Page;
