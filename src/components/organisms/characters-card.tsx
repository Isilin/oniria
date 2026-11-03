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
import PreviewValue from '../atoms/preview-value';
import ScopeLock from '../atoms/scope-lock';
import PointStepper from '../molecules/point-stepper';
import SheetField from '../molecules/sheet-field';

/** Prix du prochain point : 1 jusqu'à 25, 2 jusqu'à 50, 4 jusqu'à 75, puis 8. */
const nextPointCost = (value: number) =>
  value >= CHARACTERISTIC_MAX
    ? null
    : characteristicCost(value + 1) - characteristicCost(value);

const CharactersCard = ({ id }: { id: string }) => {
  const { computed, base, canEdit, isLocked, points } = useSheet(id);

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
                  {group.label}{' '}
                  <em>
                    (
                    <PreviewValue
                      before={base.groups[group.key]}
                      delta={
                        computed.groups[group.key] - base.groups[group.key]
                      }
                    >
                      {computed.groups[group.key]}
                    </PreviewValue>
                    )
                  </em>
                  <ScopeLock locked={isLocked(group.key)} />
                </Typography>
                {CHARACTERISTICS.filter((c) => c.group === group.key).map(
                  (c) => {
                    const value = computed.values[c.key];
                    const pending = value - base.values[c.key];
                    const { min, max } = points.bounds(c.key);
                    const next = nextPointCost(value);
                    return (
                      <SheetField
                        key={c.key}
                        label={c.label}
                        value={value}
                        preview={{ before: base.values[c.key], delta: pending }}
                        tooltip={`${c.description} (valeur : ${characteristicCost(value)} XP${
                          next !== null ? ` ; point suivant : ${next} XP` : ''
                        })`}
                        postValue={
                          canEdit ? (
                            <PointStepper
                              label={c.label}
                              points={pending}
                              canAdd={value < max}
                              canRemove={value > min}
                              onStep={(step) => points.step(c.key, step)}
                            />
                          ) : undefined
                        }
                      />
                    );
                  },
                )}
                <Typography variant="caption" color="textSecondary">
                  Exp. :{' '}
                  <PreviewValue
                    before={base.groupCosts[group.key]}
                    delta={
                      computed.groupCosts[group.key] -
                      base.groupCosts[group.key]
                    }
                  >
                    {computed.groupCosts[group.key]}
                  </PreviewValue>
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
          <PreviewValue
            before={base.characteristicsCost}
            delta={computed.characteristicsCost - base.characteristicsCost}
          >
            {computed.characteristicsCost}
          </PreviewValue>{' '}
          (1 XP par point jusqu’à 25, 2 jusqu’à 50, 4 jusqu’à 75, 8 au-delà)
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CharactersCard;
