import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Button,TextField,Box,Typography,CircularProgress,Paper,Container} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    if (authError) {
      setErrors({ form: authError });
    }
  }, [authError]);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    
    setLoading(true);
    try {
      const role = await login(email, password);
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ 
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        {/* Image with proper error handling */}
        <Box
          component="img"
          src="/images/logo.png"
          alt="Expense Tracker Logo"
          onError={() => setImageError(true)}
          sx={{
            width: 120,
            height: 120,
            mb: 3,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: 3,
            display: imageError ? 'none' : 'block'
          }}
        />

        {/* Fallback when image fails */}
        {imageError && (
          <Box
            sx={{
              width: 120,
              height: 120,
              mb: 3,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: 'white',
              boxShadow: 3
            }}
          >
            💰
          </Box>
        )}

        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to manage your expenses
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {errors.form && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.form}
              </Alert>
            )}

            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="text" 
                onClick={() => navigate('/register')}
                disabled={loading}
                size="small"
              >
                Don't have an account? Sign up
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;