import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuthKeys } from '@hooks/useAuthKeys';
import { useNotification } from '@hooks/useNotification';
import AuthKeyList from '@components/authkeys/AuthKeyList';
import AuthKeyDialog from '@components/authkeys/AuthKeyDialog';
import AuthKeyFilter from '@components/authkeys/AuthKeyFilter';
import SearchBar from '@components/common/SearchBar';
import LoadingSpinner from '@components/common/LoadingSpinner';

/**
 * DashboardPage - Main dashboard showing auth keys
 */
const DashboardPage = () => {
  const { folderId } = useParams();
  const { authKeys, fetchAuthKeys, searchAuthKeys, filterByFolder, isLoading } = useAuthKeys();
  const { error: showError } = useNotification();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAuthKeys = useCallback(async () => {
    try {
      if (folderId) {
        await filterByFolder(folderId);
      } else {
        await fetchAuthKeys();
      }
    } catch (err) {
      showError('Failed to load auth keys');
    }
  }, [folderId, filterByFolder, fetchAuthKeys, showError]);

  useEffect(() => {
    loadAuthKeys();
  }, [loadAuthKeys]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        await searchAuthKeys(query);
      } catch (err) {
        showError('Search failed');
      }
    } else {
      loadAuthKeys();
    }
  };

  const handleCreateKey = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleKeySaved = () => {
    loadAuthKeys();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600}>
          {folderId ? 'Folder Keys' : 'All Keys'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateKey}
          size="large"
        >
          Add Key
        </Button>
      </Box>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <SearchBar onSearch={handleSearch} placeholder="Search keys..." />
        </Grid>
        <Grid item xs={12} md={6}>
          <AuthKeyFilter />
        </Grid>
      </Grid>

      {/* Keys List */}
      {isLoading ? (
        <LoadingSpinner message="Loading keys..." />
      ) : (
        <AuthKeyList keys={authKeys} onRefresh={loadAuthKeys} />
      )}

      {/* Create/Edit Dialog */}
      <AuthKeyDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSaved={handleKeySaved}
      />
    </Box>
  );
};

export default DashboardPage;
