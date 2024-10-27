import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import SheetField from '../molecules/sheet-field';

const ExperienceCard = ({ id }) => {
  const { sheet, mutate } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center">
          Experiences
        </Typography>
        <Grid display="flex" flexDirection="row" justifyContent="space-evenly">
          <Grid>
            <Typography variant="h5">Eprouver</Typography>
            <SheetField label="Dépensé" value={sheet.spent_feel_xp} />
            <SheetField
              label="A dépenser"
              value={sheet.to_spend_feel_xp}
              onEdit={(newVal) => {
                mutate({ to_spend_feel_xp: Number(newVal) });
              }}
            />
          </Grid>
          <Grid>
            <Typography variant="h5">Apprendre</Typography>
            <SheetField label="Dépensé" value={sheet.spent_learn_xp} />
            <SheetField
              label="A dépenser"
              value={sheet.to_spend_learn_xp}
              onEdit={(newVal) => {
                mutate({ to_spend_learn_xp: Number(newVal) });
              }}
            />
          </Grid>
          <Grid>
            <Typography variant="h5">Vivre</Typography>
            <SheetField label="Dépensé" value={sheet.spent_live_xp} />
            <SheetField
              label="A dépenser"
              value={sheet.to_spend_live_xp}
              onEdit={(newVal) => {
                mutate({ to_spend_live_xp: Number(newVal) });
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
