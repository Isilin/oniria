'use client';

import { useSession } from 'next-auth/react';
import GoogleSigninButton from '../molecules/google-signin-button';
import GoogleSignoutButton from '../molecules/google-signout-button';

const LoginForm = () => {
  const { data: session } = useSession();

  return <>{session ? <GoogleSignoutButton /> : <GoogleSigninButton />}</>;
};

export default LoginForm;
