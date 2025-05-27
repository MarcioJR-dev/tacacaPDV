import React from 'react';
import { Box, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Logo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 2,
        backgroundColor: 'primary.main',
        borderRadius: 2,
        color: 'white',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <RestaurantIcon sx={{ fontSize: 32 }} />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
          Tacacá
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
          Distribuidora
        </Typography>
      </Box>
      <LocalShippingIcon sx={{ fontSize: 24, marginLeft: 'auto' }} />
    </Box>
  );
};

export default Logo; 