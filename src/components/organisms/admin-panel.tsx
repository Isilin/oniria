'use client';

import { Link, List, ListItem } from '@mui/material';
import NextLink from 'next/link';

const AdminPanel = () => {
  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ListItem sx={{ width: 'auto' }}>
        <Link component={NextLink} href="/whitelist">
          Whitelist
        </Link>
      </ListItem>
      <ListItem sx={{ width: 'auto' }}>
        <Link component={NextLink} href="/team">
          Tables de jeu
        </Link>
      </ListItem>
    </List>
  );
};

export default AdminPanel;
