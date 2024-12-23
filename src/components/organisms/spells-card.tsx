'use client';

import { useSpells } from '@/lib/hooks/use-spells';
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
import SpellRow from '../molecules/spell-row';

const SpellsCard = () => {
  const { id } = useParams<{ id: string }>();
  const { spells, isLoading, createSpell } = useSpells(id);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    createSpell().then(() => {
      enqueueSnackbar('Sortilège ajouté.', { variant: 'info' });
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <CustomCard name="Sortilèges">
      <TableContainer component={Paper}>
        <Table>
          {spells.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="center">Incantation</TableCell>
                <TableCell align="center">Ciblage</TableCell>
                <TableCell align="center">Durée</TableCell>
                <TableCell align="center">Effets</TableCell>
                <TableCell width={120}></TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {spells.map((spell, index) => (
              <SpellRow spell={spell} key={index} />
            ))}

            {spells.length <= 0 && <EmptyRow />}
            <AddRow onAdd={handleCreate} />
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default SpellsCard;
