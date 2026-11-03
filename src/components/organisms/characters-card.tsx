'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTICS, characteristicCost, GROUPS } from '@/lib/rules';
import { CHARACTERISTIC_MAX } from '@/lib/rules/xp';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import ScopeLock from '../atoms/scope-lock';
import SheetField from '../molecules/sheet-field';

/** Prix du prochain point : 1 jusqu'à 25, 2 jusqu'à 50, 4 jusqu'à 75, puis 8. */
const nextPointCost = (value: number) =>
  value >= CHARACTERISTIC_MAX
    ? null
    : characteristicCost(value + 1) - characteristicCost(value);

const CharactersCard = ({ id }: { id: string }) => {
  const { sheet, computed, canEdit, update, isLocked } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Caractères
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          {GROUPS.map((group, index) => (
            <Fragment key={group.key}>
              {index > 0 && (
                <Divider orientation="vertical" variant="middle" flexItem />
              )}
              <Grid>
                <Typography variant="h5">
                  {group.label} <em>({computed.groups[group.key]})</em>
                  <ScopeLock locked={isLocked(group.key)} />
                </Typography>
                {CHARACTERISTICS.filter((c) => c.group === group.key).map(
                  (c) => (
                    <SheetField
                      key={c.key}
                      label={c.label}
                      value={sheet[c.key]}
                      tooltip={`${c.description} (valeur : ${characteristicCost(computed.values[c.key])} XP${
                        nextPointCost(computed.values[c.key]) !== null
                          ? ` ; point suivant : ${nextPointCost(computed.values[c.key])} XP`
                          : ''
                      })`}
                      editable={canEdit}
                      onEdit={(newVal) => update({ [c.key]: Number(newVal) })}
                    />
                  ),
                )}
                <Typography variant="caption" color="textSecondary">
                  Exp. : {computed.groupCosts[group.key]}
                </Typography>
              </Grid>
            </Fragment>
          ))}
        </Grid>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Expérience investie dans les caractères :{' '}
          {computed.characteristicsCost} (1 XP par point jusqu’à 25, 2 jusqu’à
          50, 4 jusqu’à 75, 8 au-delà)
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CharactersCard;
