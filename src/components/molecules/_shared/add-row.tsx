import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface Props {
  onAdd?: () => void;
}

const AddRow = ({ onAdd }: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={12} align="center" padding="none">
        <Button fullWidth onClick={onAdd}>
          <AddIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddRow;
