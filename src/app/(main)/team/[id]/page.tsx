import { auth } from '@/app/auth';
import BackButton from '@/components/atoms/back-button';
import DeleteTeamButton from '@/components/molecules/delete-team-button';
import TeamCard from '@/components/organisms/team-card';
import Box from '@mui/material/Box';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const session = await auth();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');

  return (
    <Suspense>
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
    </Suspense>
  );
};

export default Page;
