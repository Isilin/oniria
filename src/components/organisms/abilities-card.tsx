'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import {
  CHARACTERISTIC_BY_KEY,
  FACULTIES,
  FACULTY_COLUMNS,
  formatFaculty,
} from '@/lib/rules';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SheetField from '../molecules/sheet-field';

const AbilitiesCard = ({ id }: { id: string }) => {
  const { computed } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Facultés
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          {FACULTY_COLUMNS.map((column) => (
            <Grid key={column.key}>
              <Typography variant="h5">{column.label}</Typography>
              {FACULTIES.filter((f) => f.column === column.key).map((f) => {
                const major = CHARACTERISTIC_BY_KEY[f.major];
                const minor = CHARACTERISTIC_BY_KEY[f.minor];
                return (
                  <SheetField
                    key={f.key}
                    label={f.label}
                    value={formatFaculty(computed.faculties[f.key])}
                    tooltip={
                      <>
                        <strong>
                          [{major.abbr} / {minor.abbr}]
                        </strong>{' '}
                        {`${major.label} + min(${major.label}, ${minor.label}). Marge : (${major.abbr} − 50) / 5, plus les bonus « ${major.abbr} +N » du Corpus.`}
                        {f.description && (
                          <>
                            <br />
                            <br />
                            {f.description}
                          </>
                        )}
                      </>
                    }
                  />
                );
              })}
            </Grid>
          ))}
        </Grid>
        <Divider flexItem sx={{ my: 2 }} />
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
          }}
        >
          <Grid>
            <SheetField
              label="Dégâts"
              value={computed.damage}
              tooltip="(Force / 10) - 5"
            />
            <SheetField
              label="Initiative"
              value={computed.initiative}
              tooltip="Vivacité / 10"
            />
          </Grid>
          <Grid>
            <SheetField
              label="Impact"
              value={computed.impact}
              tooltip="Raisonnement / 10"
            />
            <SheetField
              label="Impulsion"
              value={computed.impulsion}
              tooltip="Perception / 10"
            />
            <SheetField
              label="Conduction"
              value={computed.conduction}
              tooltip="Concentration / 10"
            />
          </Grid>
          <Grid>
            <SheetField
              label="Protection"
              value={
                computed.protection.max
                  ? `${computed.protection.current}/${computed.protection.max}`
                  : '-'
              }
              tooltip="Armures équipées (onglet Inventaire) : protection actuelle / maximale"
            />
            <SheetField
              label="Encombrement"
              value={`${computed.bulk} %`}
              tooltip="Somme de l'encombrement de l'équipement porté (onglet Inventaire). S'applique en malus au Coup Subtil et à l'Esquive."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AbilitiesCard;
