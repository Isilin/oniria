'use client';

import EditIcon from '@mui/icons-material/Edit';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface Props {
  value: string | number;
  onChange?: (value: string | number) => void;
}

const EditableField = ({ value, onChange }: Props) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [focused, setFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  const handleBlur = () => {
    setFocused(false);
    if (value !== currentValue) {
      onChange?.(currentValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFocused(false);
      if (value !== currentValue) {
        onChange?.(currentValue);
      }
    }
  };

  return (
    <>
      {!focused ? (
        <Typography
          display="inline"
          onClick={() => setFocused(true)}
          variant="body1"
          sx={{
            cursor: 'pointer',
            ':hover': { borderBottom: '2px solid white' },
          }}
          color="textSecondary"
        >
          {currentValue}{' '}
          <EditIcon sx={{ fontSize: 10, verticalAlign: 'top' }} />
        </Typography>
      ) : (
        <TextField
          autoFocus
          id="value"
          name="value"
          type="text"
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          variant="standard"
          slotProps={{ htmlInput: { style: { padding: 0 } } }}
          sx={{
            width:
              (typeof currentValue === 'string' ? currentValue.length + 1 : 3) *
              7,
            height: 10,
          }}
        />
      )}
    </>
  );
};

export default EditableField;
