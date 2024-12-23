import { Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const EmptyRow = () => {
  return (
    <TableRow>
      <TableCell colSpan={9} align="center">
        <Typography variant="body2" color="textDisabled">
          Aucune entrée
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default EmptyRow;
