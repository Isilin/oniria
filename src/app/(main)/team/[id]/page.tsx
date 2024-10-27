import { auth } from '@/app/auth';
import DeleteTeamButton from '@/components/molecules/delete-team-button';
import TeamCard from '@/components/organisms/team-card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({ params }: { params: { id: string } }) => {
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
        <Link href="/team">
          <Button>
            <ArrowBackIcon />
          </Button>
        </Link>
        <DeleteTeamButton id={params.id} />
      </Box>
      <TeamCard id={params.id} />
    </Suspense>
  );
};

export default Page;
