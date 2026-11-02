'use client';

import { useSession } from 'next-auth/react';
import GoogleSigninButton from '../molecules/google-signin-button';
import GoogleSignoutButton from '../molecules/google-signout-button';
import TestLoginButtons from '../molecules/test-login-buttons';

const LoginForm = ({ testLogin = false }: { testLogin?: boolean }) => {
  const { data: session } = useSession();

  if (session) return <GoogleSignoutButton />;
  return (
    <>
      <GoogleSigninButton />
      {testLogin && <TestLoginButtons />}
    </>
  );
};

export default LoginForm;
