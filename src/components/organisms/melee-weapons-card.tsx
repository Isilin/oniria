'use client';

import { useMeleeWeapons } from '@/lib/hooks/use-melee-weapons';
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
import MeleeWeaponRow from '../molecules/melee-weapon-row';

const MeleeWeaponsCard = () => {
  const { id } = useParams<{ id: string }>();
  const { meleeWeapons, isLoading, createMeleeWeapon } = useMeleeWeapons(id);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    createMeleeWeapon().then(() => {
      enqueueSnackbar('Arme de mêlée ajoutée.', { variant: 'info' });
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <CustomCard name="Armes de mêlée">
      <TableContainer component={Paper}>
        <Table>
          {meleeWeapons.length > 0 && (
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="center">Dégâts</TableCell>
                <TableCell align="center">Allonge</TableCell>
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
            {meleeWeapons.map((weapon, index) => (
              <MeleeWeaponRow weapon={weapon} key={index} />
            ))}

            {meleeWeapons.length <= 0 && <EmptyRow />}
            <AddRow onAdd={handleCreate} />
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default MeleeWeaponsCard;
