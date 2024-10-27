'use client';

import { Avatar, Button, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';

const GoogleSignoutButton = () => {
  const handleClick = () => {
    signOut();
  };

  const { data: session } = useSession();

  return (
    <Button
      onClick={handleClick}
      startIcon={
        <Avatar
          src={session.user.image}
          sx={{ width: '20px', height: '20px' }}
        />
      }
      variant="outlined"
      sx={{ width: 'fit-content' }}
    >
      <Typography variant="button">Déconnexion</Typography>
    </Button>
  );
};

export default GoogleSignoutButton;
