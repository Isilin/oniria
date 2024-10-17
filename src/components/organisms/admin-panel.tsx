import { Link, List, ListItem } from '@mui/material';

const AdminPanel = () => {
  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ListItem sx={{ width: 'auto' }}>
        <Link href="/whitelist">Whitelist</Link>
      </ListItem>
      <ListItem sx={{ width: 'auto' }}>
        <Link href="/team">Tables de jeu</Link>
      </ListItem>
    </List>
  );
};

export default AdminPanel;
