import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

interface Props {
  name: string;
}

const CustomCard = ({ name, children }: PropsWithChildren<Props>) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gap={4}>
          {name}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default CustomCard;
