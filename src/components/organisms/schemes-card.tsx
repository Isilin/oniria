import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

const SchemesCard = ({ id }) => {
  const { sheet } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gap={4}>
          Schémas
        </Typography>
        <Grid display="flex" justifyContent="space-evenly" gap={4}>
          <Grid>
            <Typography variant="h5">Le Corpus</Typography>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Grid>
            <Typography variant="h5">La Spyrée</Typography>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Grid>
            <Typography variant="h5">L&apos;Âmée</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SchemesCard;
