'use client';

import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { CARD_WIDTH } from '../atoms/card-row';

interface Props {
  /** Ce que la carte crée (« Nouvelle fiche », « Nouvelle table de jeu »). */
  label: string;
  onClick: () => void;
}

/**
 * La carte en pointillés qui termine une rangée de cartes et en crée une
 * nouvelle, à l'encre bleue.
 */
const AddCard = ({ label, onClick }: Props) => (
  <Card
    sx={{ width: CARD_WIDTH, borderStyle: 'dashed', bgcolor: 'transparent' }}
  >
    <CardActionArea
      onClick={onClick}
      sx={{
        height: '100%',
        minHeight: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: 'primary.main',
      }}
    >
      <AddIcon />
      <Typography variant="button">{label}</Typography>
    </CardActionArea>
  </Card>
);

export default AddCard;
