'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SheetField from '../molecules/sheet-field';

const XP_TYPES = [
  { label: 'Éprouver', gained: 'feel_xp', left: 'to_spend_feel_xp' },
  { label: 'Apprendre', gained: 'learn_xp', left: 'to_spend_learn_xp' },
  { label: 'Vivre', gained: 'live_xp', left: 'to_spend_live_xp' },
] as const;

const ExperienceCard = ({ id }: { id: string }) => {
  const { sheet, canEdit, update } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Expériences
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          {XP_TYPES.map((xp) => (
            <Grid key={xp.label}>
              <Typography variant="h5">{xp.label}</Typography>
              <SheetField
                label="Gagnée"
                value={sheet[xp.gained] ?? 0}
                editable={canEdit}
                onEdit={(newVal) => update({ [xp.gained]: Number(newVal) })}
              />
              <SheetField
                label="Restante"
                value={sheet[xp.left] ?? 0}
                editable={canEdit}
                onEdit={(newVal) => update({ [xp.left]: Number(newVal) })}
              />
              <SheetField
                label="Dépensée"
                value={(sheet[xp.gained] ?? 0) - (sheet[xp.left] ?? 0)}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
