import React, { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  Avatar,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
// Icons
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatApiResponse {
  response: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
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
        content: response.data.response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error('Error calling the backend API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
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
      bgcolor: '#f5f5f5'
    }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DeepMine Sentinel AI
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="md" 
        sx={{ 
          flexGrow: 1, 
          py: 2, 
          display: 'flex', 
          flexDirection: 'column',
          height: 'calc(100% - 64px)'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            flexGrow: 1, 
            mb: 2, 
            p: 2, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <List sx={{ flexGrow: 1 }}>
            {messages.map((message, index) => (
              <ListItem 
                key={index} 
                sx={{
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 1
                }}
              >
                <Avatar sx={{ 
                  bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                  m: 1
                }}>
                  {message.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    ml: message.role === 'user' ? 0 : 1,
                    mr: message.role === 'user' ? 1 : 0,
                    bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                    maxWidth: '70%',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem>
                <Avatar sx={{ bgcolor: 'secondary.main', m: 1 }}>
                  <SmartToyIcon />
                </Avatar>
                <CircularProgress size={24} sx={{ m: 2 }} />
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Paper>
        
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{ mr: 1 }}
            onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            multiline
            maxRows={4}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!input.trim() || isLoading}
            sx={{ height: '56px' }}
          >
            <SendIcon />
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatInterface;
