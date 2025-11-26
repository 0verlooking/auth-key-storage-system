import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit,
  Lock,
  VpnKey,
  Folder,
  Label,
  Close,
} from '@mui/icons-material';
import { useAuth } from '@hooks/useAuth';
import { useNotification } from '@hooks/useNotification';
import { getInitials, formatDateTime } from '@utils/formatters';
import { apiClient } from '@config/api';

/**
 * ProfilePage - User profile page with edit capabilities and statistics
 */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error: showError } = useNotification();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await apiClient.get('/api/users/profile/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  };

  const handleEditOpen = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = async () => {
    try {
      const response = await apiClient.put('/api/users/profile', editForm);
      updateUser(response.data);
      success('Profile updated successfully');
      handleEditClose();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordOpen = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordDialogOpen(true);
  };

  const handlePasswordClose = () => {
    setPasswordDialogOpen(false);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    try {
      await apiClient.put('/api/users/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      success('Password changed successfully');
      handlePasswordClose();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Avatar and Basic Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2,
                }}
              >
                {getInitials(user?.username)}
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Chip
                label={user?.role}
                color={user?.role === 'ADMIN' ? 'error' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />

              <Divider sx={{ my: 3 }} />

              <Button
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
                onClick={handleEditOpen}
                sx={{ mb: 1 }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                fullWidth
                onClick={handlePasswordOpen}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          {stats && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Statistics
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VpnKey sx={{ mr: 2, color: 'primary.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Auth Keys
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.authKeysCount || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Folder sx={{ mr: 2, color: 'warning.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Folders
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.foldersCount || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Label sx={{ mr: 2, color: 'success.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tags
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.tagsCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Account Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Account Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.username}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    First Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.firstName || 'Not set'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.lastName || 'Not set'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Role
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.role}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Account Status
                  </Typography>
                  <Chip
                    label={user?.accountLocked ? 'Locked' : 'Active'}
                    color={user?.accountLocked ? 'error' : 'success'}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member Since
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.createdAt ? formatDateTime(user.createdAt) : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.updatedAt ? formatDateTime(user.updatedAt) : 'N/A'}
                  </Typography>
                </Grid>

                {user?.lastLoginAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last Login
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDateTime(user.lastLoginAt)}
                    </Typography>
                  </Grid>
                )}

                {user?.lastLoginIp && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last Login IP
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.lastLoginIp}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Edit Profile
            <IconButton onClick={handleEditClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Change Password
            <IconButton onClick={handlePasswordClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordClose}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
