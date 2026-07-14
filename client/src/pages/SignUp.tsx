import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#09090b',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
        py: 4,
      }}
    >
      {/* Decorative gamery sprites */}
      <Typography sx={{ position: 'absolute', top: '15%', left: '10%', color: '#22c55e', opacity: 0.3, fontFamily: 'monospace', fontSize: 28, userSelect: 'none', animation: 'pulse 4s infinite' }}>+</Typography>
      <Typography sx={{ position: 'absolute', top: '75%', left: '8%', color: '#3b82f6', opacity: 0.3, fontFamily: 'monospace', fontSize: 24, userSelect: 'none', transform: 'rotate(45deg)' }}>O</Typography>
      <Typography sx={{ position: 'absolute', top: '25%', right: '12%', color: '#ef4444', opacity: 0.3, fontFamily: 'monospace', fontSize: 28, userSelect: 'none' }}>△</Typography>
      <Typography sx={{ position: 'absolute', top: '65%', right: '15%', color: '#a855f7', opacity: 0.3, fontFamily: 'monospace', fontSize: 24, userSelect: 'none' }}>□</Typography>

      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: 40,
          height: 40,
          opacity: 0.5,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            background: '#22c55e',
            borderRadius: 0,
            transform: 'translate(-50%, -50%)',
            top: '50%',
            left: '50%',
          },
          '&::before': { width: '6px', height: '100%' },
          '&::after': { width: '100%', height: '6px' },
          filter: 'blur(2px)',
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, m: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 0,
            bgcolor: '#18181b',
            border: '2px solid #3f3f46',
            boxShadow: '8px 8px 0px rgba(34, 197, 94, 0.4)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 0,
                bgcolor: '#27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #3f3f46',
                mb: 1.5,
                boxShadow: '2px 2px 0px rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', fontStyle: 'italic' }}>
                L
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
              Create an account
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
              Join LifeMax to maximize your potential.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 0, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '2px solid rgba(239, 68, 68, 0.5)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name and Email side by side to save space */}
            <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#fff', mb: 0.5, display: 'block', fontWeight: 500 }}>
                  Full Name
                </Typography>
                <OutlinedInput
                  fullWidth
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <PersonOutlineIcon sx={{ color: '#a1a1aa', fontSize: 18 }} />
                    </InputAdornment>
                  }
                  sx={{
                    bgcolor: '#09090b',
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#27272a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3f3f46' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3b82f6' },
                    '& .MuiOutlinedInput-input': { py: 1.25, px: 1 },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#fff', mb: 0.5, display: 'block', fontWeight: 500 }}>
                  Email Address
                </Typography>
                <OutlinedInput
                  fullWidth
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <EmailOutlinedIcon sx={{ color: '#a1a1aa', fontSize: 18 }} />
                    </InputAdornment>
                  }
                  sx={{
                    bgcolor: '#09090b',
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#27272a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3f3f46' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3b82f6' },
                    '& .MuiOutlinedInput-input': { py: 1.25, px: 1 },
                  }}
                />
              </Box>
            </Box>

            {/* Passwords side by side */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#fff', mb: 0.5, display: 'block', fontWeight: 500 }}>
                  Password
                </Typography>
                <OutlinedInput
                  fullWidth
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <LockOutlinedIcon sx={{ color: '#a1a1aa', fontSize: 18 }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#a1a1aa', borderRadius: 0, p: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    bgcolor: '#09090b',
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#27272a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3f3f46' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3b82f6' },
                    '& .MuiOutlinedInput-input': { py: 1.25, px: 1 },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#fff', mb: 0.5, display: 'block', fontWeight: 500 }}>
                  Confirm
                </Typography>
                <OutlinedInput
                  fullWidth
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <LockOutlinedIcon sx={{ color: '#a1a1aa', fontSize: 18 }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#a1a1aa', borderRadius: 0, p: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    bgcolor: '#09090b',
                    borderRadius: 0,
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#27272a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3f3f46' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#3b82f6' },
                    '& .MuiOutlinedInput-input': { py: 1.25, px: 1 },
                  }}
                />
              </Box>
            </Box>

            {/* Sign Up Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#22c55e',
                color: '#fff',
                py: 1.25,
                borderRadius: 0,
                border: '2px solid #16a34a',
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                transition: 'all 0.1s',
                '&:hover': {
                  bgcolor: '#16a34a',
                  boxShadow: '6px 6px 0px rgba(0,0,0,0.7)',
                  transform: 'translate(-2px, -2px)',
                },
                '&:active': {
                  transform: 'translate(4px, 4px)',
                  boxShadow: '0px 0px 0px rgba(0,0,0,0)',
                },
                mb: 2.5,
              }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Divider */}
            <Divider sx={{ mb: 2.5, '&::before, &::after': { borderColor: '#27272a', borderTopWidth: '2px' } }}>
              <Typography variant="caption" sx={{ color: '#a1a1aa', px: 1, fontWeight: 700 }}>
                OR CONTINUE WITH
              </Typography>
            </Divider>

            {/* Social Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert("Work in progress! please signup/login normally")}
                startIcon={<GoogleIcon fontSize="small" />}
                sx={{
                  color: '#e4e4e7',
                  border: '2px solid #27272a',
                  bgcolor: '#09090b',
                  py: 1,
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                  transition: 'all 0.1s',
                  '&:hover': {
                    border: '2px solid #3f3f46',
                    bgcolor: '#18181b',
                    boxShadow: '6px 6px 0px rgba(0,0,0,0.7)',
                    transform: 'translate(-2px, -2px)',
                  },
                  '&:active': {
                    transform: 'translate(4px, 4px)',
                    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
                  },
                }}
              >
                Sign up with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert("Work in progress! please signup/login normally")}
                startIcon={<AppleIcon fontSize="small" />}
                sx={{
                  color: '#e4e4e7',
                  border: '2px solid #27272a',
                  bgcolor: '#09090b',
                  py: 1,
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                  transition: 'all 0.1s',
                  '&:hover': {
                    border: '2px solid #3f3f46',
                    bgcolor: '#18181b',
                    boxShadow: '6px 6px 0px rgba(0,0,0,0.7)',
                    transform: 'translate(-2px, -2px)',
                  },
                  '&:active': {
                    transform: 'translate(4px, 4px)',
                    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
                  },
                }}
              >
                Sign up with Apple
              </Button>
            </Box>

            {/* Login Link */}
            <Typography variant="body2" align="center" sx={{ color: '#a1a1aa' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                Sign In
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
