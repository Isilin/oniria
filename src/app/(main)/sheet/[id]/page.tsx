import { auth } from '@/app/auth';
import BackButton from '@/components/atoms/back-button';
import DeleteSheetButton from '@/components/molecules/delete-sheet-button';
import Sheet from '@/components/organisms/sheet';
import { Box } from '@mui/material';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
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
        <BackButton href="/" />
        <DeleteSheetButton id={params.id} />
      </Box>
      <Sheet id={params.id} />
    </Suspense>
  );
};

export default Page;
