import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.username, formData.password);
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0054a6 0%, #8dc63f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Logo and Title */}
            <Box textAlign="center" mb={4}>
              <Box
                component="img"
                src="/logo.png"
                alt="SLT Mobitel Logo"
                sx={{
                  maxWidth: 280,
                  width: '100%',
                  height: 'auto',
                  mb: 2,
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #0054a6, #8dc63f)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Service Request Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please sign in to continue
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                autoComplete="username"
                disabled={loading}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                autoComplete="current-password"
                disabled={loading}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #0054a6, #8dc63f)',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #003d7a, #5e9e0c)',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                Service Request Management System
              </Typography>
              <Typography variant="caption" color="text.secondary">
                © 2025 SLT Mobitel. All rights reserved.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
