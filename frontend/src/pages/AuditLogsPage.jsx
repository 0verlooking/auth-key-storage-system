import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import { apiClient } from '@config/api';
import { formatDateTime } from '@utils/formatters';
import { useNotification } from '@hooks/useNotification';

/**
 * AuditLogsPage - Displays user activity audit logs with filtering and pagination
 */
const AuditLogsPage = () => {
  const { error: showError } = useNotification();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Available options for filters
  const actionTypes = [
    'LOGIN',
    'LOGOUT',
    'CREATE_KEY',
    'UPDATE_KEY',
    'DELETE_KEY',
    'VIEW_KEY',
    'CREATE_FOLDER',
    'UPDATE_FOLDER',
    'DELETE_FOLDER',
    'CREATE_TAG',
    'UPDATE_TAG',
    'DELETE_TAG',
    'UPDATE_PROFILE',
    'CHANGE_PASSWORD',
  ];

  const resourceTypes = ['AUTH_KEY', 'FOLDER', 'TAG', 'USER', 'PROFILE'];

  useEffect(() => {
    loadAuditLogs();
  }, [page, rowsPerPage, actionFilter, resourceTypeFilter, statusFilter]);

  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/audit-logs?page=${page}&size=${rowsPerPage}&sort=timestamp&direction=DESC`;

      // Apply action filter if selected
      if (actionFilter) {
        url = `/api/audit-logs/action/${actionFilter}?page=${page}&size=${rowsPerPage}`;
      }

      const response = await apiClient.get(url);

      let filteredLogs = response.data.content || [];

      // Apply resource type filter (client-side)
      if (resourceTypeFilter) {
        filteredLogs = filteredLogs.filter(
          (log) => log.resource_type === resourceTypeFilter
        );
      }

      // Apply status filter (client-side)
      if (statusFilter !== '') {
        const isSuccessful = statusFilter === 'success';
        filteredLogs = filteredLogs.filter((log) => log.is_successful === isSuccessful);
      }

      setLogs(filteredLogs);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      showError(err.response?.data?.message || 'Failed to load audit logs');
      setLogs([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, actionFilter, resourceTypeFilter, statusFilter, showError]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    loadAuditLogs();
  };

  const handleResetFilters = () => {
    setActionFilter('');
    setResourceTypeFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const getActionColor = (action) => {
    if (action?.includes('CREATE')) return 'success';
    if (action?.includes('UPDATE')) return 'info';
    if (action?.includes('DELETE')) return 'error';
    if (action?.includes('VIEW')) return 'default';
    if (action?.includes('LOGIN')) return 'primary';
    return 'default';
  };

  const getResourceTypeColor = (resourceType) => {
    switch (resourceType) {
      case 'AUTH_KEY':
        return 'primary';
      case 'FOLDER':
        return 'warning';
      case 'TAG':
        return 'success';
      case 'USER':
      case 'PROFILE':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Audit Logs
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Action Type"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(0);
                }}
                size="small"
              >
                <MenuItem value="">All Actions</MenuItem>
                {actionTypes.map((action) => (
                  <MenuItem key={action} value={action}>
                    {action.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Resource Type"
                value={resourceTypeFilter}
                onChange={(e) => {
                  setResourceTypeFilter(e.target.value);
                  setPage(0);
                }}
                size="small"
              >
                <MenuItem value="">All Resources</MenuItem>
                {resourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                size="small"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failure">Failure</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Chip
                  label="Reset Filters"
                  onClick={handleResetFilters}
                  onDelete={handleResetFilters}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : logs.length === 0 ? (
            <Alert severity="info">No audit logs found matching the selected filters.</Alert>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Timestamp</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Action</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Resource</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Details</strong>
                      </TableCell>
                      <TableCell>
                        <strong>IP Address</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {formatDateTime(log.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.action.replace(/_/g, ' ')}
                            color={getActionColor(log.action)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            {log.resource_type && (
                              <Chip
                                label={log.resource_type.replace(/_/g, ' ')}
                                color={getResourceTypeColor(log.resource_type)}
                                size="small"
                                sx={{ mb: 0.5 }}
                              />
                            )}
                            {log.resource_id && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                ID: {log.resource_id}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={log.details || 'No details'} placement="top">
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 250,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {log.details || '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.ip_address || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {log.is_successful ? (
                            <Tooltip title="Success">
                              <CheckCircle color="success" fontSize="small" />
                            </Tooltip>
                          ) : (
                            <Tooltip title={log.error_message || 'Failed'}>
                              <ErrorIcon color="error" fontSize="small" />
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditLogsPage;
