import React from 'react';
import { Box } from '@mui/material';

const Background = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: '#E8F5E9',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%),
            repeating-linear-gradient(45deg, 
              rgba(46, 125, 50, 0.1) 0px, 
              rgba(46, 125, 50, 0.1) 2px, 
              transparent 2px, 
              transparent 20px
            ),
            repeating-linear-gradient(-45deg, 
              rgba(46, 125, 50, 0.1) 0px, 
              rgba(46, 125, 50, 0.1) 2px, 
              transparent 2px, 
              transparent 20px
            )
          `,
        }
      }}
    />
  );
};

export default Background; 