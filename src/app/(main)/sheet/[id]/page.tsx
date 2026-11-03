import BackButton from '@/components/atoms/back-button';
import SWRFallback from '@/components/atoms/swr-fallback';
import DeleteSheetButton from '@/components/molecules/delete-sheet-button';
import Sheet from '@/components/organisms/sheet';
import { asJson, findSheet } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import { Box } from '@mui/material';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const session = await getSession();
  if (!session?.user) redirect('/');

  // La fiche arrive avec la page : pas d'attente d'un appel à l'API.
  const sheet = await findSheet(params.id);
  const fallback = sheet ? { [`/api/sheets/${params.id}`]: asJson(sheet) } : {};

  return (
    <Suspense>
      <SWRFallback fallback={fallback}>
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
      </SWRFallback>
    </Suspense>
  );
};

export default Page;
