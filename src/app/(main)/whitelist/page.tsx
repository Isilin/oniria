import { auth } from '@/app/auth';
import BackButton from '@/components/atoms/back-button';
import WhitelistAddButton from '@/components/molecules/whitelist-add-button';
import WhitelistList from '@/components/organisms/whitelist-list';
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
        Whitelist
      </Typography>
      <WhitelistList />
      <WhitelistAddButton />
    </Suspense>
  );
};

export default Page;
