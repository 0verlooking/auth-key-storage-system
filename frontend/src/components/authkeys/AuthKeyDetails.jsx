import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  Edit,
  Delete,
  Link as LinkIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuthKeys } from '@hooks/useAuthKeys';
import { useNotification } from '@hooks/useNotification';
import { AUTH_KEY_TYPES } from '@config/constants';
import { formatDateTime, formatKeyType } from '@utils/formatters';
import CopyButton from '@components/common/CopyButton';
import ConfirmDialog from '@components/common/ConfirmDialog';
import AuthKeyDialog from './AuthKeyDialog';
import LoadingSpinner from '@components/common/LoadingSpinner';

/**
 * AuthKeyDetails - Dialog showing detailed auth key information
 */
const AuthKeyDetails = ({ open, authKey, onClose, onUpdated }) => {
  const { decryptAuthKey, deleteAuthKey } = useAuthKeys();
  const { success, error: showError } = useNotification();

  const [decryptedKey, setDecryptedKey] = useState(null);
  const [showValue, setShowValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && authKey) {
      loadDecryptedKey();
    }
  }, [open, authKey]);

  const loadDecryptedKey = async () => {
    setIsLoading(true);
    try {
      const decrypted = await decryptAuthKey(authKey);
      setDecryptedKey(decrypted);
    } catch (err) {
      showError('Failed to decrypt auth key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSaved = () => {
    setEditOpen(false);
    loadDecryptedKey();
    if (onUpdated) {
      onUpdated();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAuthKey(authKey.id);
      success('Auth key deleted successfully');
      setDeleteConfirmOpen(false);
      onClose();
      if (onUpdated) {
        onUpdated();
      }
    } catch (err) {
      showError('Failed to delete auth key');
    }
  };

  const handleClose = () => {
    setShowValue(false);
    setDecryptedKey(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              {authKey?.name}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {isLoading ? (
            <LoadingSpinner message="Decrypting..." />
          ) : decryptedKey ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Type
                  </Typography>
                  <Chip label={formatKeyType(decryptedKey.type)} size="small" />
                </Grid>

                {decryptedKey.username && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Username
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{decryptedKey.username}</Typography>
                      <CopyButton value={decryptedKey.username} size="small" />
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {decryptedKey.type === AUTH_KEY_TYPES.PASSWORD ? 'Password' : 'Value'}
                  </Typography>
                  <TextField
                    fullWidth
                    type={showValue ? 'text' : 'password'}
                    value={decryptedKey.value || ''}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <CopyButton value={decryptedKey.value || ''} />
                          <IconButton onClick={() => setShowValue(!showValue)} edge="end">
                            {showValue ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {decryptedKey.url && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      URL
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinkIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography
                        component="a"
                        href={decryptedKey.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                      >
                        {decryptedKey.url}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {decryptedKey.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {decryptedKey.notes}
                    </Typography>
                  </Grid>
                )}

                {decryptedKey.tags && decryptedKey.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {decryptedKey.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          sx={{
                            backgroundColor: tag.color,
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(decryptedKey.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(decryptedKey.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button
            startIcon={<Delete />}
            color="error"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={handleClose}>Close</Button>
          <Button startIcon={<Edit />} variant="contained" onClick={handleEdit}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {decryptedKey && (
        <AuthKeyDialog
          open={editOpen}
          authKey={decryptedKey}
          onClose={handleEditClose}
          onSaved={handleEditSaved}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Auth Key"
        message={`Are you sure you want to delete "${authKey?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};

AuthKeyDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  authKey: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func,
};

export default AuthKeyDetails;
