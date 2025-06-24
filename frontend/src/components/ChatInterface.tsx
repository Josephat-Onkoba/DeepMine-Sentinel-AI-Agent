import React, { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  List,
  IconButton,
  InputAdornment,
  useTheme,
  PaletteMode,
  Fade,
  alpha,
  Tooltip
} from '@mui/material';
// Icons
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
// Components
import Header from './Header';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeAnimation from './WelcomeAnimation';
// Animation
import { motion } from 'framer-motion';
import '../styles/animations.css';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

interface ChatApiResponse {
  response: string;
}

interface ColorModeContext {
  toggleColorMode: () => void;
}

interface ChatInterfaceProps {
  colorMode: ColorModeContext;
  mode: PaletteMode;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ colorMode, mode }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m DeepMine Sentinel AI — your mining safety assistant. I\'m here to share safety tips, assess environmental risks, and support safer underground operations. How can I assist you today?',
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Hide welcome animation after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [messages]);
  
  const clearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Chat history cleared. How can I assist you with mining safety today?',
        timestamp: new Date() 
      }
    ]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post<ChatApiResponse>(
        'http://localhost:3001/api/chat',
        { message: input }
      );

      const botMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error('Error calling the backend API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again or check your connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}
    className={mode === 'dark' ? 'dark' : ''}
    >
      <Header toggleColorMode={colorMode.toggleColorMode} mode={mode} />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          py: 2, 
          px: { xs: 1, sm: 2, md: 3 },
          display: 'flex', 
          flexDirection: 'column',
          height: 'calc(100% - 64px)'
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Paper 
            elevation={mode === 'dark' ? 4 : 2} 
            ref={chatContainerRef}
            sx={{ 
              flexGrow: 1, 
              mb: 2, 
              p: { xs: 1, sm: 2, md: 3 }, 
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRadius: 3,
              backgroundImage: mode === 'dark' 
                ? 'radial-gradient(circle at 50% 50%, rgba(66, 39, 90, 0.2) 0%, rgba(25, 25, 25, 0) 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(103, 58, 183, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
              backgroundSize: '120% 120%',
              backgroundPosition: 'center',
            }}
            className={mode === 'dark' ? 'dark glass-effect' : 'glass-effect'}
          >
            {/* Welcome animation overlay */}
            <Fade in={showWelcome} timeout={500} unmountOnExit>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(18, 18, 24, 0.85)' 
                    : 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 3,
                }}
              >
                <WelcomeAnimation mode={mode} />
              </Box>
            </Fade>
            
            <List sx={{ 
              flexGrow: 1, 
              p: 0,
              '& > div:nth-of-type(odd)': {
                backgroundColor: mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.05)
                  : alpha(theme.palette.background.paper, 0.3),
              }
            }}>
              {messages.map((message, index) => (
                <Box key={index} sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <MessageBubble 
                    role={message.role}
                    content={message.content}
                    mode={mode}
                  />
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ml: 7,
                    }}
                  >
                    <TypingIndicator isVisible={true} />
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </List>
          </Paper>
          
          <Paper 
            component="form" 
            onSubmit={handleSubmit} 
            elevation={mode === 'dark' ? 4 : 2}
            sx={{ 
              p: 1.5, 
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: mode === 'dark' ? 'rgba(42, 42, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            className={mode === 'dark' ? 'dark glass-effect' : 'glass-effect'}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginRight: '8px' }}
            >
              <IconButton 
                color="primary"
                aria-label="attach file"
                sx={{ opacity: 0.7 }}
              >
                <AttachFileIcon />
              </IconButton>
            </motion.div>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              multiline
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      aria-label="emoji"
                      edge="end"
                      sx={{ opacity: 0.7 }}
                    >
                      <SentimentSatisfiedAltIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: mode === 'dark' ? 'rgba(30, 30, 35, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                  },
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            
            <Box sx={{ display: 'flex', ml: 1, gap: 1 }}>
              {messages.length > 1 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Clear chat">
                    <IconButton
                      color="primary"
                      onClick={clearChat}
                      disabled={isLoading}
                    >
                      <DeleteSweepIcon />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  color="primary"
                  aria-label="voice input"
                  disabled={isLoading}
                >
                  <MicIcon />
                </IconButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={!input.trim() || isLoading}
                  endIcon={<SendIcon />}
                  sx={{ 
                    height: '42px',
                    boxShadow: theme.palette.mode === 'dark' ? '0 0 15px rgba(103, 58, 183, 0.3)' : '0 0 15px rgba(103, 58, 183, 0.2)',
                    px: 2
                  }}
                >
                  Send
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ChatInterface;
