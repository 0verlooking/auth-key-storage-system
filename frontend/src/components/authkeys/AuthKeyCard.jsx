import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import { VpnKey, Link as LinkIcon, Visibility } from '@mui/icons-material';
import { formatRelativeTime, formatKeyType } from '@utils/formatters';
import CopyButton from '@components/common/CopyButton';

/**
 * AuthKeyCard - Card component displaying auth key summary
 */
const AuthKeyCard = ({ authKey, onClick }) => {
  const handleCardClick = (e) => {
    // Don't trigger onClick when clicking action buttons
    if (e.target.closest('.MuiCardActions-root')) {
      return;
    }
    onClick(authKey);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-4px)',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <VpnKey color="primary" sx={{ mt: 0.5 }} />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="div" noWrap fontWeight={600}>
              {authKey.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatKeyType(authKey.type)}
            </Typography>
          </Box>
        </Box>

        {authKey.url && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {new URL(authKey.url).hostname}
            </Typography>
          </Box>
        )}

        {authKey.tags && authKey.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
            {authKey.tags.slice(0, 2).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: tag.color,
                  color: 'white',
                }}
              />
            ))}
            {authKey.tags.length > 2 && (
              <Chip
                label={`+${authKey.tags.length - 2}`}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Updated {formatRelativeTime(authKey.updated_at)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="View details">
          <IconButton size="small" onClick={() => onClick(authKey)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <CopyButton value={authKey.value || ''} size="small" tooltip="Copy value" />
      </CardActions>
    </Card>
  );
};

AuthKeyCard.propTypes = {
  authKey: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AuthKeyCard;
