import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Typography variant="caption" color="textSecondary">
        2024 Oniria - par Noème
      </Typography>
    </Box>
  );
};

export default Footer;
