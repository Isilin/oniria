'use client';

import GoogleIcon from '@mui/icons-material/Google';
import { Button, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';

const GoogleSignoutButton = () => {
  const handleClick = () => {
    signOut();
  };

  return (
    <Button onClick={handleClick} startIcon={<GoogleIcon />} variant="outlined">
      <Typography variant="button">Déconnexion</Typography>
    </Button>
  );
};

export default GoogleSignoutButton;
