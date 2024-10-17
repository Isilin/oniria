import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';
import { Suspense } from 'react';

const Page = () => {
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
    </Suspense>
  );
};

export default Page;
