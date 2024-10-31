import { Typography } from '@mui/material';

interface Props {
  changed: boolean;
}

const ChangedIndicator = ({ changed }: Props) => {
  return changed ? (
    <Typography variant="caption">Modifications non sauvegardées.</Typography>
  ) : (
    <></>
  );
};

export default ChangedIndicator;
