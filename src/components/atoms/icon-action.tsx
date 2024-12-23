import { Button, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { MouseEventHandler } from 'react';

interface Props {
  icon: OverridableComponent<SvgIconTypeMap>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconAction = ({ icon: Icon, onClick }: Props) => {
  return (
    <Button sx={{ minWidth: 'fit-content' }} onClick={onClick}>
      <Icon fontSize="small" />
    </Button>
  );
};

export default IconAction;
