import SWRFallback from '@/components/atoms/swr-fallback';
import AdminPanel from '@/components/organisms/admin-panel';
import ListSheets from '@/components/organisms/list-sheets';
import LoginForm from '@/components/organisms/login-form';
import { asJson, listSheets } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import { isTestLoginEnabled } from '@/lib/server/test-login';
import { Typography } from '@mui/material';
import { Suspense } from 'react';

const Home = async () => {
  const session = await getSession();
  // La liste des fiches arrive avec la page.
  const sheets = session?.user
    ? asJson(await listSheets(session.user.id))
    : null;

  return (
    <Suspense>
      <Typography
        variant="h1"
        sx={{
          textAlign: 'center',
        }}
      >
        ONIRIA
      </Typography>
      {!!session?.user && session?.user.role == 'ADMIN' && <AdminPanel />}
      <LoginForm testLogin={isTestLoginEnabled()} />
      {!!session?.user && (
        <SWRFallback fallback={{ '/api/sheets': sheets }}>
          <ListSheets />
        </SWRFallback>
      )}
    </Suspense>
  );
};

export default Home;
