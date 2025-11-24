import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useThemeMode } from '@hooks/useThemeMode';
import { userService } from '@services/userService';
import { storageService } from '@services/storageService';
import { useNotification } from '@hooks/useNotification';
import { changePasswordSchema } from '@utils/validators';
import { THEME_MODES } from '@config/constants';

/**
 * SettingsPage - Application settings page
 */
const SettingsPage = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { success, error: showError } = useNotification();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user preferences from storage
  const preferences = userService.getUserPreferences() || {
    autoLogout: true,
    sessionTimeout: 3600000, // 1 hour
    clipboardClearTimeout: 30000, // 30 seconds
    showNotifications: true,
  };

  const [localPreferences, setLocalPreferences] = useState(preferences);

  // Password change form
  const passwordFormik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      new_password_confirm: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        await userService.changePassword(values);
        success('Password changed successfully');
        resetForm();
        setPasswordDialogOpen(false);
      } catch (err) {
        showError(err.message || 'Failed to change password');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);
    userService.updateUserPreferences(newPreferences);
    success('Settings updated');
  };

  const handleClearCache = () => {
    try {
      // Clear only non-auth data
      const session = storageService.getSession();
      const masterKey = storageService.getMasterKey();

      localStorage.clear();

      // Restore auth data
      if (session) {
        storageService.setSession(session);
      }
      if (masterKey) {
        storageService.setMasterKey(masterKey);
      }

      success('Cache cleared successfully');
    } catch (err) {
      showError('Failed to clear cache');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Appearance
              </Typography>
              <Divider sx={{ my: 2 }} />

              <FormControl component="fieldset">
                <FormLabel component="legend">Theme</FormLabel>
                <RadioGroup
                  value={mode}
                  onChange={(e) => {
                    toggleTheme();
                    success(`Switched to ${e.target.value} mode`);
                  }}
                >
                  <FormControlLabel
                    value={THEME_MODES.LIGHT}
                    control={<Radio />}
                    label="Light"
                  />
                  <FormControlLabel
                    value={THEME_MODES.DARK}
                    control={<Radio />}
                    label="Dark"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Security
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.autoLogout}
                      onChange={(e) =>
                        handlePreferenceChange('autoLogout', e.target.checked)
                      }
                    />
                  }
                  label="Auto-logout on inactivity"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.showNotifications}
                      onChange={(e) =>
                        handlePreferenceChange('showNotifications', e.target.checked)
                      }
                    />
                  }
                  label="Show notifications"
                />

                <Button
                  variant="outlined"
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Data Management
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" onClick={handleClearCache}>
                  Clear Cache
                </Button>

                <Typography variant="caption" color="text.secondary">
                  Clear cached data without logging out
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* About */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                About
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Version:</strong> 1.0.0
                </Typography>
                <Typography variant="body2">
                  <strong>Built with:</strong> React, Material-UI, Spring Boot
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Secure authentication key storage with client-side encryption
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={passwordFormik.handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                id="current_password"
                name="current_password"
                label="Current Password"
                type="password"
                value={passwordFormik.values.current_password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.current_password &&
                  Boolean(passwordFormik.errors.current_password)
                }
                helperText={
                  passwordFormik.touched.current_password &&
                  passwordFormik.errors.current_password
                }
              />

              <TextField
                fullWidth
                id="new_password"
                name="new_password"
                label="New Password"
                type="password"
                value={passwordFormik.values.new_password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.new_password &&
                  Boolean(passwordFormik.errors.new_password)
                }
                helperText={
                  passwordFormik.touched.new_password && passwordFormik.errors.new_password
                }
              />

              <TextField
                fullWidth
                id="new_password_confirm"
                name="new_password_confirm"
                label="Confirm New Password"
                type="password"
                value={passwordFormik.values.new_password_confirm}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.new_password_confirm &&
                  Boolean(passwordFormik.errors.new_password_confirm)
                }
                helperText={
                  passwordFormik.touched.new_password_confirm &&
                  passwordFormik.errors.new_password_confirm
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Change Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
