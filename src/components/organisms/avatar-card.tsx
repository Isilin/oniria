'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FormEvent, useState } from 'react';

const AvatarCard = ({ id }: { id: string }) => {
  const { sheet, canEdit, update } = useSheet(id);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = new FormData(e.currentTarget).get('avatar')?.toString() ?? '';
    update({ avatar: url.trim() || null });
    setOpen(false);
  };

  return (
    <Card>
      <CardMedia
        component="img"
        image={sheet.avatar || '/default.png'}
        alt={sheet.name ?? 'Avatar'}
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: 400,
          objectFit: 'cover',
        }}
      />
      {canEdit && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setOpen(true)}
          >
            Changer l&apos;image
          </Button>
        </CardActions>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ component: 'form', onSubmit: handleSubmit }}
        fullWidth
      >
        <DialogTitle>Image du personnage</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="avatar"
            label="Adresse (URL) de l'image"
            placeholder="https://…"
            defaultValue={sheet.avatar ?? ''}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AvatarCard;
