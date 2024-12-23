import EditIcon from '@mui/icons-material/Edit';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Golem } from '@prisma/client';
import IconAction from '../atoms/icon-action';
import DeleteGolemButton from './delete-golem-button';

interface Props {
  golem: Golem;
}

const GolemRow = ({ golem }: Props) => {
  return (
    <TableRow hover>
      <TableCell>{golem.name}</TableCell>
      <TableCell align="center">{golem.artefact || '-'}</TableCell>
      <TableCell align="center">{golem.symbiosis || '-'}</TableCell>
      <TableCell align="center">{golem.heart || '-'}</TableCell>
      <TableCell>
        <IconAction icon={EditIcon} />
        <DeleteGolemButton id={golem.id} />
      </TableCell>
    </TableRow>
  );
};

export default GolemRow;
