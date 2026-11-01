import { auth } from '@/app/auth';
import BackButton from '@/components/atoms/back-button';
import TeamAddButton from '@/components/molecules/team-add-button';
import TeamsList from '@/components/organisms/teams-list';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async () => {
  const session = await auth();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');

  return (
    <Suspense>
      <BackButton href="/" />
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
    </Suspense>
  );
};

export default Page;
