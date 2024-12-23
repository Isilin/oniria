'use client';

import { useGolems } from '@/lib/hooks/use-golems';
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
import GolemRow from '../molecules/golem-row';

const GolemsCard = () => {
  const { id } = useParams<{ id: string }>();
  const { golems, isLoading, createGolem } = useGolems(id);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    createGolem().then(() => {
      enqueueSnackbar('Golem ajouté.', { variant: 'info' });
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <CustomCard name="Golems">
      <TableContainer component={Paper}>
        <Table>
          {golems.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="center">Artefact</TableCell>
                <TableCell align="center">Symbiose</TableCell>
                <TableCell align="center">Core</TableCell>
                <TableCell width={120}></TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {golems.map((golem, index) => (
              <GolemRow golem={golem} key={index} />
            ))}
            {golems.length <= 0 && <EmptyRow />}
            <AddRow onAdd={handleCreate} />
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default GolemsCard;
