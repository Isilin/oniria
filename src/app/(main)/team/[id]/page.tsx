import BackButton from '@/components/atoms/back-button';
import SWRFallback from '@/components/atoms/swr-fallback';
import DeleteTeamButton from '@/components/molecules/delete-team-button';
import TeamCard from '@/components/organisms/team-card';
import { asJson, findTeam, listSheets } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import Box from '@mui/material/Box';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const session = await getSession();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');

  // La table et les fiches à ajouter arrivent avec la page.
  const [team, sheets] = await Promise.all([
    findTeam(params.id),
    listSheets(session.user.id),
  ]);
  const fallback = {
    '/api/sheets': asJson(sheets),
    ...(team && { [`/api/teams/${params.id}`]: asJson(team) }),
  };

  return (
    <Suspense>
      <SWRFallback fallback={fallback}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <BackButton href="/team" />
          <DeleteTeamButton id={params.id} />
        </Box>
        <TeamCard id={params.id} />
      </SWRFallback>
    </Suspense>
  );
};

export default Page;
