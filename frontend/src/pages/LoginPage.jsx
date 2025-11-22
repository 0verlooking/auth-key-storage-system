import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';
import { useAuth } from '@hooks/useAuth';
import { useNotification } from '@hooks/useNotification';
import { loginSchema } from '@utils/validators';
import { ROUTES, APP_NAME } from '@config/constants';
import LoadingSpinner from '@components/common/LoadingSpinner';

/**
 * LoginPage - User login page
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      master_password: '',
      remember_me: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');

      try {
        const result = await login(values);
        if (result.success) {
          success('Login successful!');
          navigate(ROUTES.DASHBOARD);
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred during login.');
        showError(err.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Logging in..." />;
  }

  return (
    <Box>
      {/* Logo/Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <VpnKey sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {APP_NAME}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to access your secure vault
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="master_password"
            name="master_password"
            label="Master Password"
            type={showMasterPassword ? 'text' : 'password'}
            autoComplete="off"
            value={formik.values.master_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.master_password && Boolean(formik.errors.master_password)}
            helperText={
              (formik.touched.master_password && formik.errors.master_password) ||
              'Required for decrypting your data'
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowMasterPassword(!showMasterPassword)}
                    edge="end"
                  >
                    {showMasterPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                id="remember_me"
                name="remember_me"
                checked={formik.values.remember_me}
                onChange={formik.handleChange}
              />
            }
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            Sign In
          </Button>
        </Box>
      </form>

      {/* Register Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to={ROUTES.REGISTER} underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
