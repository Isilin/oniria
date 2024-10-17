'use client';

import AddIcon from '@mui/icons-material/Add';
import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';

const WhitelistAddButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await fetch('/api/whitelist', {
      method: 'POST',
    });
    setLoading(false);
  };

  return (
    <Button fullWidth onClick={handleClick}>
      {loading ? <CircularProgress /> : <AddIcon />}
    </Button>
  );
};

export default WhitelistAddButton;
