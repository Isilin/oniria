'use client';

import Box from '@mui/material/Box';
import ThemeSwitch from '../molecules/theme-switch';

const Header = () => {
  return (
    <Box sx={{ width: '100%', alignItems: 'end' }}>
      <ThemeSwitch />
    </Box>
  );
};

export default Header;
