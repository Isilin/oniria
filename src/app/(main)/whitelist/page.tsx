import { auth } from '@/app/auth';
import WhitelistAddButton from '@/components/molecules/whitelist-add-button';
import WhitelistElement from '@/components/molecules/whitelist-element';
import { db } from '@/lib/helpers/db';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async () => {
  const session = await auth();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');

  const whitelist = await db.whitelist.findMany();

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {whitelist.map((element) => (
          <WhitelistElement key={element.id} element={element} />
        ))}
        <Box sx={{ display: 'inline', verticalAlign: 'middle' }}>
          <WhitelistAddButton />
        </Box>
      </Box>
    </Suspense>
  );
};

export default Page;
