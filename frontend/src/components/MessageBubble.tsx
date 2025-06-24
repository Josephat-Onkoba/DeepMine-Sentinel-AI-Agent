import React from 'react';
import { Box, Avatar, Paper, Typography, useTheme, PaletteMode } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import '../styles/animations.css';

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode: PaletteMode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, mode }) => {
  const theme = useTheme();
  const isUser = role === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 2,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar sx={{ 
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          m: 1,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}>
          {isUser ? <PersonIcon /> : <SmartToyIcon />}
        </Avatar>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: isUser ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.4 }}
        className={isUser ? 'message-user' : 'message-assistant'}
        style={{ maxWidth: '75%' }}
      >
        <Paper
          sx={{
            p: 2,
            ml: isUser ? 0 : 1,
            mr: isUser ? 1 : 0,
            backgroundColor: isUser 
              ? theme.palette.userMessage.background
              : theme.palette.botMessage.background,
            color: isUser 
              ? theme.palette.userMessage.text
              : theme.palette.botMessage.text,
            borderRadius: 3,
            boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            position: 'relative',
            '&::after': isUser ? {
              content: '""',
              position: 'absolute',
              width: 12,
              height: 12,
              backgroundColor: theme.palette.userMessage.background,
              transform: 'rotate(45deg)',
              top: 20,
              right: -6,
            } : {
              content: '""',
              position: 'absolute',
              width: 12,
              height: 12,
              backgroundColor: theme.palette.botMessage.background,
              transform: 'rotate(45deg)',
              top: 20,
              left: -6,
            },
          }}
          className={theme.palette.mode === 'dark' ? 'dark glass-effect' : 'glass-effect'}
        >
          <Typography 
            component="div" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              '& code': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                padding: '0.2em 0.4em',
                borderRadius: 1,
                fontFamily: 'monospace',
              },
              '& pre': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                padding: 1.5,
                borderRadius: 1,
                overflowX: 'auto',
              }
            }}
          >
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default MessageBubble;
