import { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@mui/material';
import { LockOpen } from '@mui/icons-material';
import AuthKeyCard from './AuthKeyCard';
import AuthKeyDetails from './AuthKeyDetails';

/**
 * AuthKeyList - Displays list of auth keys
 */
const AuthKeyList = ({ keys, onRefresh }) => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleKeyClick = (key) => {
    setSelectedKey(key);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedKey(null);
  };

  const handleKeyUpdated = () => {
    setDetailsOpen(false);
    setSelectedKey(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  if (!keys || keys.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <LockOpen sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          No keys found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first auth key to get started
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {keys.map((key) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key.id}>
            <AuthKeyCard key={key.id} authKey={key} onClick={() => handleKeyClick(key)} />
          </Grid>
        ))}
      </Grid>

      {selectedKey && (
        <AuthKeyDetails
          open={detailsOpen}
          authKey={selectedKey}
          onClose={handleDetailsClose}
          onUpdated={handleKeyUpdated}
        />
      )}
    </>
  );
};

AuthKeyList.propTypes = {
  keys: PropTypes.array,
  onRefresh: PropTypes.func,
};

export default AuthKeyList;
