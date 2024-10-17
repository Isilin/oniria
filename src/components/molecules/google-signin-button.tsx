'use client';

import { DEFAULT_REDIRECT } from '@/app/routes';
import GoogleIcon from '@mui/icons-material/Google';
import { Button, CircularProgress, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const GoogleSigninButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    signIn('google', { callbackUrl: DEFAULT_REDIRECT });
  };

  return (
    <Button
      variant="outlined"
      onClick={() => {
        setIsLoading(true);
        handleClick();
      }}
      startIcon={!isLoading && <GoogleIcon />}
    >
      {isLoading ? (
        <CircularProgress size={24.5} />
      ) : (
        <Typography variant="button">Continue with Google</Typography>
      )}
    </Button>
  );
};

export default GoogleSigninButton;
