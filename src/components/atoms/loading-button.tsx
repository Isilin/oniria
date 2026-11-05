'use client';

import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { useState } from 'react';

interface Props extends Omit<ButtonProps, 'onClick'> {
  /** Action attendue : le bouton reste bloqué jusqu'à sa fin. */
  onClick?: () => unknown;
}

/** Un bouton qui attend la fin de son action : un double clic ne part pas. */
const LoadingButton = ({ onClick, startIcon, variant, ...props }: Props) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onClick?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      variant={loading ? 'outlined' : variant}
      startIcon={loading ? undefined : startIcon}
      sx={[
        { minWidth: 'fit-content' },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {loading ? (
        <CircularProgress size={24.5} sx={{ color: 'action.disabled' }} />
      ) : (
        props.children
      )}
    </Button>
  );
};

export default LoadingButton;
