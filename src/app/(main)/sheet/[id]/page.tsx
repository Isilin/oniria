import { auth } from '@/app/auth';
import DeleteSheetButton from '@/components/molecules/delete-sheet-button';
import Sheet from '@/components/organisms/sheet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  if (!session?.user) redirect('/');

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
        <Link href="/">
          <Button>
            <ArrowBackIcon />
          </Button>
        </Link>
        <DeleteSheetButton id={params.id} />
      </Box>
      <Sheet id={params.id} />
    </Suspense>
  );
};

export default Page;
