'use client';

import { SheetListItem } from '@/lib/db/sheet';
import { tintOf } from '@/lib/tints';
import { RULES } from '@/theme/theme';
import { Box, Card, CardActionArea, Chip, Typography } from '@mui/material';
import Link from 'next/link';
import Portrait from '../atoms/portrait';

interface Props {
  sheet: SheetListItem;
  userVisible: boolean;
}

/** Les mêmes puces que dans la vue d'ensemble d'une table. */
const STATUS_LABEL = { creation: 'en création', ready: 'à valider' } as const;

/**
 * Une fiche dans la liste : une fiche cartonnée, le portrait dans son cadre
 * imprimé, le nom écrit à la main, puis le joueur ou l'Aspect, tapés. Une
 * fiche qui attend (l'XP de création, la validation) le dit d'une puce : le
 * MJ voit d'un coup d'œil laquelle a besoin de lui.
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
            border: RULES.frame,
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
          {sheet.xpStatus && (
            <Chip
              size="small"
              color="warning"
              label={STATUS_LABEL[sheet.xpStatus]}
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default SheetCard;
