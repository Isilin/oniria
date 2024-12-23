import EditIcon from '@mui/icons-material/Edit';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Spell } from '@prisma/client';
import IconAction from '../atoms/icon-action';
import DeleteSpellButton from './delete-spell-button';

interface Props {
  spell: Spell;
}

const SpellRow = ({ spell }: Props) => {
  return (
    <TableRow hover>
      <TableCell>{spell.name}</TableCell>
      <TableCell align="center">{spell.incantation || '-'}</TableCell>
      <TableCell align="center">{spell.targeting || '-'}</TableCell>
      <TableCell align="center">{spell.duration || '-'}</TableCell>
      <TableCell align="center">{spell.effect || '-'}</TableCell>
      <TableCell>
        <IconAction icon={EditIcon} />
        <DeleteSpellButton id={spell.id} />
      </TableCell>
    </TableRow>
  );
};

export default SpellRow;
