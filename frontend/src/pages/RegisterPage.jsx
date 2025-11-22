import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';
import { useAuth } from '@hooks/useAuth';
import { useNotification } from '@hooks/useNotification';
import { registerSchema } from '@utils/validators';
import { ROUTES, APP_NAME, ENABLE_REGISTRATION } from '@config/constants';
import LoadingSpinner from '@components/common/LoadingSpinner';
import PasswordStrengthMeter from '@components/common/PasswordStrengthMeter';

/**
 * RegisterPage - User registration page
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: showError } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirm: '',
      master_password: '',
      master_password_confirm: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');

      try {
        const result = await register(values);
        if (result.success) {
          success('Registration successful! Welcome aboard!');
          navigate(ROUTES.DASHBOARD);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred during registration.');
        showError(err.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!ENABLE_REGISTRATION) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Registration Disabled
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Registration is currently disabled. Please contact the administrator.
        </Typography>
        <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained">
          Back to Login
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  return (
    <Box>
      {/* Logo/Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <VpnKey sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Join {APP_NAME} to securely store your credentials
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            autoComplete="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

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
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="password_confirm"
            name="password_confirm"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formik.values.password_confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password_confirm && Boolean(formik.errors.password_confirm)}
            helperText={formik.touched.password_confirm && formik.errors.password_confirm}
          />

          <Box>
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
                'Used to encrypt your data. Choose a strong password!'
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
            <Box sx={{ mt: 1 }}>
              <PasswordStrengthMeter password={formik.values.master_password} />
            </Box>
          </Box>

          <TextField
            fullWidth
            id="master_password_confirm"
            name="master_password_confirm"
            label="Confirm Master Password"
            type={showMasterPassword ? 'text' : 'password'}
            autoComplete="off"
            value={formik.values.master_password_confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.master_password_confirm &&
              Boolean(formik.errors.master_password_confirm)
            }
            helperText={
              formik.touched.master_password_confirm && formik.errors.master_password_confirm
            }
          />

          <Alert severity="warning">
            <strong>Important:</strong> Your master password cannot be recovered. Make sure to
            remember it!
          </Alert>

          <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading}>
            Create Account
          </Button>
        </Box>
      </form>

      {/* Login Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN} underline="hover">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
