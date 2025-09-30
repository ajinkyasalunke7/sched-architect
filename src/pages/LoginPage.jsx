import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../app/slices/authSlice';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await dispatch(login({ username, password })).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Use username: coordinator, password: password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
              mb: 2,
            }}
          >
            <CalendarIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            NEP Smart Timetable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Academic Coordinator Portal
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'hsl(220 20% 97%)', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Demo Credentials:</strong>
            <br />
            Username: coordinator
            <br />
            Password: password
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
