import Paper from '@mui/material/Paper';
import { PropsWithChildren } from 'react';

interface Props {
  index: number;
  active: boolean;
}

const TabContent = ({ index, active, children }: PropsWithChildren<Props>) => {
  return (
    <Paper
      role="tabpanel"
      id={`tabpanel${index}`}
      aria-labelledby={`tab${index}`}
      hidden={!active}
      sx={{
        display: active ? 'flex' : 'none',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 1,
        border: 'none',
        justifyContent: 'center',
        width: '100%',
      }}
      variant="outlined"
    >
      {children}
    </Paper>
  );
};

export default TabContent;
