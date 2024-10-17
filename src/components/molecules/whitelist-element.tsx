'use client';

import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import WhitelistDeleteButton from './whitelist-delete-button';

const WhitelistElement = ({ element }) => {
  const [value, setValue] = useState(element.email);

  const handleChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleBlur = async (e) => {
    e.preventDefault();
    await fetch(`/api/whitelist/${element.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        email: value,
      }),
    });
  };

  return (
    <Box sx={{ display: 'inline', verticalAlign: 'middle' }}>
      <TextField value={value} onChange={handleChange} onBlur={handleBlur} />
      <WhitelistDeleteButton id={element.id} />
    </Box>
  );
};

export default WhitelistElement;
