import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <ErrorIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 