import BackButton from '@/components/atoms/back-button';
import HeaderSlot from '@/components/atoms/header-slot';
import SWRFallback from '@/components/atoms/swr-fallback';
import WhitelistAddButton from '@/components/molecules/whitelist-add-button';
import WhitelistList from '@/components/organisms/whitelist-list';
import { asJson, listWhitelist } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async () => {
  const session = await getSession();
  if (!session?.user || session?.user.role !== 'ADMIN') redirect('/');
  // La whitelist arrive avec la page.
  const data = asJson(await listWhitelist());

  return (
    <Suspense>
      <SWRFallback fallback={{ '/api/whitelist': data }}>
        <HeaderSlot side="start">
          <BackButton href="/" />
        </HeaderSlot>
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
      </SWRFallback>
    </Suspense>
  );
};

export default Page;
