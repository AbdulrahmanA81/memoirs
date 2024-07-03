"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography, TextField, Dialog, DialogActions, DialogContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import SendIcon from '@mui/icons-material/Send'; // Correct import for Send icon from MUI icons

const placeholderMessages = [
  {
    type: 'user',
    content: 'Hello AI, show me some images of cats.',
  },
  {
    type: 'ai',
    content: 'Sure, here are some images of cats:',
    images: [
      'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
      'https://media.istockphoto.com/id/91626487/photo/funny-kitten.jpg?s=612x612&w=0&k=20&c=9Ftu_rNQpfWhYkmQzvC2x_-yGKhoJmzUBemM4AlaWYw=',
      'https://media.istockphoto.com/id/1447238754/photo/kitten-on-white-background.jpg?s=612x612&w=0&k=20&c=KOHJKO27dql9wxmYG-MMYPcln6e2oXqk8eUmh-XgSoY=',
    ],
  },
  {
    type: 'user',
    content: 'Thank you!',
  },
  {
    type: 'ai',
    content: 'You\'re welcome! Is there anything else you need?',
    images: [],
  },
];

export default function AiChatPage(): React.JSX.Element {
  const [messages, setMessages] = useState(placeholderMessages);
  const [inputText, setInputText] = useState('');
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = { type: 'user', content: inputText, images: [] };
      setMessages([...messages, newMessage]);
      setInputText('');
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          type: 'ai',
          content: 'Here are some more images of cats:',
          images: [
            'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
            'https://media.istockphoto.com/id/91626487/photo/funny-kitten.jpg?s=612x612&w=0&k=20&c=9Ftu_rNQpfWhYkmQzvC2x_-yGKhoJmzUBemM4AlaWYw=',
            'https://media.istockphoto.com/id/1447238754/photo/kitten-on-white-background.jpg?s=612x612&w=0&k=20&c=KOHJKO27dql9wxmYG-MMYPcln6e2oXqk8eUmh-XgSoY=',
            'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
            'https://media.istockphoto.com/id/91626487/photo/funny-kitten.jpg?s=612x612&w=0&k=20&c=9Ftu_rNQpfWhYkmQzvC2x_-yGKhoJmzUBemM4AlaWYw=',
            'https://media.istockphoto.com/id/1447238754/photo/kitten-on-white-background.jpg?s=612x612&w=0&k=20&c=KOHJKO27dql9wxmYG-MMYPcln6e2oXqk8eUmh-XgSoY='
          ],
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      }, 1000);
    }
  };

  const handleImageClick = (src) => {
    setOverlayImage(src);
    setOverlayOpen(true);
  };

  const handleOverlayClick = () => {
    setOverlayOpen(false);
    setOverlayImage(null);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Stack sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexShrink: 0, padding: 1, backgroundColor: 'white', borderBottom: '1px solid grey.300' }}>
        <Typography variant="h4">Chat with Your Photos</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Card sx={{ backgroundColor: message.type === 'user' ? 'primary.main' : 'grey.200', color: message.type === 'user' ? 'white' : 'black' }}>
              <CardContent>
                <Typography variant="body1">{message.content}</Typography>
                {Array.isArray(message.images) && message.images.length > 0 && (
                  <Grid container spacing={1} sx={{ marginTop: 1 }}>
                    {message.images.map((image, idx) => (
                      <Grid item xs={4} key={idx}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={image}
                          alt={`AI Image ${idx + 1}`}
                          onClick={() => handleImageClick(image)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ flexShrink: 0, padding: 2, borderTop: '1px solid grey.300', display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ marginRight: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSend}
        >
          Send
        </Button>
      </Box>

      {overlayOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleOverlayClick}
        >
          <img 
            src={overlayImage} 
            alt="Overlay"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </Stack>
  );
}
