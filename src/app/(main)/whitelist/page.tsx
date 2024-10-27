import { auth } from '@/app/auth';
import WhitelistAddButton from '@/components/molecules/whitelist-add-button';
import WhitelistList from '@/components/organisms/whitelist-list';
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
        Whitelist
      </Typography>
      <WhitelistList />
      <WhitelistAddButton />
    </Suspense>
  );
};

export default Page;
