'use client';

import { SheetWithUser } from '@/lib/db/sheet';
import { Card, CardActionArea, CardHeader, CardMedia } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Props {
  sheet: SheetWithUser;
  userVisible: boolean;
}

const SheetCard = ({ sheet, userVisible }: Props) => {
  const router = useRouter();

  return (
    <>
      <Card sx={{ width: 250 }}>
        <CardActionArea onClick={() => router.push(`/sheet/${sheet.id}`)}>
          <CardHeader
            title={sheet.name}
            subheader={userVisible && sheet.user.name}
          />
          <CardMedia
            component="img"
            image={sheet.avatar || '/default.png'}
            width="100%"
            height={150}
            sx={{ objectPosition: 'top' }}
          />
        </CardActionArea>
      </Card>
    </>
  );
};

export default SheetCard;
