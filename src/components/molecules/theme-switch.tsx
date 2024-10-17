'use client';

import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

const ThemeSwitch = () => {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'end',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        minHeight: '56px',
      }}
    >
      <Typography variant="body1" paddingRight={2}>
        Thème :
      </Typography>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-theme-toggle"
          name="theme-toggle"
          row
          value={mode}
          onChange={(event) =>
            setMode(event.target.value as 'system' | 'light' | 'dark')
          }
        >
          <FormControlLabel
            value="system"
            control={<Radio />}
            label="Système"
          />
          <FormControlLabel value="light" control={<Radio />} label="Clair" />
          <FormControlLabel value="dark" control={<Radio />} label="Sombre" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default ThemeSwitch;
