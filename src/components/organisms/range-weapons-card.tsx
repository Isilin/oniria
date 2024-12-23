'use client';

import { useRangeWeapons } from '@/lib/hooks/use-range-weapons';
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
import RangeWeaponRow from '../molecules/range-weapon-row';

const RangeWeaponsCard = () => {
  const { id } = useParams<{ id: string }>();
  const { rangeWeapons, isLoading, createRangeWeapon } = useRangeWeapons(id);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    createRangeWeapon().then(() => {
      enqueueSnackbar('Arme de tir ajoutée.', { variant: 'info' });
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <CustomCard name="Armes de tir">
      <TableContainer component={Paper}>
        <Table>
          {rangeWeapons.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="center">Dégâts</TableCell>
                <TableCell align="center">Vélocité</TableCell>
                <TableCell align="center">Cadence</TableCell>
                <TableCell align="center">Portée</TableCell>
                <TableCell align="center">Encombrement</TableCell>
                <TableCell align="center">Solidité</TableCell>
                <TableCell align="center">Prérequis</TableCell>
                <TableCell align="center">Propriétés</TableCell>
                <TableCell align="center">Qualité</TableCell>
                <TableCell width={120}></TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {rangeWeapons.map((weapon, index) => (
              <RangeWeaponRow weapon={weapon} key={index} />
            ))}

            {rangeWeapons.length <= 0 && <EmptyRow />}
            <AddRow onAdd={handleCreate} />
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default RangeWeaponsCard;
