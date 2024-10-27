'use client';
import { useSheet } from '@/lib/hooks/use-sheet';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import EditableField from '../atoms/editable-field';

interface Props {
  label: string;
  value: string | number;
  tooltip?: string;
  onEdit?: (newVal: string | number) => void;
  postValue?: string | number;
}

const SheetField = ({ label, value, tooltip, onEdit, postValue }: Props) => {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const { sheet } = useSheet(id);
  const { enqueueSnackbar } = useSnackbar();

  if (!session) return <CircularProgress />;

  const editable =
    session.user.role === 'ADMIN' || session.user.id === sheet.user.id;

  const handleChange = (newVal: string | number) => {
    onEdit?.(newVal);
    enqueueSnackbar(`${label} modifié.`, { variant: 'info' });
  };

  return (
    <Box display="flex" gap="4px">
      {tooltip ? (
        <Tooltip
          title={tooltip}
          arrow
          PopperProps={{ disablePortal: true }}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{ textDecoration: 'underline dotted' }}
          >
            {`${label} :`}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body1" component="span">{`${label} :`}</Typography>
      )}
      {editable && onEdit ? (
        <EditableField value={value} onChange={handleChange} />
      ) : (
        <Typography variant="body1" component="span">
          {value}
        </Typography>
      )}
      {postValue && (
        <Typography variant="body1" component="span">
          {postValue}
        </Typography>
      )}
    </Box>
  );
};

export default SheetField;
