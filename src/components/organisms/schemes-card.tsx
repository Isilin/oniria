import { toRoman } from '@/lib/helpers/roman';
import { useSchemas } from '@/lib/hooks/use-sheet';
import { CircularProgress } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useParams } from 'next/navigation';
import CustomCard from '../atoms/custom-card';

const SchemesCard = () => {
  const { id } = useParams<{ id: string }>();
  const { schemas, isLoading } = useSchemas(id);

  if (isLoading) return <CircularProgress />;

  return (
    <CustomCard name="Schémas">
      <Grid display="flex" justifyContent="space-evenly" gap={4}>
        <Grid>
          <Typography variant="h5">Le Corpus</Typography>
          {schemas.corpus.map((corpus, index) => (
            <Grid key={index}>
              <Typography variant="body1">
                {corpus.name} ({corpus.stat.substring(0, 3)}{' '}
                {corpus.bonus > 0 ? '+' : ''}
                {corpus.bonus})
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Grid>
          <Typography variant="h5">La Spyrée</Typography>
          {schemas.spyree.map((spyree, index) => (
            <Grid key={index}>
              <Typography variant="body1">
                {spyree.potential.type.name} - {spyree.potential.name} [Rang{' '}
                {toRoman(spyree.level)}]
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Grid>
          <Typography variant="h5">L&apos;Âmée</Typography>
          {schemas.amee.map((amee, index) => (
            <Grid key={index}>
              <Typography variant="body1">{amee.name}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default SchemesCard;
