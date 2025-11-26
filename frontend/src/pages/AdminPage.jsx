import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  People,
  VpnKey,
  Folder,
  Label,
  Block,
  CheckCircle,
  Refresh,
  AdminPanelSettings,
} from '@mui/icons-material';
import { apiClient } from '@config/api';
import { useNotification } from '@hooks/useNotification';
import { formatDateTime } from '@utils/formatters';
import LoadingSpinner from '@components/common/LoadingSpinner';

/**
 * AdminPage - System administration dashboard
 */
const AdminPage = () => {
  const { error: showError, success } = useNotification();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [authKeys, setAuthKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load statistics
      const statsResponse = await apiClient.get('/api/admin/stats');
      setStats(statsResponse.data);

      // Load users list
      const usersResponse = await apiClient.get('/api/admin/users');
      setUsers(usersResponse.data);

      // Load all auth keys (metadata only)
      const keysResponse = await apiClient.get('/api/admin/auth-keys');
      setAuthKeys(keysResponse.data);

      success('Admin data loaded');
    } catch (err) {
      showError(err.message || 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await apiClient.patch(`/api/admin/users/${userId}/toggle-status`);
      success(`User ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      loadData();
    } catch (err) {
      showError('Failed to toggle user status');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={600}>
            Admin Dashboard
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadData}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {stats?.totalUsers || 0}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Auth Keys
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {stats?.totalAuthKeys || 0}
                  </Typography>
                </Box>
                <VpnKey sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Folders
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {stats?.totalFolders || 0}
                  </Typography>
                </Box>
                <Folder sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Tags
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {stats?.totalTags || 0}
                  </Typography>
                </Box>
                <Label sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Users" />
          <Tab label="Auth Keys" />
          <Tab label="System Info" />
        </Tabs>

        <CardContent>
          {/* Users Tab */}
          {tabValue === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Auth Keys</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color={user.role === 'ADMIN' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {user.accountLocked ? (
                          <Chip icon={<Block />} label="Locked" size="small" color="error" />
                        ) : (
                          <Chip icon={<CheckCircle />} label="Active" size="small" color="success" />
                        )}
                      </TableCell>
                      <TableCell>{user.authKeyCount || 0}</TableCell>
                      <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleUserStatus(user.id, !user.accountLocked)}
                          title={user.accountLocked ? 'Enable user' : 'Disable user'}
                        >
                          {user.accountLocked ? <CheckCircle /> : <Block />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Auth Keys Tab */}
          {tabValue === 1 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Folder</TableCell>
                    <TableCell>Access Count</TableCell>
                    <TableCell>Last Accessed</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>{key.id}</TableCell>
                      <TableCell>{key.title}</TableCell>
                      <TableCell>
                        <Chip label={key.keyType} size="small" />
                      </TableCell>
                      <TableCell>{key.userEmail}</TableCell>
                      <TableCell>{key.folderName || '-'}</TableCell>
                      <TableCell>{key.accessCount}</TableCell>
                      <TableCell>{key.lastAccessedAt ? formatDateTime(key.lastAccessedAt) : '-'}</TableCell>
                      <TableCell>{formatDateTime(key.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* System Info Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Application
                    </Typography>
                    <Typography variant="body1">Auth Key Storage System v1.0.0</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Database
                    </Typography>
                    <Typography variant="body1">PostgreSQL 15</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Cache
                    </Typography>
                    <Typography variant="body1">Redis 7</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Encryption
                    </Typography>
                    <Typography variant="body1">AES-256-GCM (Client-side)</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Statistics Summary
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                      <Typography variant="h5">
                        {users.filter(u => !u.accountLocked).length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Locked Users
                      </Typography>
                      <Typography variant="h5">
                        {users.filter(u => u.accountLocked).length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Accesses
                      </Typography>
                      <Typography variant="h5">
                        {authKeys.reduce((sum, key) => sum + (key.accessCount || 0), 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Favorite Keys
                      </Typography>
                      <Typography variant="h5">
                        {authKeys.filter(k => k.isFavorite).length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminPage;
