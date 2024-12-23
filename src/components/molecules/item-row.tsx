import EditIcon from '@mui/icons-material/Edit';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Item } from '@prisma/client';
import IconAction from '../atoms/icon-action';
import DeleteItemButton from './delete-item-button';

interface Props {
  item: Item;
}

const ItemRow = ({ item }: Props) => {
  return (
    <TableRow hover>
      <TableCell>{item.name || '-'}</TableCell>
      <TableCell align="center">{item.description || '-'}</TableCell>
      <TableCell align="center">{item.quantity || 0}</TableCell>
      <TableCell>
        <IconAction icon={EditIcon} />
        <DeleteItemButton id={item.id} />
      </TableCell>
    </TableRow>
  );
};

export default ItemRow;
