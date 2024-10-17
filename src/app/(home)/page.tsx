import AdminPanel from '@/components/organisms/admin-panel';
import ListSheets from '@/components/organisms/list-sheets';
import LoginForm from '@/components/organisms/login-form';
import { Typography } from '@mui/material';
import { Suspense } from 'react';
import { auth } from '../auth';

const Home = async () => {
  const session = await auth();

  return (
    <Suspense>
      <Typography variant="h1" textAlign="center">
        ONIRIA
      </Typography>
      {!!session?.user && session?.user.role == 'ADMIN' && <AdminPanel />}
      <LoginForm />
      {!!session?.user && <ListSheets />}
    </Suspense>
  );
};

export default Home;
