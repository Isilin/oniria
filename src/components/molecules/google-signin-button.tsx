'use client';

import GoogleIcon from '@mui/icons-material/Google';
import { Button, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';

const GoogleSigninButton = () => {
  const handleClick = () => {
    signIn('google');
  };

  return (
    <Button onClick={handleClick} startIcon={<GoogleIcon />} variant="outlined">
      <Typography variant="button">Continue with Google</Typography>
    </Button>
  );
};

export default GoogleSigninButton;
