'use client';

import EditIcon from '@mui/icons-material/Edit';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, FocusEvent, useState } from 'react';

const EditableField = ({ value, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [focused, setFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onChange(e.target.value);
  };

  return (
    <>
      {!focused ? (
        <Typography
          display="inline"
          onClick={() => setFocused(true)}
          variant="body1"
          sx={{ cursor: 'pointer' }}
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
          variant="standard"
          inputProps={{ style: { padding: 0 } }}
          sx={{ width: 30, height: 10 }}
        />
      )}
    </>
  );
};

export default EditableField;
