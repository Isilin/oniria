'use client';

import { SheetWithUser } from '@/lib/db/sheet';
import { devenirIntensity, tintOf } from '@/lib/tints';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import Link from 'next/link';
import Portrait from '../atoms/portrait';

interface Props {
  sheet: SheetWithUser;
  userVisible: boolean;
}

/**
 * Une fiche dans la liste : le portrait cerclé de sa teinte de lune, le nom,
 * et l'Aspect, comme la plaque de la fiche en plus petit.
 */
const SheetCard = ({ sheet, userVisible }: Props) => {
  const tint = tintOf(sheet.tint);
  const { level } = devenirIntensity(sheet.become);
  const ring = Math.round(35 + 65 * level);

  return (
    <Card
      sx={(theme) => ({
        '--tint': tint.night,
        ...theme.applyStyles('light', { '--tint': tint.day }),
        width: 250,
        borderTop: '2px solid',
        borderTopColor: `color-mix(in srgb, var(--tint) ${ring}%, transparent)`,
      })}
    >
      {/* Un vrai lien : Next précharge la page de la fiche. */}
      <CardActionArea
        component={Link}
        href={`/sheet/${sheet.id}`}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}
      >
        <Portrait
          avatar={sheet.avatar}
          name={sheet.name}
          size={56}
          sx={{
            border: '2px solid',
            borderColor: `color-mix(in srgb, var(--tint) ${ring}%, transparent)`,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h5"
            component="h3"
            sx={{ overflowWrap: 'anywhere' }}
          >
            {sheet.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {userVisible ? sheet.user.name : sheet.aspect}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default SheetCard;
