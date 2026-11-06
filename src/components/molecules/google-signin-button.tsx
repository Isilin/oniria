'use client';

import GoogleIcon from '@mui/icons-material/Google';
import { Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import LoadingButton from '../atoms/loading-button';

const GoogleSigninButton = () => (
  <LoadingButton
    variant="outlined"
    // Le bouton attend le départ vers Google : un second clic ne relance pas
    // la connexion.
    onClick={() => signIn('google', { callbackUrl: '/' })}
    startIcon={<GoogleIcon />}
    sx={{ width: 'fit-content' }}
  >
    <Typography variant="button">Continuer avec Google</Typography>
  </LoadingButton>
);

export default GoogleSigninButton;
