'use client';

import GoogleIcon from '@mui/icons-material/Google';
import { Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import LoadingButton from '../atoms/loading-button';

const GoogleSigninButton = () => {
  const handleClick = async () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <LoadingButton
      variant="outlined"
      onClick={() => {
        handleClick();
      }}
      startIcon={<GoogleIcon />}
      sx={{ width: 'fit-content' }}
    >
      <Typography variant="button">Continuer avec Google</Typography>
    </LoadingButton>
  );
};

export default GoogleSigninButton;
