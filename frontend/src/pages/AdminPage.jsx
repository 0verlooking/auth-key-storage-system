import { useState, useEffect, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tooltip,
  Divider,
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
  Search,
  Delete,
  Visibility,
  Download,
  SwapHoriz,
  Security,
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

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [authKeySearch, setAuthKeySearch] = useState('');

  // Dialogs
  const [viewUserDialog, setViewUserDialog] = useState({ open: false, user: null });
  const [deleteUserDialog, setDeleteUserDialog] = useState({ open: false, user: null });
  const [changeRoleDialog, setChangeRoleDialog] = useState({ open: false, user: null, newRole: '' });

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

  const handleViewUser = (user) => {
    setViewUserDialog({ open: true, user });
  };

  const handleDeleteUser = (user) => {
    setDeleteUserDialog({ open: true, user });
  };

  const confirmDeleteUser = async () => {
    try {
      await apiClient.delete(`/api/admin/users/${deleteUserDialog.user.id}`);
      success('User deleted successfully');
      setDeleteUserDialog({ open: false, user: null });
      loadData();
    } catch (err) {
      showError('Failed to delete user');
    }
  };

  const handleChangeRole = (user) => {
    setChangeRoleDialog({
      open: true,
      user,
      newRole: user.role === 'ADMIN' ? 'USER' : 'ADMIN',
    });
  };

  const confirmChangeRole = async () => {
    try {
      await apiClient.patch(`/api/admin/users/${changeRoleDialog.user.id}/role`, {
        role: changeRoleDialog.newRole,
      });
      success(`User role changed to ${changeRoleDialog.newRole}`);
      setChangeRoleDialog({ open: false, user: null, newRole: '' });
      loadData();
    } catch (err) {
      showError('Failed to change user role');
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['ID', 'Email', 'Username', 'Role', 'Status', 'Auth Keys', 'Created At'].join(','),
      ...filteredUsers.map((user) =>
        [
          user.id,
          user.email,
          user.username,
          user.role,
          user.accountLocked ? 'Locked' : 'Active',
          user.authKeyCount || 0,
          formatDateTime(user.createdAt),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Users exported successfully');
  };

  const handleExportAuthKeys = () => {
    const csvContent = [
      ['ID', 'Title', 'Type', 'Owner', 'Folder', 'Access Count', 'Last Accessed', 'Created At'].join(','),
      ...filteredAuthKeys.map((key) =>
        [
          key.id,
          key.title,
          key.keyType,
          key.userEmail,
          key.folderName || '-',
          key.accessCount,
          key.lastAccessedAt ? formatDateTime(key.lastAccessedAt) : '-',
          formatDateTime(key.createdAt),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth_keys_export_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Auth keys exported successfully');
  };

  // Filtered lists
  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const search = userSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
    );
  }, [users, userSearch]);

  const filteredAuthKeys = useMemo(() => {
    if (!authKeySearch) return authKeys;
    const search = authKeySearch.toLowerCase();
    return authKeys.filter(
      (key) =>
        key.title.toLowerCase().includes(search) ||
        key.keyType.toLowerCase().includes(search) ||
        key.userEmail.toLowerCase().includes(search) ||
        (key.folderName && key.folderName.toLowerCase().includes(search))
    );
  }, [authKeys, authKeySearch]);

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
            <>
              <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportUsers}
                  size="small"
                >
                  Export CSV
                </Button>
              </Box>

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
                    {filteredUsers.map((user) => (
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
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewUser(user)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.accountLocked ? 'Enable user' : 'Disable user'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleUserStatus(user.id, !user.accountLocked)}
                            >
                              {user.accountLocked ? <CheckCircle /> : <Block />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Change Role">
                            <IconButton size="small" onClick={() => handleChangeRole(user)}>
                              <SwapHoriz />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Auth Keys Tab */}
          {tabValue === 1 && (
            <>
              <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  placeholder="Search auth keys..."
                  value={authKeySearch}
                  onChange={(e) => setAuthKeySearch(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportAuthKeys}
                  size="small"
                >
                  Export CSV
                </Button>
              </Box>

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
                    {filteredAuthKeys.map((key) => (
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
            </>
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

      {/* View User Dialog */}
      <Dialog
        open={viewUserDialog.open}
        onClose={() => setViewUserDialog({ open: false, user: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewUserDialog.user && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {viewUserDialog.user.id}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {viewUserDialog.user.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {viewUserDialog.user.username}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Chip
                    label={viewUserDialog.user.role}
                    size="small"
                    color={viewUserDialog.user.role === 'ADMIN' ? 'error' : 'default'}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={viewUserDialog.user.accountLocked ? <Block /> : <CheckCircle />}
                    label={viewUserDialog.user.accountLocked ? 'Locked' : 'Active'}
                    size="small"
                    color={viewUserDialog.user.accountLocked ? 'error' : 'success'}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Auth Keys Count
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {viewUserDialog.user.authKeyCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDateTime(viewUserDialog.user.createdAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUserDialog({ open: false, user: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteUserDialog.open}
        onClose={() => setDeleteUserDialog({ open: false, user: null })}
        maxWidth="xs"
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{' '}
            <strong>{deleteUserDialog.user?.email}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. All user data including auth keys will be permanently
            deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialog({ open: false, user: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={changeRoleDialog.open}
        onClose={() => setChangeRoleDialog({ open: false, user: null, newRole: '' })}
        maxWidth="xs"
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Change role for user <strong>{changeRoleDialog.user?.email}</strong>
          </Typography>
          <TextField
            select
            fullWidth
            label="New Role"
            value={changeRoleDialog.newRole}
            onChange={(e) =>
              setChangeRoleDialog({ ...changeRoleDialog, newRole: e.target.value })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeRoleDialog({ open: false, user: null, newRole: '' })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmChangeRole}>
            Change Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
