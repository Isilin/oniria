import { auth } from '@/app/auth';
import TeamAddButton from '@/components/molecules/team-add-button';
import TeamsList from '@/components/organisms/teams-list';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async () => {
  const session = await auth();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');

  return (
    <Suspense>
      <Link href="/">
        <Button>
          <ArrowBackIcon />
        </Button>
      </Link>
      <Typography variant="h1" textAlign="center">
        ONIRIA
      </Typography>
      <Typography variant="h3" textAlign="center">
        Tables de jeu
      </Typography>
      <TeamsList />
      <TeamAddButton />
    </Suspense>
  );
};

export default Page;
