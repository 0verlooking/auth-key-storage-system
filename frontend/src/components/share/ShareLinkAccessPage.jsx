import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { VpnKey, Visibility, VisibilityOff } from '@mui/icons-material';
import { shareLinkService } from '@services/shareLinkService';
import CopyButton from '@components/common/CopyButton';
import LoadingSpinner from '@components/common/LoadingSpinner';

/**
 * ShareLinkAccessPage - Public page for accessing shared auth keys
 */
const ShareLinkAccessPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    if (token) {
      accessShareLink();
    }
  }, [token]);

  const accessShareLink = async (pwd = null) => {
    setLoading(true);
    setError('');
    try {
      const data = await shareLinkService.accessShareLink(token, pwd);
      setShareData(data);
    } catch (err) {
      setError(err.message || 'Failed to access share link');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    accessShareLink(password);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading share link..." />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <VpnKey sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Shared Auth Key
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Someone has shared an authentication key with you
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Password Required */}
        {!shareData && !error && (
          <form onSubmit={handlePasswordSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info">This share link is password protected.</Alert>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Button type="submit" variant="contained" size="large">
                Access Share Link
              </Button>
            </Box>
          </form>
        )}

        {/* Share Data */}
        {shareData && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {shareData.name}
              </Typography>
            </Box>

            {shareData.username && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Username
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">{shareData.username}</Typography>
                  {shareData.access_type === 'copy_allowed' && (
                    <CopyButton value={shareData.username} />
                  )}
                </Box>
              </Box>
            )}

            {shareData.decrypted_value && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Value
                </Typography>
                <TextField
                  fullWidth
                  type={showValue ? 'text' : 'password'}
                  value={shareData.decrypted_value}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        {shareData.access_type === 'copy_allowed' && (
                          <CopyButton value={shareData.decrypted_value} />
                        )}
                        <IconButton onClick={() => setShowValue(!showValue)} edge="end">
                          {showValue ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {shareData.url && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  URL
                </Typography>
                <Typography
                  component="a"
                  href={shareData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'primary.main', wordBreak: 'break-all' }}
                >
                  {shareData.url}
                </Typography>
              </Box>
            )}

            {shareData.access_type === 'view_only' && (
              <Alert severity="info">
                This is a view-only share link. Copying is not allowed.
              </Alert>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ShareLinkAccessPage;
