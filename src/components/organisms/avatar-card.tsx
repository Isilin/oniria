import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const AvatarCard = ({ id }) => {
  const { sheet } = useSheet(id);

  return (
    <Card>
      <CardMedia
        component="img"
        image={sheet.avatar || '/default.png'}
        sx={{ width: '100%', height: 'auto' }}
      />
    </Card>
  );
};

export default AvatarCard;
