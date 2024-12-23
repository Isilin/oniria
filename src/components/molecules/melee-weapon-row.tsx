import { MeleeWeaponWithProperties } from '@/lib/db/sheet';
import EditIcon from '@mui/icons-material/Edit';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconAction from '../atoms/icon-action';
import DeleteMeleeWeaponButton from './delete-melee-weapon-button';

interface Props {
  weapon: MeleeWeaponWithProperties;
}

const MeleeWeaponRow = ({ weapon }: Props) => {
  return (
    <TableRow hover>
      <TableCell>{weapon.name || '-'}</TableCell>
      <TableCell align="center">{weapon.damage || 0}</TableCell>
      <TableCell align="center">{weapon.extend || 0}</TableCell>
      <TableCell align="center">
        {weapon.bulk ? `${weapon.bulk}%` : '-'}
      </TableCell>
      <TableCell align="center">{weapon.strength || 0}</TableCell>
      <TableCell align="center">
        {weapon.prerequisite_stat
          ? `${weapon.prerequisite_stat.substring(0, 3)} ${weapon.prerequisite_value}`
          : '-'}
      </TableCell>
      <TableCell align="center">
        {weapon.properties.length > 0
          ? weapon.properties.map((property) => property.name).join(', ')
          : '-'}
      </TableCell>
      <TableCell align="center">{weapon.quality || 0}</TableCell>
      <TableCell>
        <IconAction icon={EditIcon} />
        <DeleteMeleeWeaponButton id={weapon.id} />
      </TableCell>
    </TableRow>
  );
};

export default MeleeWeaponRow;
