'use client';

import { SheetWithUser } from '@/lib/db/sheet';
import { tintOf } from '@/lib/tints';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import Link from 'next/link';
import Portrait from '../atoms/portrait';

interface Props {
  sheet: SheetWithUser;
  userVisible: boolean;
}

/**
 * Une fiche dans la liste : une fiche cartonnée, le portrait dans son cadre
 * imprimé, le nom écrit à la main, puis le joueur ou l'Aspect, tapés.
 */
const SheetCard = ({ sheet, userVisible }: Props) => {
  const tint = tintOf(sheet.tint);

  return (
    <Card sx={{ '--tint': tint.day, width: 250 }}>
      {/* Un vrai lien : Next précharge la page de la fiche. */}
      <CardActionArea
        component={Link}
        href={`/sheet/${sheet.id}`}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}
      >
        <Box
          sx={{
            width: 56,
            height: 64,
            flexShrink: 0,
            border: '1.5px solid',
            borderColor: 'text.primary',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Portrait avatar={sheet.avatar} name={sheet.name} size={44} framed />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="hand"
            component="h3"
            sx={{ fontSize: '1.625rem', overflowWrap: 'anywhere' }}
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
