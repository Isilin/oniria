'use client';

import { SheetWithUser } from '@/lib/db/sheet';
import { Card, CardActionArea, CardHeader, CardMedia } from '@mui/material';
import Link from 'next/link';

interface Props {
  sheet: SheetWithUser;
  userVisible: boolean;
}

const SheetCard = ({ sheet, userVisible }: Props) => {
  return (
    <Card sx={{ width: 250 }}>
      {/* Un vrai lien : Next précharge la page de la fiche. */}
      <CardActionArea component={Link} href={`/sheet/${sheet.id}`}>
        <CardHeader
          title={sheet.name}
          subheader={userVisible && sheet.user.name}
        />
        <CardMedia
          component="img"
          image={sheet.avatar || '/default.png'}
          alt={sheet.name ?? 'Avatar'}
          loading="lazy"
          decoding="async"
          width="100%"
          height={150}
          sx={{ objectPosition: 'top' }}
        />
      </CardActionArea>
    </Card>
  );
};

export default SheetCard;
