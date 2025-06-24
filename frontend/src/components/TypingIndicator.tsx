import React from 'react';
import { Box, useTheme } from '@mui/material';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
      }}
      className="typing-indicator"
    >
      <Dot delay={0} />
      <Dot delay={0.2} />
      <Dot delay={0.4} />
    </Box>
  );
};

interface DotProps {
  delay: number;
}

const Dot: React.FC<DotProps> = ({ delay }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="span"
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: theme.palette.secondary.main,
        animation: `bounce 1.4s infinite ${delay}s`,
        '@keyframes bounce': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          }
        },
      }}
    />
  );
};

export default TypingIndicator;
