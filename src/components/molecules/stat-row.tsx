'use client';

import { Box, Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  label: string;
  /** Règle ou formule, en infobulle sur le libellé (focalisable au clavier). */
  tooltip?: ReactNode;
  children: ReactNode;
  /** Ce qui suit la valeur, en plus discret (marge, unité). */
  after?: ReactNode;
}

/**
 * Une ligne d'éphéméride : le libellé à gauche, la valeur alignée à droite
 * en chiffres tabulaires, un filet d'un pixel dessous.
 */
const StatRow = ({ label, tooltip, children, after }: Props) => {
  const labelNode = (
    <Typography
      variant="body2"
      component="span"
      color="textSecondary"
      tabIndex={tooltip ? 0 : undefined}
      sx={{
        minWidth: 0,
        fontSize: '0.75rem',
        ...(tooltip && {
          cursor: 'help',
          '&:hover, &:focus-visible': { color: 'text.primary' },
        }),
      }}
    >
      {label}
    </Typography>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 1,
        py: 0.5,
        borderBottom: 1,
        borderColor: 'rule',
        '&:last-of-type': { borderBottom: 0 },
      }}
    >
      {tooltip ? (
        <Tooltip title={tooltip} describeChild placement="top-start">
          {labelNode}
        </Tooltip>
      ) : (
        labelNode
      )}
      <Box
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.5,
          textAlign: 'right',
        }}
      >
        {children}
        {after && (
          <Typography variant="caption" color="textSecondary">
            {after}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StatRow;
