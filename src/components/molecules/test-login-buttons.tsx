'use client';

import { Alert, Box, Button } from '@mui/material';

const ACCOUNTS = [
  { key: 'mj', label: 'MJ de test' },
  { key: 'joueuse', label: 'Joueuse de test' },
  { key: 'joueur', label: 'Joueur de test' },
];

/** Boutons de connexion de test, affichés uniquement sur l'aperçu. */
const TestLoginButtons = () => (
  <Alert severity="warning" sx={{ maxWidth: 560 }}>
    Aperçu de test : connexion sans Google avec un compte fictif.
    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
      {ACCOUNTS.map((a) => (
        <Button
          key={a.key}
          variant="outlined"
          size="small"
          href={`/api/test-login?as=${a.key}`}
        >
          {a.label}
        </Button>
      ))}
    </Box>
  </Alert>
);

export default TestLoginButtons;
