'use client';

import { useItems } from '@/lib/hooks/use-items';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import CustomCard from '../atoms/custom-card';
import AddRow from '../molecules/_shared/add-row';
import EmptyRow from '../molecules/_shared/empty-row';
import ItemRow from '../molecules/item-row';

const ItemsCard = () => {
  const { id } = useParams<{ id: string }>();
  const { items, isLoading, createItem } = useItems(id);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    createItem().then(() => {
      enqueueSnackbar('Objet ajouté.', { variant: 'info' });
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <CustomCard name="Autres">
      <TableContainer component={Paper}>
        <Table>
          {items.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Quantité</TableCell>
                <TableCell width={120}></TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {items.map((item, index) => (
              <ItemRow item={item} key={index} />
            ))}
            {items.length <= 0 && <EmptyRow />}
            <AddRow onAdd={handleCreate} />
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default ItemsCard;
