import { RangeWeaponWithProperties } from '@/lib/db/sheet';
import EditIcon from '@mui/icons-material/Edit';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconAction from '../atoms/icon-action';
import DeleteRangeWeaponButton from './delete-range-weapon-button';

interface Props {
  weapon: RangeWeaponWithProperties;
}

const RangeWeaponRow = ({ weapon }: Props) => {
  return (
    <TableRow hover>
      <TableCell>{weapon.name || '-'}</TableCell>
      <TableCell align="center">
        {weapon.damage || 0}{' '}
        {weapon.penetration_damage ? `(${weapon.penetration_damage})` : ''}
      </TableCell>
      <TableCell align="center">{weapon.velocity || 0}</TableCell>
      <TableCell align="center">
        {weapon.rate || 0} / {weapon.reload_rate || 0}
      </TableCell>
      <TableCell align="center">
        {weapon.low_range || 0} / {weapon.medium_range || 0} /{' '}
        {weapon.long_range || 0}
      </TableCell>
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
        <DeleteRangeWeaponButton id={weapon.id} />
      </TableCell>
    </TableRow>
  );
};

export default RangeWeaponRow;
