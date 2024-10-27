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
      aria-labelledby={`tabpanel${index}`}
      hidden={!active}
      sx={{
        display: active ? 'flex' : 'none',
        flexDirection: 'row',
        gap: 1,
        border: 'none',
      }}
      variant="outlined"
    >
      {children}
    </Paper>
  );
};

export default TabContent;
