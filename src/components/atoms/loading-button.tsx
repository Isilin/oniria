'use client';

import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';

const LoadingButton = ({ ...props }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    props.onClick?.();
    setLoading(false);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={loading}
      variant={loading ? 'outlined' : props?.variant}
      startIcon={!loading && props?.startIcon}
      sx={{ minWidth: 'fit-content' }}
    >
      {loading ? (
        <CircularProgress
          size={24.5}
          sx={{ color: 'action.disabled' }}
        />
      ) : (
        props.children
      )}
    </Button>
  );
};

export default LoadingButton;
