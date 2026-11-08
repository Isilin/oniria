'use client';

import { ButtonProps } from '@mui/material';
import { useState } from 'react';
import BusyButton from './busy-button';

interface Props extends Omit<ButtonProps, 'onClick'> {
  /** Action attendue : le bouton reste occupé jusqu'à sa fin. */
  onClick?: () => unknown;
}

/** Un bouton qui attend la fin de son action : un double clic ne part pas. */
const LoadingButton = ({ onClick, ...props }: Props) => {
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

  return <BusyButton {...props} busy={loading} onClick={handleClick} />;
};

export default LoadingButton;
