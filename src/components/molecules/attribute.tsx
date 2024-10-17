'use client';

import { Tooltip, Typography } from '@mui/material';
import EditableField from '../atoms/editable-field';

type Props = {
  name: string;
  major?: string;
  minor?: string;
  value: string | number;
  editable?: boolean;
};

const Attribute = ({ name, major, minor, value, editable }: Props) => {
  return (
    <span style={{ display: 'block' }}>
      <Typography variant="body1" display="inline">
        {name + ' '}
        {major && minor && (
          <>
            <Tooltip title={`${major} / ${minor}`}>
              <em style={{ textDecoration: 'underline dotted' }}>
                ({`${major.substring(0, 3)}/${minor.substring(0, 3)}`})
              </em>
            </Tooltip>{' '}
          </>
        )}
        :
      </Typography>{' '}
      {editable ? (
        <EditableField value={value} onChange={() => {}} />
      ) : (
        <Typography display="inline" variant="body1">
          {value}
        </Typography>
      )}
    </span>
  );
};

export default Attribute;
